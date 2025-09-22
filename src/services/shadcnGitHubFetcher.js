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
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Component ${componentName} not found in ShadCN repository`
        );
      }

      const tsContent = await response.text();

      // Transform TypeScript to JavaScript
      const jsContent = this.transformTStoJS(tsContent);

      // Extract dependencies from imports
      const dependencies = this.extractDependencies(tsContent);

      const result = {
        content: jsContent,
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
   * Transform TypeScript code to JavaScript - Comprehensive approach
   * @param {string} tsCode - TypeScript component code
   * @returns {string} - JavaScript component code
   */
  transformTStoJS(tsCode) {
    let jsCode = tsCode;
    
    // Step 1: Handle imports FIRST before any other transformations
    // Remove TypeScript imports and use client directives
    jsCode = jsCode.replace(/"use client"\s*\n?/, "");

    // Handle React imports - convert to named imports including forwardRef
    jsCode = jsCode.replace(
      /import\s+\*\s+as\s+React\s+from\s+"react"/g,
      'import React, { forwardRef } from "react"'
    );
    
    // Step 2: Remove all TypeScript-only syntax (interfaces, type definitions)
    jsCode = jsCode.replace(/export\s+interface\s+\w+[^{]*\{[^}]*\}/gs, "");
    jsCode = jsCode.replace(/interface\s+\w+[^{]*\{[^}]*\}/gs, "");
    
    // Step 3: Handle complex function parameter types - BEFORE other transformations
    jsCode = jsCode.replace(
      /\}\s*:\s*React\.ComponentProps<[^>]*>\s*&\s*\{[^}]*?\}\s*\)\s*\{/gs,
      "}) {"
    );
    jsCode = jsCode.replace(/\}\s*:\s*[^{]*?&\s*\{[^}]*?\}\s*\)/gs, "})");
    jsCode = jsCode.replace(/\}\s*:\s*[^)]*\)\s*\{/gs, "}) {");
    
    // Step 4: Remove type annotations from destructured parameters
    jsCode = jsCode.replace(/:\s*\w+(\[\])?(?=\s*[,}])/g, "");
    jsCode = jsCode.replace(/:\s*[A-Z]\w*<[^>]*>(?=\s*[,}])/g, "");
    
    // Step 5: Remove all generic type parameters systematically
    jsCode = jsCode.replace(/React\.forwardRef<[^>]*>/g, "React.forwardRef");
    jsCode = jsCode.replace(/useState<[^>]*>/g, "useState");
    jsCode = jsCode.replace(/useRef<[^>]*>/g, "useRef");
    jsCode = jsCode.replace(/React\.FC<[^>]*>/g, "React.FC");
    
    // Step 5: Remove type assertions and optional syntax (but preserve import statements)
    // Remove type assertions but NOT import * as React patterns
    jsCode = jsCode.replace(/\bas\s+\w+(?!\s+from)/g, "");
    jsCode = jsCode.replace(/\bas\s+React\.\w+<[^>]*>/g, "");
    jsCode = jsCode.replace(/!\s*:/g, ":");
    jsCode = jsCode.replace(/\?\s*:/g, ":");
    jsCode = jsCode.replace(/\?\./g, ".");
    
    // Step 6: Handle specific TypeScript patterns that break JSX
    // Remove optional property access patterns
    jsCode = jsCode.replace(/\w+\?\[["'][^"']*["']\]/g, function(match) {
      return match.replace('?[', '[');
    });
    
    // Step 7: Clean up remaining type annotations in various contexts
    // Remove type annotations after colons (: Type)
    jsCode = jsCode.replace(/:\s*[A-Z]\w*(?![a-z])/g, "");
    jsCode = jsCode.replace(/:\s*[a-z]\w*(?=\s*[,)\]=])/g, "");
    jsCode = jsCode.replace(/:\s*\w+\[\]/g, "");
    
    // For Sandpack compatibility, replace complex dependencies with simpler versions
    if (jsCode.includes("@radix-ui/react-slot")) {
      jsCode = jsCode.replace(
        /import { Slot } from "@radix-ui\/react-slot"/g,
        "// Slot component replacement for Sandpack\nconst Slot = ({ children, ...props }) => children"
      );
    }

    // Replace complex dependencies with simpler implementations
    if (jsCode.includes("class-variance-authority")) {
      jsCode = jsCode.replace(
        /import { cva.*? } from "class-variance-authority"/g,
        `// Simple cva replacement for Sandpack
