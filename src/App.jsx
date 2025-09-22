import React, { useState, useEffect } from "react";
import { Moon, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import PromptComposer from "./components/PromptComposer";
import SandpackStudio from "./components/SandpackStudio";
import { loadSampleProjectFiles } from "./sandbox/sampleProject";
import {
  loadReactTemplateForDownload,
  loadReactTemplateWithGitHubComponents,
} from "./sandbox/templateWithoutSDK";
import { generateComponent, modifyComponent } from "./services/llm";
import { detectShadCNComponents } from "./services/componentDetector";
function App() {
  const [projectFiles, setProjectFiles] = useState({});
  const [isFirstPrompt, setIsFirstPrompt] = useState(true);
  const [compilationStatus, setCompilationStatus] = useState("pending");
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [isLoadingInitialProject, setIsLoadingInitialProject] = useState(true);
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false);

  // Load initial project with ShadCN components
  useEffect(() => {
    const loadInitialProject = async () => {
      try {
        const initialFiles = await loadSampleProjectFiles();
        setProjectFiles(initialFiles);
      } catch (error) {
        // Fallback to empty state - user can still generate components
        setProjectFiles({});
      } finally {
        setIsLoadingInitialProject(false);
      }
    };

    loadInitialProject();
  }, []);

  // Track compilation status changes
  useEffect(() => {
    // Note: Compilation status tracking for UI updates
  }, [compilationStatus]);

  // Download project files as ZIP (with real SDK in package.json)
  const handleDownloadProject = () => {
    const downloadFiles = loadReactTemplateForDownload("my-component");
    downloadAsZip(downloadFiles, "project.zip");
  };

  // Simple ZIP download
  const downloadAsZip = async (files, filename) => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add all files to the zip
      Object.entries(files).forEach(([path, content]) => {
        const filePath = path.startsWith("/") ? path.slice(1) : path;
        const fileContent =
          typeof content === "string" ? content : content.code || "";
        zip.file(filePath, fileContent);
      });

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Silently fail for zip download errors
    }
  };

  const handleGenerateComponent = async (
    prompt,
    promptSelectedSuggestions = []
  ) => {
    // Update selected suggestions for component generation
    setSelectedSuggestions(promptSelectedSuggestions);
    if (isFirstPrompt) {
      // Set a temporary loading component to avoid Sandpack errors during generation
      const loadingComponent = `import React from 'react';

export function DefaultLandingComponent() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating component...</p>
      </div>
    </div>
  );
}`;

      setProjectFiles((prev) => ({
        ...prev,
        "/src/landing/index.jsx": loadingComponent,
      }));

      // First prompt: Replace the existing DefaultLandingComponent
      let componentCode;
      try {
        const result = await generateComponent(
          prompt,
          promptSelectedSuggestions
        );
        componentCode = result.componentCode;
      } catch (llmError) {
        throw new Error(`LLM generation failed: ${llmError.message}`);
      }

      // Detect which ShadCN components are used in the generated code
      const usedComponents = detectShadCNComponents(componentCode);

      // Clear cache for fresh component loading
      const { shadcnGitHubFetcher } = await import(
        "./services/shadcnGitHubFetcher.js"
      );
      shadcnGitHubFetcher.clearCache();

      // Create template with only the used components dynamically fetched from GitHub
      const baseFiles = await loadReactTemplateWithGitHubComponents(
        "my-component",
        usedComponents
      );

      // Transform @/ imports to relative imports for Sandpack compatibility
      const transformedComponentCode = componentCode.replace(
        /from\s+["']@\/components\/ui\/([^"']+)["']/g,
        'from "../components/ui/$1"'
      );

      const newFiles = {
        ...baseFiles,
        // Replace the existing DefaultLandingComponent with generated component
        "/src/landing/index.jsx": transformedComponentCode,
      };

      setProjectFiles(newFiles);
      setIsFirstPrompt(false);

      // Set success status immediately after successful component generation
      setTimeout(() => {
        setCompilationStatus("success");
      }, 1000); // Reduced to 1 second for faster UI response

      return {
        componentName: "DefaultLandingComponent",
        action: "replaced",
        description: `Generated component successfully! Replaced existing DefaultLandingComponent.`,
        waitForCompilation: true,
      };
    } else {
      // Subsequent prompts: Modify existing files
      const existingComponentPath = "/src/landing/index.jsx";
      const existingCode = projectFiles[existingComponentPath];

      const { componentCode } = await modifyComponent(
        prompt,
        "DefaultLandingComponent",
        existingCode,
        "", // No existing CSS
        promptSelectedSuggestions
      );

      // Detect any new components used in the modified code
      const usedComponents = detectShadCNComponents(componentCode);

      // Check if we need to fetch new components
      const currentComponentPaths = Object.keys(projectFiles).filter((path) =>
        path.startsWith("/src/components/ui/")
      );
      const currentComponents = currentComponentPaths.map((path) =>
        path.replace("/src/components/ui/", "").replace(".jsx", "")
      );

      const newComponents = usedComponents.filter(
        (comp) => !currentComponents.includes(comp)
      );

      let newFiles = { ...projectFiles };

      if (newComponents.length > 0) {
        // Fetch only the new components and add them to existing files
        const newComponentFiles = await loadReactTemplateWithGitHubComponents(
          "my-component",
          newComponents
        );

        // Merge only the new component files
        Object.keys(newComponentFiles).forEach((path) => {
          if (path.startsWith("/src/components/ui/") && !newFiles[path]) {
            newFiles[path] = newComponentFiles[path];
          }
        });
      }

      // Transform @/ imports to relative imports for Sandpack compatibility
      const transformedComponentCode = componentCode.replace(
        /from\s+["']@\/components\/ui\/([^"']+)["']/g,
        'from "../components/ui/$1"'
      );

      // Update the main component
      newFiles[existingComponentPath] = transformedComponentCode;

      setProjectFiles(newFiles);

      // Set success status immediately after successful component modification
      setTimeout(() => {
        setCompilationStatus("success");
      }, 1000); // Reduced to 1 second for faster UI response

      return {
        componentName: "DefaultLandingComponent",
        action: "modified",
        description: `Modified DefaultLandingComponent component successfully!`,
        waitForCompilation: true,
      };
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">⚡</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Component Forge
              </h1>
              <p className="text-xs text-gray-600">
                AI-Powered React Component Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="border border-gray-200"
              onClick={handleDownloadProject}
              title="Download project files"
            >
              <Download className="h-4 w-4 mr-1" />
              Download Project
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-gray-200"
              disabled
            >
              <Moon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Full Screen Layout */}
      <main className="flex-1 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full relative">
          {/* Left Pane - Chat Interface */}
          <div className={`${isPromptCollapsed ? 'w-0' : 'w-full lg:w-1/4'} border-r border-gray-200 h-full overflow-hidden flex-shrink-0 transition-all duration-300 ${isPromptCollapsed ? 'border-r-0' : ''}`}>
            <div className={`h-full ${isPromptCollapsed ? 'hidden' : 'block'}`}>
              <PromptComposer
                onGenerateComponent={handleGenerateComponent}
                selectedSuggestions={selectedSuggestions}
                compilationStatus={compilationStatus}
              />
            </div>
          </div>

          {/* Collapse Toggle Button */}
          <div className={`absolute top-1/2 transform -translate-y-1/2 z-20 transition-all duration-300 ${isPromptCollapsed ? 'left-2' : 'left-[calc(25%-24px)]'}`}>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white border border-gray-200 shadow-lg hover:bg-gray-50 rounded-full h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
            >
              {isPromptCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Right Pane - Code & Preview */}
          <div className="flex-1 h-full flex flex-col min-w-0">
            {isLoadingInitialProject ? (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading project with ShadCN components...
                  </p>
                </div>
              </div>
            ) : (
              <SandpackStudio
                showPreview={true}
                files={projectFiles}
                onCompilationStatus={setCompilationStatus}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
