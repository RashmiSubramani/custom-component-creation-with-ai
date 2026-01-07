// 5-Phase Custom Component Generation System
// Direct implementation of the Python 5-phase workflow

import { callLLM } from "./llm.js";

/**
 * 5-Phase Custom Component Generation System
 *
 * Phase 1: Design - Component Selection with LLM
 * Phase 2: ShadCN Registry - Fetch Component Code
 * Phase 3: Backend Merge - Integrate Components
 * Phase 4: Code Generation - Generate with Claude
 * Phase 5: Final Integration - Return Complete App
 */

/**
 * Main entry point for 5-phase component generation
 * @param {string} userPrompt - User's description of desired component
 * @param {Object} selectedFlows - Selected flows/forms from user context
 * @returns {Promise<Object>} - Complete application codebase with generated component
 */
export async function generateComponentWithPhases(
  userPrompt,
  selectedFlows = {}
) {
  console.log(`🚀 Starting 5-Phase workflow for prompt: ${userPrompt}`);

  try {
    // Base application template
    const baseCode = getBaseApplicationTemplate();

    // Phase 1: Design - Component Selection
    const selectedComponents = await phaseDesign(userPrompt, baseCode);

    let mergedCode;
    if (!selectedComponents || selectedComponents.length === 0) {
      // Skip phases 2 and 3 if no components selected
      mergedCode = baseCode;
    } else {
      // Phase 2: ShadCN Registry - Fetch Components
      const componentData = await phaseShadcnRegistry(selectedComponents);

      // Phase 3: Backend Merge - Integrate Components
      mergedCode = await phaseBackendMerge(baseCode, componentData);
    }

    // Phase 4: Code Generation - Generate Component
    const generatedComponent = await phaseCodeGeneration(
      userPrompt,
      mergedCode,
      selectedFlows
    );

    // Phase 5: Final Integration - Complete Application
    const finalCode = phaseFinalIntegration(mergedCode, generatedComponent);

    console.log("✅ 5-Phase workflow completed successfully");

    return {
      success: true,
      files: finalCode,
      metadata: {
        selectedComponents,
        userPrompt,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("❌ 5-Phase workflow failed:", error);
    throw new Error(`5-Phase generation failed: ${error.message}`);
  }
}

/**
 * Extract component names from existing code
 * @param {Object} existingCode - Project files
 * @returns {string[]} - Array of component names
 */
function getUIComponentsFromCode(existingCode) {
  const prefix = "src/components/ui/";
  const names = [];

  for (const path in existingCode) {
    if (path.startsWith(prefix) || path.startsWith("/" + prefix)) {
      const fileName = path.replace(prefix, "").replace("/" + prefix, "");
      const name = fileName.replace(/\.(tsx|ts|jsx|js)$/, "");
      names.push(name);
    }
  }

  return names;
}

/**
 * Base React TypeScript application template
 * @returns {Object} - Base project files
 */
function getBaseApplicationTemplate() {
  return {
    "/index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Custom React Component</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: '#1E40AF',
              secondary: '#9333EA'
            }
          }
        }
      };
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>`,
    "/package.json": JSON.stringify(
      {
        name: "custom-component-project",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          clsx: "^2.0.0",
          "tailwind-merge": "^2.0.0",
        },
        devDependencies: {
          "@types/react": "^18.2.64",
          "@types/react-dom": "^18.2.21",
          "@vitejs/plugin-react": "^4.2.1",
          typescript: "^5.2.2",
          vite: "^5.1.6",
        },
      },
      null,
      2
    ),
    "/tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          baseUrl: ".",
          paths: {
            "@/*": ["src/*"],
          },
        },
        include: ["src"],
        references: [{ path: "./tsconfig.node.json" }],
      },
      null,
      2
    ),
    "/src/lib/utils.ts": `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,
    "/src/main.tsx": `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(<App />);`,
    "/src/App.tsx": `import React from "react";
import { DefaultLandingComponent } from "./landing";

function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <DefaultLandingComponent />
    </div>
  );
}

export default App;`,
    "/src/landing/index.tsx": `import React from 'react';

interface LandingProps {
  kf?: any;
}

export function DefaultLandingComponent({ kf }: LandingProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full text-center space-y-12">
          <h1 className="text-2xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
            Hi {kf?.user?.Name || 'Creator'}, Welcome to Component Forge
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into beautiful React components with AI assistance.
          </p>
        </div>
      </div>
    </div>
  );
}`,
  };
}