const cva = (base, config) => {
  return (props) => {
    if (!props) props = {};
    const variant = props.variant || config?.defaultVariants?.variant || "default";
    const size = props.size || config?.defaultVariants?.size || "default";
    const className = props.className || "";
    
    let classes = [base];
    
    if (config?.variants?.variant && config.variants.variant[variant]) {
      classes.push(config.variants.variant[variant]);
    }
    
    if (config?.variants?.size && config.variants.size[size]) {
      classes.push(config.variants.size[size]);
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.filter(Boolean).join(" ");
  };
};`
      );
    }

    // Replace react-day-picker with a simple mock for calendar
    if (jsCode.includes("react-day-picker")) {
      jsCode = jsCode.replace(
        /import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"/g,
        `// Simple DayPicker replacement for Sandpack
const DayPicker = ({ selected, onSelect, mode, ...props }) => {
  const today = new Date();
  const handleDateClick = (date) => {
    if (onSelect) onSelect(date);
  };
  
  return (
    <div className="p-4 border rounded bg-white">
      <div className="text-center mb-2 font-semibold">
        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-500">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const date = new Date(today.getFullYear(), today.getMonth(), i - 6);
          const isSelected = selected && date.toDateString() === selected.toDateString();
          return (
            <button
              key={i}
              onClick={() => handleDateClick(date)}
              className={\`p-2 text-center rounded hover:bg-gray-100 \${isSelected ? 'bg-blue-500 text-white' : ''}\`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};`
      );
    }

    // Import handling is now done at the beginning of the transformation

    // Step 8: Clean up imports and paths
    // Remove TypeScript type imports
    jsCode = jsCode.replace(/,\s*type\s+\w+/g, "");
    jsCode = jsCode.replace(/{\s*type\s+\w+\s*,/g, "{");
    jsCode = jsCode.replace(/{\s*type\s+\w+\s*}/g, "{}");
    jsCode = jsCode.replace(/import\s*{\s*}\s*from\s*["'][^"']+["']\s*\n?/g, "");

    // Convert import paths from @/ to relative paths
    jsCode = jsCode.replace(/from\s+["']@\/lib\/utils["']/g, 'from "../../lib/utils"');
    jsCode = jsCode.replace(/from\s+["']@\/components\/ui\/([^"']+)["']/g, 'from "./$1"');
    // Handle registry paths that appear in some components
    jsCode = jsCode.replace(/from\s+["']@\/registry\/[^\/]+\/ui\/([^"']+)["']/g, 'from "./$1"');

    // Step 9: Final cleanup
    // Replace React.forwardRef with forwardRef (after imports are handled)
    jsCode = jsCode.replace(/React\.forwardRef/g, "forwardRef");
    
    // Clean up any remaining malformed syntax
    jsCode = jsCode.replace(/\{\s*,/g, "{");
    jsCode = jsCode.replace(/,\s*\}/g, "}");
    jsCode = jsCode.replace(/\(\s*,/g, "(");
    jsCode = jsCode.replace(/,\s*\)/g, ")");
    
    // Convert file extensions
    jsCode = jsCode.replace(/\.tsx/g, ".jsx");

    // Replace ShadCN CSS custom properties with standard Tailwind classes
    const cssVariableReplacements = {
      "bg-primary": "bg-blue-600",
      "text-primary-foreground": "text-white",
      "hover:bg-primary/90": "hover:bg-blue-700",
      "bg-destructive": "bg-red-600",
      "text-destructive-foreground": "text-white",
      "hover:bg-destructive/90": "hover:bg-red-700",
      "border-input": "border-gray-300",
      "bg-background": "bg-white",
      "hover:bg-accent": "hover:bg-gray-50",
      "hover:text-accent-foreground": "hover:text-gray-900",
      "bg-secondary": "bg-gray-100",
      "text-secondary-foreground": "text-gray-900",
      "hover:bg-secondary/80": "hover:bg-gray-200",
      "text-primary": "text-blue-600",
      "bg-card": "bg-white",
      "text-card-foreground": "text-gray-950",
      "text-muted-foreground": "text-gray-500",
      "ring-ring": "ring-blue-500",
      "ring-offset-background": "ring-offset-white",
    };

    // Apply CSS variable replacements
    Object.entries(cssVariableReplacements).forEach(
      ([variable, replacement]) => {
        const regex = new RegExp(
          `\\b${variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "g"
        );
        jsCode = jsCode.replace(regex, replacement);
      }
    );

    // Handle opacity variants that weren't matched above
    jsCode = jsCode.replace(/hover:bg-blue-600\/90/g, "hover:bg-blue-700");
    jsCode = jsCode.replace(/hover:bg-red-600\/90/g, "hover:bg-red-700");
    jsCode = jsCode.replace(/hover:bg-gray-100\/80/g, "hover:bg-gray-200");

    // Clean up empty lines and extra whitespace
    jsCode = jsCode.replace(/\n\s*\n\s*\n/g, "\n\n");

    return jsCode;
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
    const relativeImportRegex = /import\s*\{[^}]*\}\s*from\s*["']\.\/([^"']+)["']/g;
    
    let match;
    while ((match = relativeImportRegex.exec(code)) !== null) {
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

        // Create component file path
        const filePath = `/src/components/ui/${componentName}.jsx`;
        results[filePath] = component.content;
        processedComponents.add(componentName);

        // Collect all dependencies
        component.dependencies.forEach((dep) => allDependencies.add(dep));
        
        // Check for ShadCN component dependencies in the fetched component
        const componentDeps = this.detectComponentDependencies(component.content);
        componentDeps.forEach(dep => {
          if (!processedComponents.has(dep) && !componentsToProcess.includes(dep)) {
            componentsToProcess.push(dep);
          }
        });
        
      } catch (error) {
        // Skip failed components and provide a simple fallback
        console.warn(
          `Failed to fetch ${componentName}, using fallback:`,
          error.message
        );

        // Provide basic fallback components for common ones
        const fallbacks = {
          calendar: `import React, { useState } from 'react';
import { cn } from "../../lib/utils";

const Calendar = ({ selected, onSelect, className, ...props }) => {
  const [selectedDate, setSelectedDate] = useState(selected);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onSelect) onSelect(date);
  };
  
  const today = new Date();
  
  return (
    <div className={cn("p-4 border rounded bg-white", className)} {...props}>
      <div className="text-center mb-4 font-semibold">
        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-500">{day}</div>
        ))}
        {Array.from({ length: 35 }, (_, i) => {
          const date = new Date(today.getFullYear(), today.getMonth(), i - 6);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === today.toDateString();
          
          let buttonClass = "p-2 text-center rounded hover:bg-gray-100";
          if (isSelected) {
            buttonClass += " bg-blue-500 text-white";
          } else if (isToday) {
            buttonClass += " bg-blue-100 text-blue-600";
          }
          
          return (
            <button
              key={i}
              onClick={() => handleDateSelect(date)}
              className={buttonClass}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { Calendar }`,
        };

        if (fallbacks[componentName]) {
          const filePath = `/src/components/ui/${componentName}.jsx`;
          results[filePath] = fallbacks[componentName];
        }
      }
    }

    return {
      files: results,
      dependencies: Array.from(allDependencies),
    };
  }

  /**
   * Get common ShadCN dependencies that are typically needed
   * @returns {Object} - Package.json dependencies object
   */
  getCommonDependencies() {
    return {
      "@radix-ui/react-slot": "^1.0.2",
      "@radix-ui/react-accordion": "^1.1.2",
      "@radix-ui/react-alert-dialog": "^1.0.5",
      "@radix-ui/react-aspect-ratio": "^1.0.3",
      "@radix-ui/react-avatar": "^1.0.4",
      "@radix-ui/react-checkbox": "^1.0.4",
      "@radix-ui/react-collapsible": "^1.0.3",
      "@radix-ui/react-dialog": "^1.0.5",
      "@radix-ui/react-dropdown-menu": "^2.0.6",
      "@radix-ui/react-hover-card": "^1.0.7",
      "@radix-ui/react-label": "^2.0.2",
      "@radix-ui/react-menubar": "^1.0.4",
      "@radix-ui/react-navigation-menu": "^1.1.4",
      "@radix-ui/react-popover": "^1.0.7",
      "@radix-ui/react-progress": "^1.0.3",
      "@radix-ui/react-radio-group": "^1.1.3",
      "@radix-ui/react-scroll-area": "^1.0.5",
      "@radix-ui/react-select": "^2.0.0",
      "@radix-ui/react-separator": "^1.0.3",
      "@radix-ui/react-slider": "^1.1.2",
      "@radix-ui/react-switch": "^1.0.3",
      "@radix-ui/react-tabs": "^1.0.4",
      "@radix-ui/react-toast": "^1.1.5",
      "@radix-ui/react-toggle": "^1.0.3",
      "@radix-ui/react-toggle-group": "^1.0.4",
      "@radix-ui/react-tooltip": "^1.0.7",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.0.0",
      "tailwind-merge": "^2.2.0",
      "react-day-picker": "^8.10.0",
      "date-fns": "^2.30.0",
      "lucide-react": "^0.263.1",
    };
  }
}

// Create singleton instance
export const shadcnGitHubFetcher = new ShadCNGitHubFetcher();
