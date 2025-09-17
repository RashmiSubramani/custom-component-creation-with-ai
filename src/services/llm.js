// LLM service for making API calls through backend proxy
// This avoids CORS issues by routing requests through your server

import { generateSDKEnhancedPrompt } from "../utils/sdkCommandMatcher";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

/**
 * Makes an LLM API call with the given prompt
 * @param {string} prompt - The user's prompt
 * @returns {Promise<string>} - The LLM response
 */
export async function callLLM(prompt, model = "openai") {
  try {
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      _sendErrorToast(
        new Error(
          "Cannot connect to server. Make sure the backend server is running on port 3001."
        )
      );
    }
    throw error;
  }
}

function _sendErrorToast(error) {
  // This is a placeholder. In a real app, you would use a toast library.
  // For example: toast.error(`API Error: ${error.message}`);
  console.error("Toast-worthy error:", error);
}

/**
 * Analyzes if the prompt is asking to modify existing component or create new one
 * @param {string} prompt - The user's prompt
 * @param {Object} existingFiles - Current project files
 * @returns {Promise<{action: 'modify'|'create'|'ask', componentName?: string, confidence: number}>}
 */
export async function analyzePromptIntent(prompt, existingFiles) {
  const componentNames = Object.keys(existingFiles)
    .filter((path) => path.includes("/components/") && path.endsWith(".jsx"))
    .map((path) => path.split("/").pop().replace(".jsx", ""));

  if (componentNames.length === 0) {
    return { action: "create", confidence: 1.0 };
  }

  const analysisPrompt = `Analyze this user prompt to determine if they want to modify an existing component or create a new one.

User prompt: "${prompt}"

Existing components: ${componentNames.join(", ")}

Modification indicators:
- Words like: "change", "modify", "update", "make it", "add", "remove", "fix", "improve", "adjust"
- Color changes, size changes, style tweaks
- Adding/removing features to existing functionality

Creation indicators:  
- Words like: "create", "build", "new", "make a"
- Completely different functionality
- Different component type

Respond with JSON only:
{
  "action": "modify|create|ask",
  "componentName": "ExistingComponentName",
  "confidence": 0.8,
  "reasoning": "Brief explanation"
}

Use "ask" if confidence < 0.7 or ambiguous.`;

  try {
    const response = await callLLM(analysisPrompt, "openai");
    let cleanResponse = response.trim();

    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    const analysis = JSON.parse(cleanResponse);
    return {
      action: analysis.action || "ask",
      componentName: analysis.componentName,
      confidence: analysis.confidence || 0.5,
      reasoning: analysis.reasoning,
    };
  } catch (error) {
    console.warn("Failed to analyze prompt intent:", error);
    _sendErrorToast(error);
    return { action: "ask", confidence: 0.0 };
  }
}

/**
 * Modifies an existing component based on user prompt
 * @param {string} prompt - The modification request
 * @param {string} componentName - Name of component to modify
 * @param {string} existingCode - Current component code
 * @param {string} existingCss - Current CSS code
 * @param {Object[]} selectedSuggestions - Selected auto-suggestions from user
 * @returns {Promise<{componentCode: string, cssCode: string}>}
 */
export async function modifyComponent(
  prompt,
  componentName,
  existingCode,
  existingCss,
  selectedSuggestions = []
) {
  // Only enhance with SDK commands if user has selected suggestions or prompt contains SDK patterns
  const hasSelectedSuggestions = selectedSuggestions && selectedSuggestions.length > 0;
  const sdkEnhancement = generateSDKEnhancedPrompt(prompt, selectedSuggestions);
  
  // More strict check: only use SDK if user explicitly selected suggestions
  // OR if prompt contains specific entity references (not just generic words like "table")
  const hasEntityContext = hasSelectedSuggestions || 
    (sdkEnhancement.hasSDKCommands && Object.keys(sdkEnhancement.entityIds).length > 0);
  
  const shouldUseSDK = hasEntityContext;
  
  const enhancedPrompt = shouldUseSDK && sdkEnhancement.hasSDKCommands
    ? sdkEnhancement.enhancedPrompt
    : prompt;

  const modifyPrompt = `Modify the existing React component based on the user's request.

User request: "${enhancedPrompt}"
Component name: ${componentName}

Current component code:
${existingCode}

Current CSS code:
${existingCss}

IMPORTANT: Respond ONLY with valid JSON:
{
  "componentCode": "modified component code here",
  "cssCode": "modified CSS code here"
}

Requirements:
- Keep the same component name: ${componentName}
- Preserve existing functionality unless specifically asked to change it
- Only modify what the user requested
- Maintain code quality and structure
- Include proper imports and exports
${
  shouldUseSDK && sdkEnhancement.hasSDKCommands
    ? `
- IMPORTANT: Integrate ONLY the provided Kissflow SDK commands
- Initialize SDK if not already present: const kf = await KFSDK.initialize();
- Use exact entity IDs: ${JSON.stringify(sdkEnhancement.entityIds)}
- Add proper error handling for SDK operations
- DO NOT add extra functionality not requested by the user
- Focus only on the specific modification requested in the prompt`
    : `
- Keep modifications focused on UI/UX improvements
- Avoid adding unnecessary API calls or external dependencies
- Use mock data if needed for demonstration purposes
- Maintain clean, self-contained component design`
}`;

  try {
    const response = await callLLM(modifyPrompt, "openai");
    let cleanResponse = response.trim();

    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(cleanResponse);
    return {
      componentCode: parsed.componentCode || existingCode,
      cssCode: parsed.cssCode || existingCss,
    };
  } catch (error) {
    _sendErrorToast(error);
    throw new Error(`Component modification failed: ${error.message}`);
  }
}

