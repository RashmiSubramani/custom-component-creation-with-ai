# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

Component Forge is a React-based code editor and live preview application built around Sandpack integration. The application has been simplified from its original component generation design and now focuses on providing a clean code editing experience with live preview.

### Core Architecture

The application uses a **3-pane layout**:
1. **Left Pane**: `PromptComposer` - Chat-like interface for user input
2. **Middle Pane**: Code Editor with File Explorer (Sandpack)  
3. **Right Pane**: Live Preview (Sandpack)

### Key Components

- **App.jsx**: Main application shell with header and grid layout (4-8 column split)
- **SandpackStudio.jsx**: Wraps Sandpack components, manages project files and preview
- **PromptComposer.jsx**: Chat interface with message history (persisted to localStorage)
- **sampleProject.js**: Default project files shown in editor and preview

### Sandpack Integration

The application uses `@codesandbox/sandpack-react` for code editing and preview:

- **No template mode**: Uses `customSetup` with React 19 dependencies instead of Sandpack's built-in templates
- **Custom entry point**: Points to `/index.html` for proper Vite project structure  
- **File control**: Only shows files defined in `sampleProjectFiles`, avoiding template pollution
- **Live preview**: Real-time rendering of React components in preview pane

### Default Project Structure

The sample project follows standard Vite conventions:
- Entry: `index.html` → `src/main.jsx` → `src/App.jsx`
- Components organized in `src/components/` folder
- CSS files alongside components

### State Management

- **Chat messages**: Persisted in localStorage as `cf.chatMessages`
- **Project files**: Managed through props, defaults to `sampleProjectFiles`
- **No global state**: Simple prop drilling for the current simplified scope

### CSS Architecture

- **Tailwind CSS v4**: Uses new `@import "tailwindcss"` syntax
- **shadcn-style components**: Located in `components/ui/` with class-variance-authority
- **Sandpack theming**: Custom CSS variables for `.sp-wrapper` height fixes

### Important Notes

- Component generation functionality has been removed - the `handleGenerateComponent` function is currently a placeholder
- File explorer shows only custom project files, no Sandpack template files
- The application is designed to be extended with AI component generation in the future
- All UI components follow shadcn patterns with Tailwind styling