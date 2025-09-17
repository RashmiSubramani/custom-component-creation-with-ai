import {
  SandpackProvider,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  Sandpack,
} from "@codesandbox/sandpack-react";
import { FileText } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// import KFSDK from "@kissflow/lowcode-client-sdk?raw";

// console.log("KFSDK", KFSDK);

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
async function getPackageVersion(packageName) {
  try {
    // For demo purposes, use 'latest' - in production you'd query npm API
    return "latest";
  } catch {
    return "latest";
  }
}

export default function SandpackStudio({
  showPreview = true,
  files,
  onCompilationStatus,
}) {
  const [extraDependencies, setExtraDependencies] = useState({});
  const [isUpdatingDeps, setIsUpdatingDeps] = useState(false);

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
    JSON.stringify(
      files["/src/components/GeneratedComponent.jsx"]?.slice(0, 100)
    ) +
    JSON.stringify(extraDependencies);

  return (
    <div className="h-full bg-gray-50">
      {isUpdatingDeps && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="text-sm text-blue-700 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            Installing new dependencies...
          </div>
        </div>
      )}
      <Sandpack
        key={filesKey}
        theme="light"
        // options={{
        //   activeFile: "/src/App.jsx",
        //   showConsole: true,
        //   showConsoleButton: true,
        //   logLevel: "verbose",
        // }}

        customSetup={{
          // dependencies: {
          //   // "@codesandbox/sandpack-react": "latest",
          //   "@kissflow/lowcode-client-sdk": "1.0.39",
          //   // react: "18.2.0",
          //   // "react-dom": "18.2.0",
          // },
          entry: "/src/main.jsx",
        }}
        template="react"
        files={projectFiles}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
        // options={{ bundlerURL: "https://sandpack-bundler.codesandbox.io" }}
      >
        <CompilationMonitor onStatusChange={onCompilationStatus} />
        <div className="flex flex-col lg:flex-row h-full">
          {/* File Explorer - Sidebar */}
          <div className="w-full lg:w-64 border-r border-gray-200 bg-white flex flex-col h-full">
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
                }}
              />
            </div>
          </div>

          {/* Code Editor and Preview Area */}
          <div className="flex-1 flex flex-col lg:flex-row h-full">
            {/* Code Editor */}
            <div
              className={`${
                showPreview ? "w-full lg:w-1/2" : "w-full"
              } border-r border-gray-200 h-full flex flex-col`}
            >
              <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-700">
                  Code Editor
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

            {/* Preview and Console */}
            {showPreview && (
              <div className="w-full lg:w-1/2 bg-white h-full flex flex-col">
                {/* Preview Section */}
                <div className="flex-1 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Live Preview
                    </h3>
                  </div>
                  <div className="flex-1 min-h-0">
                    <SandpackPreview
                      key={filesKey}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                      showOpenInCodeSandbox={true}
                      showRefreshButton={true}
                      // showRestartButton={true}
                      // autoRefresh={true}
                      actionsChildren={false}
                    />
                  </div>
                </div>

                {/* Console Section */}
                <div className="h-48 border-t border-gray-200 flex flex-col">
                  <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Console
                    </h3>
                  </div>
                  <div className="flex-1 min-h-0">
                    <SandpackConsole
                      style={{
                        height: "100%",
                      }}
                      showHeader={false}
                      maxMessageCount={1000}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sandpack>
      {/* </SandpackProvider> */}
    </div>
  );
}
