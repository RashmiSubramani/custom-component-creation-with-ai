// Component detector for ShadCN components in generated code
// Detects which components need to be fetched from GitHub

/**
 * Detect ShadCN components used in generated code
 * @param {string} code - The generated component code
 * @returns {string[]} - Array of component names that need to be fetched
 */
export function detectShadCNComponents(code) {
  const usedComponents = new Set();
  
  // Pattern 1: Standard ShadCN imports
  // import { Button, Card } from "@/components/ui/button"
  // import { Calendar } from "@/components/ui/calendar"
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*["']@?\/components\/ui\/([^"']+)["']/g;
  
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const componentPath = match[2]; // e.g., "button", "calendar"
    usedComponents.add(componentPath);
  }
  
  // Pattern 2: Relative imports  
  // import { Button } from "./components/ui/button"
  const relativeImportRegex = /import\s*\{([^}]+)\}\s*from\s*["']\.\.?\/components\/ui\/([^"']+)["']/g;
  
  while ((match = relativeImportRegex.exec(code)) !== null) {
    const componentPath = match[2]; // e.g., "button", "calendar"
    usedComponents.add(componentPath);
  }
  
  // Pattern 3: Direct component usage (fallback)
  // Look for JSX usage like <Button>, <Calendar>, etc.
  const componentUsageRegex = /<([A-Z][a-zA-Z]*)/g;
  
  while ((match = componentUsageRegex.exec(code)) !== null) {
    const componentName = match[1]; // e.g., "Button", "Calendar"
    
    // Convert PascalCase to kebab-case for file names
    const kebabCase = componentName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .slice(1);
    
    // Only add if it looks like a ShadCN component
    if (isShadCNComponent(componentName)) {
      usedComponents.add(kebabCase);
    }
  }
  
  return Array.from(usedComponents);
}

/**
 * Check if a component name is likely a ShadCN component
 * @param {string} componentName - Component name in PascalCase
 * @returns {boolean} - True if likely a ShadCN component
 */
function isShadCNComponent(componentName) {
  const knownShadCNComponents = [
    'Accordion', 'Alert', 'AlertDialog', 'AspectRatio', 'Avatar', 'Badge',
    'Breadcrumb', 'Button', 'Calendar', 'Card', 'Carousel', 'Chart',
    'Checkbox', 'Collapsible', 'Combobox', 'Command', 'ContextMenu',
    'DataTable', 'DatePicker', 'Dialog', 'Drawer', 'DropdownMenu',
    'Form', 'HoverCard', 'Input', 'InputOTP', 'Label', 'Menubar',
    'NavigationMenu', 'Pagination', 'Popover', 'Progress', 'RadioGroup',
    'Resizable', 'ScrollArea', 'Select', 'Separator', 'Sheet', 'Sidebar',
    'Skeleton', 'Slider', 'Sonner', 'Switch', 'Table', 'Tabs', 'Textarea',
    'Toast', 'Toggle', 'ToggleGroup', 'Tooltip'
  ];
  
  return knownShadCNComponents.includes(componentName);
}


/**
 * Update LLM prompt to use proper ShadCN imports
 * @param {string} prompt - Original LLM prompt
 * @returns {string} - Updated prompt with ShadCN import instructions
 */
export function enhancePromptForShadCN(prompt) {
  const shadcnInstructions = `

IMPORTANT - SHADCN IMPORT INSTRUCTIONS:
- Use ONLY standard ShadCN import syntax: import { ComponentName } from "@/components/ui/component-name"
- Examples:
  - import { Button } from "@/components/ui/button"
  - import { Calendar } from "@/components/ui/calendar"
  - import { Card, CardHeader, CardContent } from "@/components/ui/card"
- DO NOT use relative imports like "../components/ui/button"
- DO NOT import external libraries - only use ShadCN components
- Component names should match official ShadCN documentation

`;

  return prompt + shadcnInstructions;
}