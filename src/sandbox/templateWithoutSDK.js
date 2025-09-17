const templateFiles = {
  indexHtml: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Custom React Component</title>
  </head>
  <body>
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
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.1.6"
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
import App from "./App.jsx";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,

  appJsx: `import { DefaultLandingComponent } from "./landing/index.jsx";
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

  landingIndex: `export function DefaultLandingComponent() {
  function handleClick() {
    alert("Button clicked!");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-green-500 p-6">
      <div className="bg-white rounded-xl p-10 shadow-xl text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-transparent mb-4">
          Welcome to React + Tailwind
        </h1>

        <p className="text-gray-600 mb-6">
          This is a sample custom component with TailwindCSS.
          <br />
          Edit <code className="bg-gray-200 px-2 py-0.5 rounded">App.jsx</code> to make changes.
        </p>

        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transform transition"
        >
          Click me
        </button>
      </div>
    </div>
  );
}`,
};

export function loadReactTemplate(projectName = "custom-component") {
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
    "/src/landing/index.jsx": templateFiles.landingIndex,
  };

  return projectFiles;
}

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
    "/tailwind.config.js": templateFiles.tailwindConfig,
    "/postcss.config.js": templateFiles.postcssConfig,
  };
}

export function getAvailableTemplates() {
  return [
    {
      id: "react",
      name: "React + Tailwind",
      description: "React project Tailwind integration",
      loader: loadReactTemplate,
      downloadLoader: loadReactTemplateForDownload,
    },
  ];
}
