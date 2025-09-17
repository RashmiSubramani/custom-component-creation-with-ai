const templateFiles = {
  indexHtml: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kissflow Custom Component</title>
  </head>
  <body class="bg-gray-900 text-white">
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>`,

  packageJsonTemplate: `{
  "name": "<%= projectName %>",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "zip": "cd dist/ && bestzip ../build.zip *",
    "build": "vite build && npm run zip",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@kissflow/lowcode-client-sdk": "1.0.39"
  },
  "engines": {
    "node": "^18.0.0 || >=20.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.1.6",
    "bestzip": "^2.2.1",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  }
}`,

  tailwindConfig: `export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,

  postcssConfig: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  mainJsx: `import React from "react";
import { createRoot } from "react-dom/client";
import { SDKWrapper } from "./sdk";
import App from "./App.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <SDKWrapper>
    <App />
  </SDKWrapper>
);`,

  appJsx: `import { DefaultLandingComponent } from "./landing";
import React from "react";

function App() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <DefaultLandingComponent />
    </div>
  );
}

export default App;`,

  indexCss: `@tailwind base;
@tailwind components;
@tailwind utilities;`,

  sdkIndex: `export * from "./wrapper.jsx";`,

  sdkWrapper: `import KFSDK from "./dummyContext.js";
import React, { useState, useEffect } from "react";

let kf;

export function SDKWrapper({ children }) {
  const [kfInstance, setKfInstance] = useState(null);

  useEffect(() => {
    if (!window.kf) {
      KFSDK.initialize()
        .then((sdk) => {
          window.kf = kf = sdk;
          setKfInstance(sdk);
        })
        .catch(() => {
          setKfInstance({ isError: true });
        });
    }
  }, []);

  if (!kfInstance) {
    return <p className="text-gray-400">Loading...</p>;
  }

  if (kfInstance.isError) {
    return <h3 className="text-red-500">Please use this component inside Kissflow</h3>;
  }

  return <>{children}</>;
}

export { kf };`,

  landingIndex: `export function DefaultLandingComponent() {
  function handleClick() {
    alert("Button clicked!");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-400 to-purple-600 p-6">
      <div className="bg-white rounded-xl p-10 shadow-xl text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to Kissflow SDK
        </h1>

        <p className="text-gray-600 mb-6">
          This is a sample custom component pre-loaded with the Kissflow SDK.
          <br />
          Edit <code className="bg-gray-200 px-2 py-0.5 rounded">App.jsx</code> to make changes.
        </p>

        <p className="text-gray-600 mb-6">
          Click{" "}
          <a
            href="https://kissflow.github.io/lcnc-sdk-js/"
            target="_blank"
            className="text-indigo-600 font-semibold hover:underline"
          >
            here
          </a>{" "}
          to read the SDK documentation.
        </p>

        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transform transition"
        >
          Click me
        </button>
      </div>
    </div>
  );
}`,

  sdkDummyContext: `const KFSDK = {
  initialize: async () => {
    return { version: "dummy-1.0.0" };
  },
};
export default KFSDK;`,
};

// Load template files and convert them to Sandpack format (no SDK in package.json for browser preview)
export function loadReactTemplate(projectName = "custom-component") {
  // Replace placeholder with actual project name
  const packageJson = templateFiles.packageJsonTemplate.replace(
    /<%= projectName %>/g,
    projectName
  );

  const projectFiles = {
    "/index.html": templateFiles.indexHtml,
    "/package.json": packageJson,
    "/src/main.jsx": templateFiles.mainJsx,
    "/src/App.jsx": templateFiles.appJsx,
    "/src/index.css": templateFiles.indexCss,
    "/tailwind.config.js": templateFiles.tailwindConfig,
    "/postcss.config.js": templateFiles.postcssConfig,
    "/src/sdk/index.js": templateFiles.sdkIndex,
    "/src/sdk/wrapper.jsx": templateFiles.sdkWrapper,
    "/src/sdk/dummyContext.js": templateFiles.sdkDummyContext,
    "/src/landing/index.jsx": templateFiles.landingIndex,
  };

  return projectFiles;
}

// Loader for download (includes real SDK in package.json and sdk files)
export function loadReactTemplateForDownload(projectName = "custom-component") {
  const packageJson = templateFiles.packageJsonTemplate.replace(
    /<%= projectName %>/g,
    projectName
  );

  return {
    "/index.html": templateFiles.indexHtml,
    "/package.json": packageJson,
    "/src/main.jsx": templateFiles.mainJsx,
    "/src/App.jsx": templateFiles.appJsx,
    "/src/index.css": templateFiles.indexCss,
    "/src/sdk/index.js": templateFiles.sdkIndex,
    "/src/sdk/wrapper.jsx": templateFiles.sdkWrapper,
    "/src/sdk/dummyContext.js": templateFiles.sdkDummyContext,
    "/src/landing/index.jsx": templateFiles.landingIndex,
    "/src/landing/styles.module.css": templateFiles.landingStyles,
    "/tailwind.config.js": templateFiles.tailwindConfig,
    "/postcss.config.js": templateFiles.postcssConfig,
  };
}

export function getAvailableTemplates() {
  return [
    {
      id: "react",
      name: "React + Kissflow SDK",
      description: "React project with Kissflow SDK integration",
      loader: loadReactTemplate,
      downloadLoader: loadReactTemplateForDownload,
    },
  ];
}
