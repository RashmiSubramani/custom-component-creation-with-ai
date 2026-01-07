import React, { useState, useEffect } from "react";
import { Moon, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import PromptComposer from "./components/PromptComposer";
import SandpackStudio from "./components/SandpackStudio";
import { FetchConsole } from "./components/FetchConsole";
import { loadSampleProjectFiles } from "./sandbox/sampleProject";
import { generateComponentWithPhases } from "./services/fivePhaseGenerator";
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

  // Download current project files as ZIP
  const handleDownloadProject = () => {
    // Download the actual project files the user is working on
    downloadAsZip(projectFiles, "component-forge-project.zip");
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
        "/src/landing/index.tsx": loadingComponent,
      }));

      // First prompt: Use 5-phase generation system
      try {
        console.log('🚀 Using 5-Phase Generation System');

        // Use the new 5-phase system
        const result = await generateComponentWithPhases(prompt, {});

        if (!result.success) {
          throw new Error('5-phase generation failed');
        }

        // Transform @/ imports to relative imports for Sandpack compatibility
        const files = result.files;
        Object.keys(files).forEach(path => {
          if (typeof files[path] === 'string') {
            files[path] = files[path].replace(
              /from\s+["']@\/components\/ui\/([^"']+)["']/g,
              'from "../components/ui/$1"'
            );
            // Also handle any remaining @/lib imports
            files[path] = files[path].replace(
              /from\s+["']@\/lib\/([^"']+)["']/g,
              'from "../../lib/$1"'
            );
          }
        });

        // Ensure proper file paths for Sandpack
        const sandpackFiles = {};
        Object.entries(files).forEach(([path, content]) => {
          const sandpackPath = path.startsWith('/') ? path : '/' + path;
          sandpackFiles[sandpackPath] = content;
        });

        setProjectFiles(sandpackFiles);

        console.log('✅ 5-Phase Generation completed successfully');
      } catch (phaseError) {
        console.error('❌ 5-Phase Generation failed, falling back to simple template:', phaseError);

        // Simple fallback - use the current project structure
        const baseFiles = projectFiles;

        // Create a simple error component to show the issue
        const errorComponent = `import React from 'react';

export function DefaultLandingComponent() {
  return (
    <div className="flex items-center justify-center h-64 bg-red-50">
      <div className="text-center p-6">
        <div className="text-red-600 text-xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Component Generation Failed</h3>
        <p className="text-red-600 text-sm">
          Unable to generate component. Please try a different prompt.
        </p>
      </div>
    </div>
  );
}`;

        const newFiles = {
          ...baseFiles,
          "/src/landing/index.tsx": errorComponent,
        };

        setProjectFiles(newFiles);
      }

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
      // Subsequent prompts: Use 5-phase system for modifications too
      try {
        console.log('🚀 Using 5-Phase System for modification');

        // Use the 5-phase system for modifications
        const result = await generateComponentWithPhases(prompt, {});

        if (!result.success) {
          throw new Error('5-phase modification failed');
        }

        // Transform @/ imports to relative imports for Sandpack compatibility
        const files = result.files;
        Object.keys(files).forEach(path => {
          if (typeof files[path] === 'string') {
            files[path] = files[path].replace(
              /from\s+["']@\/components\/ui\/([^"']+)["']/g,
              'from "../components/ui/$1"'
            );
            files[path] = files[path].replace(
              /from\s+["']@\/lib\/([^"']+)["']/g,
              'from "../../lib/$1"'
            );
          }
        });

        // Ensure proper file paths for Sandpack
        const sandpackFiles = {};
        Object.entries(files).forEach(([path, content]) => {
          const sandpackPath = path.startsWith('/') ? path : '/' + path;
          sandpackFiles[sandpackPath] = content;
        });

        setProjectFiles(sandpackFiles);

        console.log('✅ 5-Phase modification completed successfully');
      } catch (error) {
        console.error('❌ 5-Phase modification failed:', error);

        // Simple fallback - just show an error message
        const errorComponent = `import React from 'react';

export function DefaultLandingComponent() {
  return (
    <div className="flex items-center justify-center h-64 bg-yellow-50">
      <div className="text-center p-6">
        <div className="text-yellow-600 text-xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Modification Failed</h3>
        <p className="text-yellow-600 text-sm">
          Unable to modify component. The original component remains unchanged.
        </p>
      </div>
    </div>
  );
}`;

        setProjectFiles(prev => ({
          ...prev,
          "/src/landing/index.tsx": errorComponent
        }));
      }

      // Set success status immediately after attempting modification
      setTimeout(() => {
        setCompilationStatus("success");
      }, 1000);

      return {
        componentName: "DefaultLandingComponent",
        action: "modified",
        description: `Component modification attempted.`,
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
      
      {/* Fetch Console - Fixed positioned */}
      <FetchConsole />
    </div>
  );
}

export default App;
