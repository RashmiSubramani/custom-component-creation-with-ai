import { loadReactTemplateWithGitHubComponents } from "./templateWithoutSDK.js";

// Function to load initial project with ShadCN components
export async function loadSampleProjectFiles() {
  try {
    // Clear cache to ensure fresh components with fixed transformation
    const { shadcnGitHubFetcher } = await import(
      "../services/shadcnGitHubFetcher.js"
    );
    shadcnGitHubFetcher.clearCache();

    const files = await loadReactTemplateWithGitHubComponents("my-component", [
      "button", "card", "badge", "separator"
    ]);

    // Create a simple ShadCN-styled Button component that's guaranteed to work
    files["/src/components/ui/button.tsx"] = `import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
  
  // Base styles that look like ShadCN
  let baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  // Variant styles
  let variantClasses = "";
  switch (variant) {
    case "default":
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case "outline":
      variantClasses = "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900";
      break;
    case "secondary":
      variantClasses = "bg-gray-100 text-gray-900 hover:bg-gray-200";
      break;
    case "ghost":
      variantClasses = "hover:bg-gray-50 hover:text-gray-900";
      break;
    default:
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
  }
  
  // Size styles
  let sizeClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "h-9 px-3 text-xs";
      break;
    case "lg":
      sizeClasses = "h-11 px-8";
      break;
    default:
      sizeClasses = "h-10 px-4 py-2";
  }
  
  const finalClassName = cn(baseClasses, variantClasses, sizeClasses, className);
  
  return (
    <button ref={ref} className={finalClassName} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };`;

    // Create a simple ShadCN-styled Card component
    files["/src/components/ui/card.tsx"] = `import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = "", children, ...props }, ref) => {
  const baseClasses = "rounded-lg border bg-white text-gray-950 shadow-sm";
  const finalClassName = cn(baseClasses, className);
  
  return (
    <div ref={ref} className={finalClassName} {...props}>
      {children}
    </div>
  );
});

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className = "", children, ...props }, ref) => {
  const baseClasses = "flex flex-col space-y-1.5 p-6";
  const finalClassName = cn(baseClasses, className);
  
  return (
    <div ref={ref} className={finalClassName} {...props}>
      {children}
    </div>
  );
});

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({ className = "", children, ...props }, ref) => {
  const baseClasses = "text-2xl font-semibold leading-none tracking-tight";
  const finalClassName = cn(baseClasses, className);
  
  return (
    <h3 ref={ref} className={finalClassName} {...props}>
      {children}
    </h3>
  );
});

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className = "", children, ...props }, ref) => {
  const baseClasses = "p-6 pt-0";
  const finalClassName = cn(baseClasses, className);
  
  return (
    <div ref={ref} className={finalClassName} {...props}>
      {children}
    </div>
  );
});

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";  
CardContent.displayName = "CardContent";


export { Card, CardHeader, CardTitle, CardContent };`;

    // Create a simple ShadCN-styled Badge component
    files["/src/components/ui/badge.tsx"] = `import React from 'react';
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ variant = "default", className = "", children, ...props }, ref) => {
  
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  let variantClasses = "";
  switch (variant) {
    case "default":
      variantClasses = "border-transparent bg-blue-600 text-white hover:bg-blue-700";
      break;
    case "secondary":
      variantClasses = "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200";
      break;
    case "destructive":
      variantClasses = "border-transparent bg-red-600 text-white hover:bg-red-700";
      break;
    case "outline":
      variantClasses = "text-gray-950";
      break;
    default:
      variantClasses = "border-transparent bg-blue-600 text-white hover:bg-blue-700";
  }
  
  const finalClassName = cn(baseClasses, variantClasses, className);
  
  return (
    <div ref={ref} className={finalClassName} {...props}>
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export { Badge };`;

    // Create a simple ShadCN-styled Separator component
    files["/src/components/ui/separator.tsx"] = `import React from 'react';
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(({ className = "", orientation = "horizontal", decorative = true, ...props }, ref) => {
  
  const baseClasses = orientation === "horizontal" 
    ? "shrink-0 bg-gray-200 h-[1px] w-full" 
    : "shrink-0 bg-gray-200 w-[1px] h-full";
    
  const finalClassName = cn(baseClasses, className);
  
  return (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={finalClassName}
      {...props}
    />
  );
});

Separator.displayName = "Separator";

export { Separator };`;

    // Override the landing page to use elegant ShadCN components
    files["/src/landing/index.tsx"] = `import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function DefaultLandingComponent(): JSX.Element {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 bg-[length:20px_20px] opacity-40"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 border-blue-200">
                ⚡ AI-Powered Development
              </Badge>
              <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
                Component Forge
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into beautiful React components with AI assistance. 
                Powered by ShadCN UI for professional, accessible design.
              </p>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Badge variant="outline" className="px-3 py-1.5 text-sm">🎨 ShadCN UI</Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">⚛️ React</Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">🎯 Javascript Ready</Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">📱 Responsive</Badge>
            </div>
          </div>

          {/* Examples Card */}
          <div className="max-w-2xl mx-auto">
            <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-3 text-gray-900">
                  <span className="text-3xl">✨</span>
                  Try these examples
                </CardTitle>
                <p className="text-gray-600 text-center mt-2">Click any demo button to see it in action</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors group">
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">"Create a modern button component"</span>
                    <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                      Demo
                    </Button>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors group">
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">"Build a contact form with validation"</span>
                    <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                      Demo
                    </Button>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors group">
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">"Design a user profile card"</span>
                    <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                      Demo
                    </Button>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors group">
                    <span className="text-gray-700 font-medium group-hover:text-gray-900">"Create a data table with sorting"</span>
                    <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-shadow">
                      Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
              Start Creating →
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg font-semibold bg-white/50 backdrop-blur-sm border-gray-300 hover:bg-white/80 shadow-lg">
              View Gallery
            </Button>
          </div>

          {/* Footer text */}
          <div className="text-center space-y-2">
            <p className="text-gray-600 font-medium">
              Ready to build something amazing?
            </p>
            <p className="text-sm text-gray-500">
              Start typing in the chat panel to generate your first component
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLandingComponent;`;

    return files;
  } catch (error) {
    return fallbackFiles;
  }
}