/**
 * Phase 1: Analyze user prompt to determine ShadCN UI components needed
 * @param {string} userPrompt - User's component description
 * @param {Object} existingCode - Current project files
 * @returns {Promise<string[]>} - Array of component names needed
 */
async function phaseDesign(userPrompt, existingCode) {
  console.log("🎨 Phase 1: Design - Analyzing prompt for ShadCN components...");

  try {
    // Use predefined component list for consistent results
    const shadcnComponents = [
      // Form & Input
      "form", "field", "button", "button-group", "input", "input-group", "input-otp", "textarea", "checkbox", "radio-group", "select", "switch", "slider", "calendar", "label",
      // Layout & Navigation
      "accordion", "breadcrumb", "navigation-menu", "sidebar", "tabs", "separator", "scroll-area", "resizable",
      // Overlays & Dialogs
      "dialog", "alert-dialog", "sheet", "drawer", "popover", "tooltip", "hover-card", "context-menu", "dropdown-menu", "menubar", "command",
      // Feedback & Status
      "alert", "toast", "progress", "spinner", "skeleton", "badge", "empty",
      // Display & Media
      "avatar", "card", "table", "chart", "carousel", "aspect-ratio", "item", "kbd",
      // Misc
      "collapsible", "toggle", "toggle-group", "pagination"
    ];

    // Debug: Show what components we fetched
    console.log("📦 Total ShadCN components fetched:", shadcnComponents.length);
    console.log(
      "📦 First 20 components:",
      shadcnComponents.slice(0, 20).join(", ")
    );
    console.log("📦 All components:", shadcnComponents.join(", "));

    // Get existing components
    const existingComponents = getUIComponentsFromCode(existingCode);

    const prompt = `Based on this user request: "${userPrompt}", return the additional components needed.

Available ShadCN components: ${shadcnComponents.join(", ")}
Components used currently in existing code: ${existingComponents.join(", ")}

For user request "create datatable", you should return: {"values": ["table", "button", "input", "select"]}

Return only component names as a JSON object: {"values": ["component1", "component2"]}`;

    console.log("🔧 Sending prompt to AI:", prompt);

    const aiResponse = await callLLM(prompt, "openai");

    // Parse AI response
    let content = aiResponse.trim();
    console.log("🔍 Phase 1 AI Response:", content);

    let selectedComponents = [];

    try {
      // Extract JSON from response even if AI gives explanation
      const jsonMatch = content.match(/\{[^}]*"values"\s*:\s*\[[^\]]*\][^}]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }

      // Remove markdown code blocks if present
      if (content.startsWith("```json")) {
        content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (content.startsWith("```")) {
        content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Handle empty values case first
      if (
        content.includes('{"values": []}') ||
        content.includes('"values":[]')
      ) {
        console.log("✅ Phase 1: No additional components needed");
        return [];
      }

      // Parse JSON response
      const parsed = JSON.parse(content);
      selectedComponents = parsed.values || [];
    } catch (parseError) {
      console.warn(
        "⚠️ JSON parsing failed, trying array fallback:",
        parseError
      );

      // Fallback: try to extract array directly
      const arrayMatch = content.match(/\[([^\]]*)\]/);
      if (arrayMatch) {
        const componentsStr = arrayMatch[1];
        selectedComponents = componentsStr
          .split(",")
          .map((comp) => comp.replace(/["\s]/g, ""))
          .filter((comp) => comp);
        console.log("Extracted components from array match:", selectedComponents);
      }
    }

    // Handle empty array case (exactly like Python)
    if (
      content.includes('{"values": []}') ||
      content.includes('"values":[]')
    ) {
      console.log("✅ Phase 1: No additional components needed");
      return [];
    }

    const parsed = JSON.parse(content);
    console.log("parsed_json", parsed);
    const selected = parsed.values || [];
    console.log("selected", selected);

    console.log(`✅ Phase 1 components returning: ${selected.join(", ")}`);
    return selected;
  } catch (error) {
    console.warn("⚠️ Phase 1 failed, returning empty array:", error);
    return [];
  }
}

/**
 * Phase 2: Fetch actual component code from ShadCN registry
 * @param {string[]} componentList - Array of component names to fetch
 * @returns {Promise<Object>} - Map of component data
 */
async function phaseShadcnRegistry(componentList) {
  console.log("📦 Phase 2: ShadCN Registry - Fetching component code...");

  const componentData = {};

  for (const componentName of componentList) {
    try {
      const url = `https://ui.shadcn.com/r/styles/default/${componentName}.json`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`⚠️ Failed to fetch ${componentName}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const componentCode = data.files?.[0]?.content || "";
      const componentDependencies = data.dependencies || [];

      componentData[componentName] = {
        componentCode,
        componentDependencies,
      };

      console.log(`✅ Fetched ${componentName}`);
    } catch (error) {
      console.warn(`⚠️ Error fetching ${componentName}:`, error);
    }
  }

  console.log(
    `📊 Phase 2: Successfully fetched ${
      Object.keys(componentData).length
    } components`
  );
  return componentData;
}

/**
 * Phase 3: Integrate ShadCN components into base application
 * @param {Object} baseCode - Base project files
 * @param {Object} componentData - Fetched component data
 * @returns {Promise<Object>} - Merged project files
 */
async function phaseBackendMerge(baseCode, componentData) {
  console.log("🔧 Phase 3: Backend Merge - Integrating components...");

  const mergedCode = { ...baseCode };
  const allDependencies = {};

  // Add component files with import path transformation
  for (const [componentName, componentInfo] of Object.entries(componentData)) {
    if (componentInfo.componentCode) {
      const filePath = `/src/components/ui/${componentName}.tsx`;

      // Transform import paths from ShadCN registry format to our project structure
      let transformedCode = componentInfo.componentCode
        .replace(
          /@\/registry\/default\/ui\//g,
          "@/components/ui/"
        )
        .replace(
          /@\/registry\/default\/lib\//g,
          "@/lib/"
        )
        .replace(
          /from\s+["']@\/registry\/[^"']*\/ui\/([^"']+)["']/g,
          'from "@/components/ui/$1"'
        )
        .replace(
          /from\s+["']@\/registry\/[^"']*\/lib\/([^"']+)["']/g,
          'from "@/lib/$1"'
        );

      // Additional fix for components importing other ui components
      // Since all components are in the same /src/components/ui/ directory,
      // they should use relative imports like "./button" instead of "@/components/ui/button"
      transformedCode = transformedCode
        .replace(
          /from\s+["']@\/components\/ui\/([^"']+)["']/g,
          'from "./$1"'
        )
        .replace(
          /from\s+["']\.\.\/components\/ui\/([^"']+)["']/g,
          'from "./$1"'
        );

      mergedCode[filePath] = transformedCode;
      console.log(`📁 Added ${filePath}`);
    }

    // Collect dependencies
    for (const dep of componentInfo.componentDependencies || []) {
      const depName = typeof dep === "string" ? dep : dep.name;
      const depVersion =
        typeof dep === "string" ? "latest" : dep.version || "latest";
      if (depName) {
        allDependencies[depName] = depVersion;
      }
    }
  }

  // Update package.json with dependencies
  if (mergedCode["/package.json"]) {
    const packageJson = JSON.parse(mergedCode["/package.json"]);
    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...allDependencies,
    };
    mergedCode["/package.json"] = JSON.stringify(packageJson, null, 2);
    console.log(
      `📦 Added ${Object.keys(allDependencies).length} dependencies:`,
      Object.keys(allDependencies)
    );
  }

  console.log("✅ Phase 3: Components integrated successfully");
  console.log("📋 Final merged code files:", Object.keys(mergedCode));
  return mergedCode;
}

/**
 * Phase 4: Generate DefaultLandingComponent using AI
 * @param {string} userPrompt - User's component description
 * @param {Object} mergedCode - Project files with components
 * @param {Object} selectedFlows - Selected flows/forms
 * @returns {Promise<string>} - Generated component code
 */
async function phaseCodeGeneration(userPrompt, mergedCode, selectedFlows = {}) {
  console.log("🤖 Phase 4: Code Generation - Generating component...");

  // Get available components
  const availableComponents = Object.keys(mergedCode)
    .filter(
      (path) =>
        path.startsWith("/src/components/ui/") ||
        path.startsWith("src/components/ui/")
    )
    .map((path) => path.split("/").pop().replace(".tsx", ""));

  console.log("Available components:", availableComponents);

  const systemPrompt = `You are an expert React TypeScript component generator.

CRITICAL REQUIREMENTS:
1. Generate ONLY the TSX component code for "src/landing/index.tsx"
2. Component MUST be named: export function DefaultLandingComponent(): JSX.Element
3. Use clean, modern component structure without external dependencies
4. MANDATORY: Include necessary import statements from "@/components/ui/*" for available components
5. Use the imported components based on user request
6. Use Tailwind CSS for styling
7. Use lucide-react icons when needed
8. Make responsive UI
9. Create modern, responsive components with clean design

CRITICAL IMPORT RULES:
- ALWAYS use lowercase file names in imports: "@/components/ui/button" NOT "@/components/ui/Button"
- Component names in imports should match the actual exported names from the files
- Available component files: ${availableComponents
    .map((comp) => `"${comp}"`)
    .join(", ")}
- Example correct imports:
  - import { Button } from "@/components/ui/button";
  - import { Card, CardHeader, CardContent } from "@/components/ui/card";
  - import { Table, TableBody, TableCell } from "@/components/ui/table";

AVAILABLE COMPONENTS: ${availableComponents.join(", ")}

Return ONLY the complete TSX component code in a markdown fenced code block with tsx extension.`;

  const userMessage = `Create a component for: "${userPrompt}". Selected Flows: ${JSON.stringify(
    selectedFlows
  )}. Return only the TSX code.`;

  try {
    const response = await callLLM(
      `${systemPrompt}\n\nUser Request: ${userMessage}`,
      "openai"
    );

    // Extract code from markdown if present
    let generatedCode = response.trim();
    const codeMatch = generatedCode.match(/```tsx\n([\s\S]*?)\n```/);
    if (codeMatch) {
      generatedCode = codeMatch[1];
    } else {
      // If no markdown, try to find the component code
      const componentMatch = generatedCode.match(
        /import[\s\S]*?export function DefaultLandingComponent[\s\S]*/
      );
      if (componentMatch) {
        generatedCode = componentMatch[0];
      }
    }

    console.log("✅ Phase 4: Component generated successfully");
    return generatedCode;
  } catch (error) {
    console.error("❌ Phase 4 failed:", error);
    throw new Error(`Code generation failed: ${error.message}`);
  }
}

/**
 * Phase 5: Final integration - replace landing component
 * @param {Object} mergedCode - Project files with components
 * @param {string} generatedComponent - Generated component code
 * @returns {Object} - Final project files
 */
function phaseFinalIntegration(mergedCode, generatedComponent) {
  console.log("🏗️ Phase 5: Final Integration - Completing application...");

  const finalCode = { ...mergedCode };
  finalCode["/src/landing/index.tsx"] = generatedComponent;

  console.log("✅ Phase 5: Final integration completed");
  console.log("📋 Final project files:", Object.keys(finalCode));
  return finalCode;
}