/**
 * Generates React component code based on user prompt
 * @param {string} prompt - The user's component description
 * @param {Object[]} selectedSuggestions - Selected auto-suggestions from user
 * @returns {Promise<{componentCode: string, componentName: string, cssCode: string}>} - Generated code
 */
export async function generateComponent(prompt, selectedSuggestions = []) {
  // Only enhance with SDK commands if user has selected suggestions or prompt contains SDK patterns
  const hasSelectedSuggestions = selectedSuggestions && selectedSuggestions.length > 0;
  const sdkEnhancement = generateSDKEnhancedPrompt(prompt, selectedSuggestions);
  
  // More strict check: only use SDK if user explicitly selected suggestions
  // OR if prompt contains specific entity references (not just generic words like "table")
  const hasEntityContext = hasSelectedSuggestions || 
    (sdkEnhancement.hasSDKCommands && Object.keys(sdkEnhancement.entityIds).length > 0);
  
  const shouldUseSDK = hasEntityContext;
  
  const enhancedPrompt = shouldUseSDK && sdkEnhancement.hasSDKCommands
    ? sdkEnhancement.enhancedPrompt
    : prompt;

  const codePrompt = `You are a React component generator. Generate a React component based on this description: "${enhancedPrompt}"

IMPORTANT: Respond ONLY with valid JSON in this exact format:

{
  "componentName": "DefaultLandingComponent",
  "componentCode": "import React from 'react';\n\nexport function DefaultLandingComponent() {\n  function handleClick(){}\n  return (\n    <div>\n      {/* component JSX */}\n    </div>\n  );\n}",
  "cssCode": "/* CSS styles for the component */"
}

Requirements:

- Component name must ALWAYS be "DefaultLandingComponent"
- Use modern functional component syntax with export function
- Include complete JSX return statement
- Make it visually appealing with good styling
- Use Tailwind CSS classes that work well
- Keep code clean and well-structured
- Use export function (not default export)
- Make the component match EXACTLY the user's description
- DO NOT add any functionality not explicitly requested by the user
${
  shouldUseSDK && sdkEnhancement.hasSDKCommands
    ? `
- IMPORTANT: Use ONLY the provided Kissflow SDK commands exactly as specified
- Initialize SDK with: const kf = await KFSDK.initialize();
- Include proper async/await patterns for SDK calls
- Add error handling for API calls
- Use the exact entity IDs provided: ${JSON.stringify(
        sdkEnhancement.entityIds
      )}
- DO NOT add extra functionality not requested by the user
- Focus only on the specific operation requested in the prompt
- If user asks for "list data", do NOT add create/update/delete functions
- If user asks for "create form", do NOT add list/display functions
- Implement ONLY what was explicitly requested`
    : `
- Create a general-purpose UI component without API calls
- Focus on clean, reusable component design
- Use mock data if needed for demonstration
- Make it functional and interactive but self-contained`
}

Do not include any explanatory text, only the JSON response.
`;

  try {
    const response = await callLLM(codePrompt, "openai");

    // Clean and parse the JSON response
    let cleanResponse = response.trim();

    // Remove code block markers if present
    if (cleanResponse.startsWith("```json")) {
      cleanResponse = cleanResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanResponse.startsWith("```")) {
      cleanResponse = cleanResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(cleanResponse);
      return {
        componentName: parsed.componentName || "DefaultLandingComponent",
        componentCode:
          parsed.componentCode ||
          `import React from 'react';\n\nexport function DefaultLandingComponent() {\n  function handleClick(){}\n  return <div>Component generated from: ${prompt}</div>;\n}`,
        cssCode: parsed.cssCode || "/* Generated styles */",
      };
    } catch (err) {
      // Fallback if JSON parsing fails
      return {
        componentName: "DefaultLandingComponent",
        componentCode: `export function DefaultLandingComponent() {
  const rawResponse = \`${response
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$")}\`;
  
  return (
    <div style={{padding: '20px', textAlign: 'center'}}>
      <h2>Generated Component</h2>
      <p>Based on: ${prompt}</p>
      <div style={{
        backgroundColor: '#f0f8ff',
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <p>The AI response couldn't be parsed as JSON. Here's the raw response:</p>
        <pre style={{fontSize: '12px', textAlign: 'left', whiteSpace: 'pre-wrap'}}>{rawResponse}</pre>
      </div>
    </div>
  );
}

`,
        cssCode: `/* Fallback styles */
.generated-component {
  padding: 20px;
  text-align: center;
}`,
      };
    }
  } catch (error) {
    _sendErrorToast(error);
    throw new Error(`Code generation failed: ${error.message}`);
  }
}
