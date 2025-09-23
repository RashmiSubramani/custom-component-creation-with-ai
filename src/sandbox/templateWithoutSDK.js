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
    <script type="module" src="./src/main.tsx"></script>
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
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.31",
    "autoprefixer": "^10.4.16",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.1.6"
  }
}`,

  tailwindConfig: `export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`,

  tsconfigJson: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping for ShadCN */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  tsconfigNodeJson: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,

  postcssConfig: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  mainTsx: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,

  appTsx: `import { DefaultLandingComponent } from "./landing/index.tsx";
import React from "react";

function App(): JSX.Element {
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

  landingIndexTsx: `import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DefaultLandingComponent(): JSX.Element {
  function handleClick(): void {
    alert("ShadCN Button clicked!");
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-green-500 p-6">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle className="text-center text-3xl bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-transparent">
            Welcome to ShadCN + TypeScript
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            This component now uses ShadCN UI components with TypeScript!
            <br />
            <Badge variant="secondary" className="mt-2">All components with types</Badge>
          </p>

          <Button onClick={handleClick} className="w-full">
            Test ShadCN Button
          </Button>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">Outline</Button>
            <Button variant="destructive" size="sm">Destructive</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DefaultLandingComponent;`,

  // utils file for cn function with TypeScript
  utilsFileTs: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,

  // Vite config for TypeScript
  viteConfigTs: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`,
};

// Import ShadCN GitHub fetcher service
import { shadcnGitHubFetcher } from "../services/shadcnGitHubFetcher.js";

// Removed complex loadReactTemplate function - using simpler loadReactTemplateWithAllComponents approach

// New function: Load template with dynamic GitHub component fetching
export async function loadReactTemplateWithGitHubComponents(
  projectName = "custom-component",
  componentNames = []
) {
  const packageJson = templateFiles.packageJsonTemplate.replace(
    /<%= projectName %>/g,
    projectName
  );

  // Base template files with TypeScript
  const baseFiles = {
    "/index.html": templateFiles.indexHtml,
    "/package.json": packageJson,
    "/src/main.tsx": templateFiles.mainTsx,
    "/src/App.tsx": templateFiles.appTsx,
    "/src/index.css": templateFiles.indexCss,
    "/tailwind.config.js": templateFiles.tailwindConfig,
    "/postcss.config.js": templateFiles.postcssConfig,
    "/tsconfig.json": templateFiles.tsconfigJson,
    "/tsconfig.node.json": templateFiles.tsconfigNodeJson,
    "/vite.config.ts": templateFiles.viteConfigTs,
    "/src/landing/index.tsx": templateFiles.landingIndexTsx,
    "/src/lib/utils.ts": templateFiles.utilsFileTs,
  };

  // If no specific components requested, return base template
  if (componentNames.length === 0) {
    return baseFiles;
  }

  try {
    // Fetch components from GitHub
    const { files: componentFiles, dependencies } =
      await shadcnGitHubFetcher.fetchMultipleComponents(componentNames);

    // Update package.json with dependencies
    const updatedPackageJson = JSON.parse(packageJson);
    const commonDeps = shadcnGitHubFetcher.getCommonDependencies();
    const componentDeps = shadcnGitHubFetcher.getComponentDependencies();

    // Add common ShadCN dependencies (minimal set)
    updatedPackageJson.dependencies = {
      ...updatedPackageJson.dependencies,
      ...commonDeps,
    };

    // Add specific component dependencies only for components being used
    componentNames.forEach((componentName) => {
      const requiredDeps = componentDeps[componentName] || [];
      requiredDeps.forEach((dep) => {
        if (!updatedPackageJson.dependencies[dep]) {
          updatedPackageJson.dependencies[dep] = "latest";
        }
      });
    });

    // Add any dependencies detected from component imports
    dependencies.forEach((dep) => {
      if (!updatedPackageJson.dependencies[dep]) {
        updatedPackageJson.dependencies[dep] = "latest";
      }
    });

    return {
      ...baseFiles,
      "/package.json": JSON.stringify(updatedPackageJson, null, 2),
      ...componentFiles,
    };
  } catch (error) {
    // Fallback to base template
    return baseFiles;
  }
}

// Backward compatibility - now returns minimal TypeScript template
export function loadReactTemplateWithAllComponents(
  projectName = "custom-component"
) {
  const packageJson = templateFiles.packageJsonTemplate.replace(
    /<%= projectName %>/g,
    projectName
  );

  return {
    "/index.html": templateFiles.indexHtml,
    "/package.json": packageJson,
    "/src/main.tsx": templateFiles.mainTsx,
    "/src/App.tsx": templateFiles.appTsx,
    "/src/index.css": templateFiles.indexCss,
    "/tailwind.config.js": templateFiles.tailwindConfig,
    "/postcss.config.js": templateFiles.postcssConfig,
    "/tsconfig.json": templateFiles.tsconfigJson,
    "/tsconfig.node.json": templateFiles.tsconfigNodeJson,
    "/vite.config.ts": templateFiles.viteConfigTs,
    "/src/landing/index.tsx": templateFiles.landingIndexTsx,
    "/src/lib/utils.ts": templateFiles.utilsFileTs,
  };
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
