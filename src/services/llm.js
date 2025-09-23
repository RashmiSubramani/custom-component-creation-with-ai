// LLM service for making API calls through backend proxy
// This avoids CORS issues by routing requests through your server

import { enhancePromptForShadCN } from "./componentDetector";
import { getComponentListForLLM } from "./shadcnComponentList";
// Removed unused imports - using simple approach now

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
  // Add ShadCN import instructions to the prompt
  const finalEnhancedPrompt = enhancePromptForShadCN(prompt);

  const componentList = getComponentListForLLM();
  
  const modifyPrompt = `Modify the existing React TypeScript component based on the user's request using ShadCN UI components.

${componentList}

User request: "${finalEnhancedPrompt}"
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

🎯 MODIFICATION REQUIREMENTS:
- Keep the same component name: ${componentName}
- **TYPESCRIPT**: Maintain TypeScript syntax with proper type annotations
- Ensure ": JSX.Element" return type on the main component function
- Add ": void" to event handler functions that don't return values
- Use proper TypeScript types for any new props, state, or variables
- **MANDATORY**: Use ShadCN UI components instead of basic HTML elements when making changes  
- **CRITICAL**: ONLY use @/components/ui/[component-name] import format - DO NOT use relative paths like ../components/ui/
- Example: import { Button } from "@/components/ui/button" (CORRECT)
- DO NOT use: import { Button } from "../components/ui/button" (WRONG)
- **CRITICAL**: DO NOT import external libraries (react-hook-form, zod, etc.) - use built-in React features only
- Use useState<Type> with proper TypeScript generics for any new state
- Use native form handling with TypeScript event types
- Preserve existing functionality unless specifically asked to change it
- Only modify what the user requested
- Maintain code quality and structure
- Include proper imports and exports for any new ShadCN components used
- Keep modifications focused on UI/UX improvements
- Avoid adding unnecessary API calls or external dependencies
- Use mock data if needed for demonstration purposes
- Maintain clean, self-contained component design
- **CRITICAL**: Use JSX comments {/* */} NOT HTML comments <!-- --> in JSX code
- **NEVER** use HTML comment syntax in JSX - it will cause syntax errors
- **CRITICAL**: ONLY use components that actually exist in ShadCN UI - verify component exists before using
- **NEVER** create or import non-existent ShadCN components - use standard HTML elements when ShadCN doesn't have equivalent`;

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

    // Post-process component code to fix any relative imports
    let componentCode = parsed.componentCode || existingCode;

    // Convert any relative imports to @/ format
    componentCode = componentCode.replace(
      /from\s+["']\.\.?\/components\/ui\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    );

    // Fix HTML comments to JSX comments
    componentCode = componentCode.replace(/<!--\s*(.*?)\s*-->/g, "{/* $1 */}");

    return {
      componentCode,
      cssCode: parsed.cssCode || existingCss,
    };
  } catch (error) {
    _sendErrorToast(error);
    throw new Error(`Component modification failed: ${error.message}`);
  }
}

// Removed generateComponentWithOptimization - using simple approach with all components loaded

/**
 * Generates React component code based on user prompt
 * @param {string} prompt - The user's component description
 * @param {Object[]} selectedSuggestions - Selected auto-suggestions from user
 * @returns {Promise<{componentCode: string, componentName: string, cssCode: string}>} - Generated code
 */