// Static fallback if GitHub fetching fails
const fallbackFiles = {
  "/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Component Forge</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  "/package.json": `{
  "name": "my-component",
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
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.2.2",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "vite": "^4.4.5"
  }
}`,

  "/postcss.config.js": `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  "/tailwind.config.js": `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

  "/src/main.tsx": `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,

  "/src/App.tsx": `import DefaultLandingComponent from './landing'
import React from 'react'

function App(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <DefaultLandingComponent />
    </div>
  )
}

export default App`,

  "/vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`,

  "/tsconfig.json": `{
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

  "/tsconfig.node.json": `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,

  "/src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,

  "/src/landing/index.tsx": `import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function DefaultLandingComponent(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Component Forge
          </h1>
          <Badge variant="secondary" className="mb-6">
            AI-Powered React Components
          </Badge>
          <p className="text-xl text-gray-600">
            Describe the React component you'd like to create and I'll generate it for you using ShadCN UI components.
          </p>
        </div>

        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ Try these examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <Button variant="outline" size="sm">Demo</Button>
                "Create a button component"
              </li>
              <li className="flex items-center gap-2">
                <Button variant="outline" size="sm">Demo</Button>
                "Build a contact form with validation"
              </li>
              <li className="flex items-center gap-2">
                <Button variant="outline" size="sm">Demo</Button>
                "Make a card with user profile information"
              </li>
              <li className="flex items-center gap-2">
                <Button variant="outline" size="sm">Demo</Button>
                "Design a calendar picker component"
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Start Creating →
          </Button>
          <Button variant="outline" size="lg">
            View Examples
          </Button>
        </div>

        <p className="text-sm text-gray-500">
          Start typing in the chat to generate your first component!
        </p>
      </div>
    </div>
  );
}

export default DefaultLandingComponent;`,

  "/src/lib/utils.ts": `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,
};
