# Component Forge

**Version 1.0 Beta** - AI-Powered React Component Generator

An intelligent React component generation tool powered by OpenAI, featuring a 5-phase AI workflow, real-time code preview, and seamless ShadCN component integration.

## 🚀 Live Demo

- **Production App**: [https://custom-component-creation-with-ai.vercel.app](https://custom-component-creation-with-ai.vercel.app)
- **Status**: Beta - Active development with known limitations

## Features

### ✅ Current (v1.0 Beta)
- **AI-Powered Generation**: Chat-based interface for natural language component requests
- **5-Phase AI Workflow**: Design → Registry → Backend Merge → Code Generation → Final Integration
- **53 ShadCN Components**: Comprehensive component library integration
- **Real-time Preview**: Live code editing and preview with Sandpack
- **Collapsible Interface**: Optimized workspace with collapsible chat panel
- **Professional UI**: Clean, minimalistic design with gray color palette
- **File Management**: Browse, edit, and download generated project files

### ⚠️ Known Limitations (Beta)
- **Error Handling**: Some edge cases may not be handled gracefully
- **API Dependencies**: Requires OpenAI API key; failures may occur if quota exceeded
- **Generation Consistency**: AI responses may vary; complex requests might need refinement
- **Performance**: Large component generations may take time to process
- **Browser Compatibility**: Optimized for modern browsers; older versions may have issues

## Tech Stack

### Frontend (Vercel)
- **Vite + React** (JavaScript)
- **TailwindCSS** for styling
- **ShadCN UI components** with class-variance-authority
- **@codesandbox/sandpack-react** for code editing and preview
- **lucide-react** for icons

### Backend (Railway)
- **Node.js + Express** API server
- **OpenAI API** integration for AI component generation
- **CORS** configuration for cross-origin requests

### Deployment
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Railway (automatic deployments from GitHub)
- **Domain**: Custom domain ready

## Getting Started

### Prerequisites

1. **OpenAI API Key** - Required for AI component generation
   - Sign up at [https://platform.openai.com/](https://platform.openai.com/)
   - Create an API key from the API Keys section
   - **Note**: API usage will incur charges based on OpenAI's pricing

2. **Node.js** - Version 18.0.0 or higher

### Local Development

#### 1. Clone and Install Frontend
```bash
# Clone repository
git clone <your-repo-url>
cd component-forge

# Install frontend dependencies
npm install
```

#### 2. Setup Backend
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here  # Optional
PORT=3004
```

#### 3. Start Both Servers
```bash
# Terminal 1: Start backend (from /server directory)
npm start

# Terminal 2: Start frontend (from root directory)
npm run dev
```

#### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3004

### Development Commands

```bash
# Lint code
npm run lint

# Development with HMR
npm run dev
```

## Usage

### 1. Chat Interface

Use natural language to request components:

```
"Create a login form with email and password fields"
"Make a pricing card with three tiers"
"Build a navigation menu with dropdown"
"Create a data table with sorting and pagination"
```

### 2. AI Workflow

The system follows a 5-phase process:

1. **Design Phase**: Analyzes your request and selects needed ShadCN components
2. **Registry Phase**: Fetches component definitions from ShadCN registry
3. **Backend Merge**: Integrates components with your existing codebase
4. **Code Generation**: Uses AI to create the final component code
5. **Final Integration**: Delivers the complete, working component

### 3. Interface Components

- **Chat Panel**: Left sidebar for conversation with AI (collapsible)
- **Code Editor**: Middle pane with file explorer and code editing
- **Live Preview**: Right pane showing real-time component preview
- **Download**: Export your generated project as ZIP file

### 4. Supported Components

53 ShadCN components including:
- Forms: `input`, `textarea`, `checkbox`, `radio-group`, `select`
- Navigation: `tabs`, `breadcrumb`, `navigation-menu`, `sidebar`
- Data Display: `table`, `card`, `badge`, `avatar`, `chart`
- Feedback: `alert`, `toast`, `progress`, `spinner`
- Overlay: `dialog`, `sheet`, `popover`, `tooltip`

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

## Beta Disclaimer

This is a **Beta version (v1.0)** with known limitations:

- **Active Development**: Features and behavior may change
- **Error Handling**: Some edge cases may cause unexpected behavior
- **API Dependencies**: Requires OpenAI API key and quota availability
- **Performance**: Complex generations may be slow or fail
- **Data Persistence**: No user accounts; all data is session-based

**Use for**: Learning, prototyping, and development exploration
**Not recommended for**: Production applications or critical projects

## Troubleshooting

### Common Issues

1. **"Cannot connect to server"**
   - Check if backend is running on port 3004
   - Verify OpenAI API key is set correctly
   - Check API quota/billing status

2. **"Component generation failed"**
   - Try simpler prompts
   - Check browser console for errors
   - Refresh page and try again

3. **Preview not loading**
   - Hard refresh browser (Ctrl+Shift+R)
   - Check for JavaScript errors in console
   - Ensure all dependencies are installed

## Future Enhancements

### v1.1 (Planned)
- [ ] Improved error handling and user feedback
- [ ] Better loading states and progress indicators
- [ ] Enhanced component customization options
- [ ] Undo/redo functionality

### v2.0 (Future)
- [ ] Multiple framework support (Vue, Angular, Svelte)
- [ ] TypeScript support
- [ ] User accounts and project persistence
- [ ] Export to CodeSandbox/GitHub
- [ ] Custom design system integration
- [ ] Advanced AI prompting features

## Contributing

1. Keep components small and focused
2. Follow the existing code patterns
3. Add comments for non-obvious logic
4. Test across different screen sizes
5. Ensure localStorage persistence works correctly

## License

MIT License - feel free to use this project as a starting point for your own component generators!
