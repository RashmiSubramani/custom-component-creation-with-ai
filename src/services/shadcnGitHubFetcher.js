// ShadCN Component Fetcher from GitHub Repository
// Dynamically fetches official ShadCN components without storing them in our project

export class ShadCNGitHubFetcher {
  constructor() {
    this.baseUrl =
      "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/default/ui";
    this.cache = new Map(); // Cache fetched components
  }

  // Clear cache to force refetch (useful for development)
  clearCache() {
    this.cache.clear();
  }

  /**
   * Fetch a component from ShadCN GitHub repository
   * @param {string} componentName - Name of the component (e.g., 'button', 'calendar')
   * @returns {Promise<{content: string, dependencies: string[]}>}
   */
  async fetchComponent(componentName) {
    // Check cache first
    if (this.cache.has(componentName)) {
      return this.cache.get(componentName);
    }

    try {
      const url = `${this.baseUrl}/${componentName}.tsx`;
      console.log(`🔗 Fetching ShadCN component: ${componentName}`);
      console.log(`📡 GitHub URL: ${url}`);
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ Failed to fetch ${componentName} from ${url}`);
        throw new Error(
          `Component ${componentName} not found in ShadCN repository`
        );
      }
      
      console.log(`✅ Successfully fetched ${componentName} from GitHub`);

      const tsContent = await response.text();

      // Use TypeScript content directly with minimal transformations
      const cleanedContent = this.cleanTypeScriptForSandpack(tsContent);

      // Extract dependencies from imports
      const dependencies = this.extractDependencies(tsContent);

      const result = {
        content: cleanedContent,
        dependencies,
        originalTS: tsContent,
      };

      // Cache the result
      this.cache.set(componentName, result);

      return result;
    } catch (error) {
      throw new Error(
        `Failed to fetch component ${componentName}: ${error.message}`
      );
    }
  }

  /**
   * Clean TypeScript content for Sandpack compatibility (minimal changes)
   * @param {string} tsCode - TypeScript component code
   * @returns {string} - Cleaned TypeScript component code
   */
  cleanTypeScriptForSandpack(tsCode) {
    let cleanedCode = tsCode;

    // Remove "use client" directive if present
    cleanedCode = cleanedCode.replace(/"use client"\s*\n?/, "");

    // Convert import paths to proper @/ format for our project structure
    cleanedCode = cleanedCode.replace(
      /from\s+["']@\/lib\/utils["']/g,
      'from "@/lib/utils"'
    );
    cleanedCode = cleanedCode.replace(
      /from\s+["']@\/components\/ui\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    );

    // Handle registry paths that appear in some ShadCN components
    // Example: @/registry/new-york/ui/button -> @/components/ui/button
    cleanedCode = cleanedCode.replace(
      /from\s+["']@\/registry\/[^\/]+\/ui\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    );

    // Handle any other @/registry patterns (fallback)
    cleanedCode = cleanedCode.replace(
      /from\s+["']@\/registry\/[^"']*\/([^"']+)["']/g,
      'from "@/components/ui/$1"'
    );

    // Also handle @/lib/* paths that might appear
    cleanedCode = cleanedCode.replace(
      /from\s+["']@\/lib\/([^"']+)["']/g,
      'from "@/lib/$1"'
    );

    // Keep all original TypeScript types and syntax intact
    return cleanedCode;
  }

  /**
   * Detect ShadCN component dependencies within a component's code
   * @param {string} code - Component code to analyze
   * @returns {string[]} - Array of ShadCN component names that are imported
   */
  detectComponentDependencies(code) {
    const dependencies = [];

    // Look for relative imports to other ShadCN components
    // import { Button, buttonVariants } from "./button"
    const relativeImportRegex =
      /import\s*\{[^}]*\}\s*from\s*["']\.\/([^"']+)["']/g;

    let match;
    while ((match = relativeImportRegex.exec(code)) !== null) {
      const componentName = match[1]; // e.g., "button"
      dependencies.push(componentName);
    }

    // Also look for @/components/ui/ imports (after our path transformation)
    // import { Button, buttonVariants } from "@/components/ui/button"
    const absoluteImportRegex =
      /import\s*\{[^}]*\}\s*from\s*["']@\/components\/ui\/([^"']+)["']/g;

    while ((match = absoluteImportRegex.exec(code)) !== null) {
      const componentName = match[1]; // e.g., "button"
      dependencies.push(componentName);
    }

    return [...new Set(dependencies)]; // Remove duplicates
  }

  /**
   * Extract dependencies from component imports
   * @param {string} code - Component code
   * @returns {string[]} - Array of npm package dependencies
   */
  extractDependencies(code) {
    const dependencies = [];
    const importRegex = /import\s+[^"']*from\s+["']([^"']+)["']/g;

    let match;
    while ((match = importRegex.exec(code)) !== null) {
      const importPath = match[1];

      // Only include external packages (not relative imports)
      if (
        !importPath.startsWith(".") &&
        !importPath.startsWith("@/") &&
        importPath !== "react"
      ) {
        dependencies.push(importPath);
      }
    }

    return [...new Set(dependencies)]; // Remove duplicates
  }

  /**
   * Fetch multiple components at once with recursive dependency resolution
   * @param {string[]} componentNames - Array of component names
   * @returns {Promise<Object>} - Object with component files
   */
  async fetchMultipleComponents(componentNames) {
    console.log(`🚀 Starting bulk fetch for components: [${componentNames.join(', ')}]`);
    const results = {};
    const allDependencies = new Set();
    const processedComponents = new Set();
    const componentsToProcess = [...componentNames];

    // Process components recursively to handle inter-component dependencies
    while (componentsToProcess.length > 0) {
      const componentName = componentsToProcess.shift();

      if (processedComponents.has(componentName)) {
        continue; // Skip already processed components
      }

      try {
        const component = await this.fetchComponent(componentName);

        // Create component file path with .tsx extension
        const filePath = `/src/components/ui/${componentName}.tsx`;
        results[filePath] = component.content;
        processedComponents.add(componentName);

        // Collect all dependencies
        component.dependencies.forEach((dep) => allDependencies.add(dep));

        // Check for ShadCN component dependencies in the fetched component
        const componentDeps = this.detectComponentDependencies(
          component.content
        );
        componentDeps.forEach((dep) => {
          if (
            !processedComponents.has(dep) &&
            !componentsToProcess.includes(dep)
          ) {
            componentsToProcess.push(dep);
          }
        });
      } catch (error) {
        // Skip failed components and provide a simple fallback
        console.warn(
          `⚠️ Failed to fetch ${componentName}, using fallback:`,
          error.message
        );
        console.log(`🔧 Creating fallback component for: ${componentName}`);

        // Provide a generic fallback component that displays the error
        // Convert kebab-case to PascalCase for valid TypeScript naming
        const pascalCaseName = componentName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
          
        const genericFallback = `import React from 'react';
import { cn } from "../../lib/utils";

interface ${pascalCaseName}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Generic props - actual component may have different interface
}

const ${pascalCaseName} = React.forwardRef<HTMLDivElement, ${pascalCaseName}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "p-4 border-2 border-dashed border-red-300 bg-red-50 rounded-lg text-center text-red-700",
          className
        )} 
        {...props}
      >
        <div className="space-y-2">
          <div className="font-semibold">⚠️ Component Error</div>
          <div className="text-sm">
            The "${componentName}" component could not be loaded from ShadCN repository.
          </div>
          <div className="text-xs text-red-600">
            Check console for details or try regenerating the component.
          </div>
        </div>
        {children}
      </div>
    );
  }
);

