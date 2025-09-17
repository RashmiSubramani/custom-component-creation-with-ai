import { useState } from "react";
import { Moon, Download } from "lucide-react";
import { Button } from "./components/ui/button";
import PromptComposer from "./components/PromptComposer";
import SandpackStudio from "./components/SandpackStudio";
import { sampleProjectFiles } from "./sandbox/sampleProject";
import { loadReactTemplateForDownload } from "./sandbox/templateWithoutSDK";
import { generateComponent, modifyComponent } from "./services/llm";

function App() {
  const [projectFiles, setProjectFiles] = useState(sampleProjectFiles);
  const [isFirstPrompt, setIsFirstPrompt] = useState(true);
  const [compilationStatus, setCompilationStatus] = useState("pending");
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

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
      console.error("Error creating zip file:", error);
    }
  };

  const handleGenerateComponent = async (
    prompt,
    promptSelectedSuggestions = []
  ) => {
    // Update selected suggestions for SDK integration
    setSelectedSuggestions(promptSelectedSuggestions);
    try {
      if (isFirstPrompt) {
        // First prompt: Replace the existing DefaultLandingComponent
        const { componentCode } = await generateComponent(
          prompt,
          promptSelectedSuggestions
        );

        const newFiles = {
          ...projectFiles,
          // Replace the existing DefaultLandingComponent with generated component
          "/src/landing/index.jsx": componentCode,
        };

        setProjectFiles(newFiles);
        setIsFirstPrompt(false);
        setCompilationStatus("pending"); // Reset status for new generation

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

        const newFiles = {
          ...projectFiles,
          [existingComponentPath]: componentCode,
        };

        setProjectFiles(newFiles);
        setCompilationStatus("pending"); // Reset status for modification

        return {
          componentName: "DefaultLandingComponent",
          action: "modified",
          description: `Modified DefaultLandingComponent component successfully!`,
          waitForCompilation: true,
        };
      }
    } catch (error) {
      console.error("Component generation failed:", error);
      throw error;
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
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Pane - Chat Interface */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 h-full overflow-hidden flex-shrink-0">
            <PromptComposer
              onGenerateComponent={handleGenerateComponent}
              selectedSuggestions={selectedSuggestions}
              compilationStatus={compilationStatus}
            />
          </div>

          {/* Right Pane - Code & Preview */}
          <div className="flex-1 h-full flex flex-col min-w-0">
            <SandpackStudio
              showPreview={true}
              files={projectFiles}
              onCompilationStatus={setCompilationStatus}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