export async function generateComponent(prompt, selectedSuggestions = []) {
  // Add ShadCN import instructions to the prompt
  const finalEnhancedPrompt = enhancePromptForShadCN(prompt);

  const componentList = getComponentListForLLM();
  
  const codePrompt = `You are a React TypeScript component generator specialized in ShadCN UI components. Generate a TypeScript React component based on this description: "${finalEnhancedPrompt}"

${componentList}

IMPORTANT: Respond ONLY with valid JSON in this exact format:

{
  "componentName": "DefaultLandingComponent",
  "componentCode": "import React from 'react';\nimport { Button } from \"@/components/ui/button\";\nimport { Card, CardHeader, CardTitle, CardContent } from \"@/components/ui/card\";\n\nexport function DefaultLandingComponent(): JSX.Element {\n  function handleClick(): void {}\n  return (\n    <div className=\"w-full min-h-screen bg-gray-50 p-8\">\n      <Card className=\"max-w-2xl mx-auto shadow-lg\">\n        <CardHeader>\n          <CardTitle className=\"text-2xl font-bold text-gray-900\">Component Title</CardTitle>\n        </CardHeader>\n        <CardContent className=\"space-y-6\">\n          <Button onClick={handleClick} className=\"w-full\">Click me</Button>\n          {/* more component JSX using ShadCN components */}\n        </CardContent>\n      </Card>\n    </div>\n  );\n}",
  "cssCode": "/* CSS styles for the component */"
}

🎯 CRITICAL REQUIREMENTS:

- Component name must ALWAYS be "DefaultLandingComponent"
- **TYPESCRIPT**: Use TypeScript syntax with proper type annotations
- Add ": JSX.Element" return type to the main component function
- Add ": void" to event handler functions that don't return values
- **FOLLOW THE EXAMPLE EXACTLY**: The example template shows the CORRECT way to use components - copy that pattern exactly
- **ALWAYS** provide ALL required props for components to work properly - check documentation for mandatory props  
- Add proper TypeScript types for props, state, and variables
- Use modern functional component syntax with export function
- **MANDATORY**: Use ShadCN UI components instead of basic HTML elements
- **CRITICAL**: ONLY use @/components/ui/[component-name] import format - DO NOT use relative paths like ../components/ui/
- Example: import { Button } from "@/components/ui/button" (CORRECT)
- DO NOT use: import { Button } from "../components/ui/button" (WRONG)
- **CRITICAL**: DO NOT import external libraries (react-hook-form, zod, etc.) - use built-in React features only
- Use useState<Type> with proper TypeScript generics for state
- Use native form handling with TypeScript event types
- Include complete JSX return statement with ShadCN components
- Make it visually appealing using ShadCN component patterns
- Use Tailwind CSS classes for additional styling and layout
- Keep code clean and well-structured
- Use export function (not default export)
- **CRITICAL**: Use JSX comments {/* */} NOT HTML comments <!-- --> in JSX code
- **NEVER** use HTML comment syntax in JSX - it will cause syntax errors
- Make the component match EXACTLY the user's description
- DO NOT add any functionality not explicitly requested by the user
- Create a general-purpose UI component without API calls
- Focus on clean, reusable component design
- Use mock data if needed for demonstration
- Make it functional and interactive but self-contained
- **CRITICAL**: For Calendar components, ALWAYS use: mode="single", selected={dateState}, onSelect={setDateState}
- **NEVER** use "value" prop for Calendar - always use "selected"
- **CRITICAL**: ONLY use components that actually exist in ShadCN UI - verify component exists before using
- **NEVER** create or import non-existent ShadCN components - use standard HTML elements when ShadCN doesn't have equivalent
- For text content, use HTML elements like <p>, <span>, <div>, <h1>-<h6> instead of non-existent components


🎨 **ENHANCED STYLING REQUIREMENTS**:
- **ALWAYS** wrap components in a Card or similar container for better visual hierarchy
- Use proper spacing with consistent padding (p-6, p-8) and margins (space-y-4, space-y-6)
- Add background colors, borders, and shadows for depth (bg-white, border, shadow-lg)
- Include headers/titles with proper typography (text-2xl, font-bold, text-gray-900)
- Use semantic layout patterns (flex, grid) with proper alignment and gaps
- Add hover states and transitions for interactive elements (hover:bg-gray-50, transition-colors)
- Include visual feedback for user interactions (loading states, success messages)
- Use proper color schemes with consistent theme colors
- Add icons where appropriate to enhance visual appeal
- Ensure responsive design with proper breakpoints (sm:, md:, lg:)
- Use proper contrast ratios and accessibility features
- Include visual separators (borders, dividers) for content organization
- Add subtle animations or micro-interactions where appropriate
- Use proper button variants and sizes based on context
- Include placeholder content or example data to showcase functionality
- Ensure the component feels polished and production-ready, not just functional

🔧 **CRITICAL COMPONENT FUNCTIONALITY REQUIREMENTS**:
- **RESEARCH COMPONENT DOCUMENTATION**: Before using any component, understand what props are required vs optional
- **ALWAYS** provide ALL required props for components to work properly - check documentation for mandatory props
- **ALWAYS** implement complete state management with useState for ALL interactive components (forms, selections, inputs, etc.)
- **ALWAYS** provide proper event handlers that connect component props to state (onChange, onSelect, onSubmit, etc.)
- **ALWAYS** display current component state to the user so they can see interactions working
- Use proper sizing - avoid restrictive classes like w-fit, use w-full with sensible max-width containers
- Provide sensible default values and initial state that make components immediately functional
- Use proper TypeScript types for all state, props, and event handlers
- Include proper accessibility attributes and keyboard navigation
- Ensure every interactive element actually responds to user input with visible feedback
- Test mentally: "If I click/type/select something, will the user see a response?"

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

      // Post-process component code to fix any relative imports
      let componentCode =
        parsed.componentCode ||
        `import React from 'react';\n\nexport function DefaultLandingComponent() {\n  function handleClick(){}\n  return <div>Component generated from: ${prompt}</div>;\n}`;

      // Convert any relative imports to @/ format
      componentCode = componentCode.replace(
        /from\s+["']\.\.?\/components\/ui\/([^"']+)["']/g,
        'from "@/components/ui/$1"'
      );

      // Fix HTML comments to JSX comments
      componentCode = componentCode.replace(
        /<!--\s*(.*?)\s*-->/g,
        "{/* $1 */}"
      );

      return {
        componentName: parsed.componentName || "DefaultLandingComponent",
        componentCode,
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
