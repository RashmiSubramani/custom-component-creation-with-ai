# Component Forge JS

A React Component Generator MVP with Tailwind CSS, shadcn-style UI components, and Sandpack integration.

## Features

- **3-pane layout**: Prompt Composer, Code Editor with File Explorer, and Live Preview
- **Variable templating**: Support for `{{variables}}` and `{{name=default value}}` syntax
- **Future-proof architecture**: Ready for multiple frameworks/languages (currently locked to React + JavaScript)
- **localStorage persistence**: Template, variables, and settings are automatically saved
- **Copy-to-clipboard**: Easy file copying from the code editor
- **Live preview**: Real-time preview of generated code using Sandpack

## Tech Stack

- **Vite + React** (JavaScript)
- **TailwindCSS** for styling
- **shadcn-style UI components** with class-variance-authority
- **@codesandbox/sandpack-react** for code editing and preview
- **lucide-react** for icons

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
# Lint code
npm run lint

# Development with HMR
npm run dev
```

## Usage

### 1. Prompt Templates

Write prompts using variable placeholders:

```
Create a {{componentType=Button}} component that:
- Uses {{styleFramework=Tailwind CSS}} for styling
- Has {{variantCount=3}} different variants
- Supports {{sizesNeeded=small, medium, large}} sizes
```

### 2. Variable Syntax

- `{{variableName}}` - Simple variable placeholder
- `{{name=default value}}` - Variable with default value
- Variables are auto-detected and added to the Variables panel

### 3. Settings

- **Target**: Currently locked to React + JavaScript (future-ready for other frameworks)
- **Style Mode**: Choose between Tailwind CSS, Plain CSS, or Styled Components
- **Design System**: Select from shadcn/ui, Chakra UI, Ant Design, or Custom
- **Dependencies**: Comma-separated whitelist (non-functional for now)

### 4. Code Editor

- **File Explorer**: Browse sample project files
- **Read-only toggle**: Enable/disable editing
- **Copy functionality**: Copy individual files to clipboard
- **Live preview**: Real-time preview of your components

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn-style UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── textarea.jsx
│   │   └── ...
│   ├── PromptComposer.jsx  # Left pane - prompt editing
│   └── SandpackStudio.jsx  # Middle/right panes - code & preview
├── lib/
│   ├── utils.js           # Tailwind utility functions
│   ├── template.js        # Template parsing & resolution
│   └── llmPayload.js      # Generation payload builder
├── sandbox/
│   └── sampleProject.js   # Sample React project files
└── App.jsx               # Main application layout
```

## API Reference

### Template Functions

```javascript
import { parseVariablesFromTemplate, resolveTemplate } from './lib/template';

// Extract variables from template
const variables = parseVariablesFromTemplate(template);
// Result: [{ name: 'componentType', defaultValue: 'Button' }]

// Resolve template with variables
const resolved = resolveTemplate(template, { componentType: 'Card' });
```

### Generation Payload

```javascript
import { buildGenerationPayload } from './lib/llmPayload';

const payload = buildGenerationPayload({
  template: 'Create a {{type}} component...',
  variables: { type: 'Button' },
  settings: { styleMode: 'tailwind', designSystem: 'shadcn' }
});
```

## Code Quality Guidelines

- **Small components**: Keep files under ~150 lines, break into smaller pieces when needed
- **Focused functionality**: One primary component per file
- **Simple props**: Avoid over-abstraction, keep props explicit
- **Composition over inheritance**: Prefer composing smaller components
- **Meaningful comments**: Add brief comments for non-obvious logic only

## Future Enhancements

- [ ] Multiple framework support (Vue, Angular, Svelte)
- [ ] TypeScript support
- [ ] Backend integration for actual component generation
- [ ] More design system templates
- [ ] Advanced template features (loops, conditionals)
- [ ] Export to CodeSandbox/GitHub
- [ ] Component library integration

## Contributing

1. Keep components small and focused
2. Follow the existing code patterns
3. Add comments for non-obvious logic
4. Test across different screen sizes
5. Ensure localStorage persistence works correctly

## License

MIT License - feel free to use this project as a starting point for your own component generators!