${pascalCaseName}.displayName = "${pascalCaseName}";

export { ${pascalCaseName} };`;

        const filePath = `/src/components/ui/${componentName}.tsx`;
        results[filePath] = genericFallback;
      }
    }

    console.log(`🎉 Bulk fetch completed! Components: [${Object.keys(results).filter(path => path.startsWith('/src/components/ui/')).map(path => path.split('/').pop().replace('.tsx', '')).join(', ')}]`);
    console.log(`📦 Total dependencies added: ${allDependencies.size}`);
    
    return {
      files: results,
      dependencies: Array.from(allDependencies),
    };
  }

  /**
   * Get minimal ShadCN dependencies that are always needed
   * @returns {Object} - Package.json dependencies object
   */
  getCommonDependencies() {
    return {
      // Core ShadCN utilities - always needed
      "class-variance-authority": "^0.7.0",
      clsx: "^2.0.0",
      "tailwind-merge": "^2.2.0",
      "lucide-react": "^0.263.1",
    };
  }

  /**
   * Get dependency mapping for specific components
   * @returns {Object} - Component to dependencies mapping
   */
  getComponentDependencies() {
    return {
      accordion: ["@radix-ui/react-accordion"],
      "alert-dialog": ["@radix-ui/react-alert-dialog"],
      "aspect-ratio": ["@radix-ui/react-aspect-ratio"],
      avatar: ["@radix-ui/react-avatar"],
      button: ["@radix-ui/react-slot"],
      calendar: ["react-day-picker", "date-fns"],
      checkbox: ["@radix-ui/react-checkbox"],
      collapsible: ["@radix-ui/react-collapsible"],
      dialog: ["@radix-ui/react-dialog"],
      "dropdown-menu": ["@radix-ui/react-dropdown-menu"],
      "hover-card": ["@radix-ui/react-hover-card"],
      label: ["@radix-ui/react-label"],
      menubar: ["@radix-ui/react-menubar"],
      "navigation-menu": ["@radix-ui/react-navigation-menu"],
      popover: ["@radix-ui/react-popover"],
      progress: ["@radix-ui/react-progress"],
      "radio-group": ["@radix-ui/react-radio-group"],
      "scroll-area": ["@radix-ui/react-scroll-area"],
      select: ["@radix-ui/react-select"],
      separator: ["@radix-ui/react-separator"],
      slider: ["@radix-ui/react-slider"],
      switch: ["@radix-ui/react-switch"],
      tabs: ["@radix-ui/react-tabs"],
      toast: ["@radix-ui/react-toast"],
      toggle: ["@radix-ui/react-toggle"],
      "toggle-group": ["@radix-ui/react-toggle-group"],
      tooltip: ["@radix-ui/react-tooltip"],
    };
  }
}

// Create singleton instance
export const shadcnGitHubFetcher = new ShadCNGitHubFetcher();
