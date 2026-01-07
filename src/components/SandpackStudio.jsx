import {
  SandpackProvider,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  Sandpack,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { FileText, Terminal, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// Component to monitor Sandpack compilation status
function CompilationMonitor({ onStatusChange }) {
  const { sandpack } = useSandpack();

  useEffect(() => {
    if (sandpack.status === "running") {
      onStatusChange?.("success");
    } else if (sandpack.status === "idle") {
      onStatusChange?.("pending");
    } else if (sandpack.error) {
      onStatusChange?.("error");
    }
  }, [sandpack.status, sandpack.error, onStatusChange]);

  return null;
}

// Extract dependencies from import statements
function extractDependencies(code) {
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  const dependencies = new Set();
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const packageName = match[1];
    // Skip relative imports, built-in modules, and React (already included)
    if (
      !packageName.startsWith(".") &&
      !packageName.startsWith("/") &&
      !["react", "react-dom"].includes(packageName)
    ) {
      // Extract base package name (handle scoped packages)
      const basePkg = packageName.startsWith("@")
        ? packageName.split("/").slice(0, 2).join("/")
        : packageName.split("/")[0];
      dependencies.add(basePkg);
    }
  }
  return Array.from(dependencies);
}

// Get latest version for a package (simplified)
async function getPackageVersion() {
  // For demo purposes, use 'latest' - in production you'd query npm API
  return "latest";
}

export default function SandpackStudio({
  showPreview = true,
  files,
  onCompilationStatus,
}) {
  const [extraDependencies, setExtraDependencies] = useState({});
  const [isUpdatingDeps, setIsUpdatingDeps] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("preview"); // "code" or "preview"
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  const projectFiles = files;

  // Extract dependencies from all files
  const extractAllDependencies = useCallback(async () => {
    const allDependencies = new Set();

    // Check all JavaScript files for imports
    Object.entries(files).forEach(([path, content]) => {
      if (path.endsWith(".jsx") || path.endsWith(".js")) {
        const fileDeps = extractDependencies(
          typeof content === "string" ? content : content.code || ""
        );
        fileDeps.forEach((dep) => allDependencies.add(dep));
      }
    });

    // Add new dependencies if found (only non-standard ones)
    const newDeps = { ...extraDependencies };
    let hasNewDeps = false;

    // Built-in packages that come with vite-react template
    const builtInPackages = ["react", "react-dom", "tailwindcss"];

    for (const dep of allDependencies) {
      if (!builtInPackages.includes(dep) && !newDeps[dep]) {
        newDeps[dep] = await getPackageVersion(dep);
        hasNewDeps = true;
      }
    }

    if (hasNewDeps) {
      setIsUpdatingDeps(true);
      setExtraDependencies(newDeps);
      setTimeout(() => setIsUpdatingDeps(false), 1000);
    }
  }, [files, extraDependencies]);

  // Update dependencies when files change
  useEffect(() => {
    extractAllDependencies();
  }, [extractAllDependencies]);

  // Create a key based on the files content and extra dependencies to force re-render
  const filesKey =
    JSON.stringify(Object.keys(files).sort()) +
    JSON.stringify(files["/src/landing/index.jsx"]?.slice(0, 100)) +
    JSON.stringify(extraDependencies) +
    refreshKey;

  // Force Sandpack refresh when files change
  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [files]);

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {isUpdatingDeps && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gray-50 border-b border-gray-200 px-4 py-2">
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
            Installing new dependencies...
          </div>
        </div>
      )}
      {/* 
        Height fix: flex-1 min-h-0 ensures the Sandpack component takes full available height
        This layout is compatible with both Sandpack and SandpackProvider wrapper patterns
        CSS rules in index.css (.sp-wrapper, .sp-layout, etc.) provide additional height enforcement
      */}
      <div className="flex-1 min-h-0">
        <SandpackProvider
          key={filesKey}
          theme="light"
          customSetup={{
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              tailwindcss: "^3.4.0",
              postcss: "^8.4.31",
              autoprefixer: "^10.4.16",
              "class-variance-authority": "^0.7.0",
              clsx: "^2.0.0",
              "tailwind-merge": "^2.0.0",
              "lucide-react": "^0.263.1",
            },
            devDependencies: {
              "@types/react": "^18.2.15",
              "@types/react-dom": "^18.2.7",
              "@vitejs/plugin-react": "^4.0.3",
              typescript: "^5.2.2",
              vite: "^4.4.5",
            },
            entry: "/src/main.tsx",
          }}
          files={projectFiles}
          options={{
            externalResources: [
              "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
            ],
            activeFile: "/src/landing/index.tsx",
            resizablePanels: true,
          }}
          template="react-ts"
          style={{
            height: "100%",
          }}
        >
          <SandpackLayout>
            <CompilationMonitor onStatusChange={onCompilationStatus} />
            <div className="flex flex-col h-full w-full">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
                {showPreview && (
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "preview"
                        ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Preview
                  </button>
                )}
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "code"
                      ? "text-gray-900 border-b-2 border-gray-900 bg-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Code
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 min-h-0">
                {/* Code Tab - File Explorer + Code Editor */}
                <div
                  className={`flex flex-col lg:flex-row h-full ${
                    activeTab === "code" ? "block" : "hidden"
                  }`}
                >
                  {/* File Explorer */}
                  <div className="w-full lg:w-64 lg:min-w-64 lg:max-w-64 border-r border-gray-200 bg-white flex flex-col h-full flex-shrink-0">
                    <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Files
                      </h3>
                    </div>
                    <div className="flex-1 overflow-auto min-h-0">
                      <SandpackFileExplorer
                        autoHiddenFiles={true}
                        style={{
                          height: "100%",
                          minHeight: "300px",
                          maxWidth: "256px",
                          width: "256px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 flex flex-col h-full">
                    <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Editor
                      </h3>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                      <SandpackCodeEditor
                        showTabs={false}
                        showLineNumbers={true}
                        showInlineErrors={true}
                        wrapContent={true}
                        readOnly={false}
                        style={{
                          height: "100%",
                          fontSize: "14px",
                          overflow: "auto",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Tab - Preview with Console */}
                {showPreview && (
                  <div
                    className={`h-full w-full flex flex-col ${
                      activeTab === "preview" ? "block" : "hidden"
                    }`}
                  >
                    {/* Preview Area */}
                    <div
                      className={`w-full overflow-hidden ${
                        isConsoleOpen ? "flex-1" : "h-full"
                      }`}
                    >
                      <SandpackPreview
                        style={{
                          height: "100%",
                          width: "100%",
                          maxWidth: "100%",
                        }}
                        showOpenInCodeSandbox={true}
                        showRefreshButton={true}
                        actionsChildren={false}
                      />
                    </div>

                    {/* Console Toggle Button */}
                    <div className="border-t border-gray-200 bg-gray-50 px-3 py-2 flex items-center justify-between flex-shrink-0">
                      <button
                        onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Terminal className="h-4 w-4" />
                        Console
                        {isConsoleOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Console Area */}
                    {isConsoleOpen && (
                      <div className="h-48 border-t border-gray-200 bg-white flex-shrink-0">
                        <SandpackConsole
                          style={{
                            height: "100%",
                            fontSize: "13px",
                          }}
                          showHeader={false}
                          showSyntaxError={true}
                          showOpenInCodeSandbox={false}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
}
