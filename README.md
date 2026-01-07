# Component Forge

AI-powered React component generator with ShadCN integration and live preview

🔗 **[Live Demo](https://custom-component-creation-with-ai.vercel.app)** | ⚡ **Chat with AI → Generate Components → Live Preview**

## What it does

Type natural language prompts like "create a pricing card" and watch AI generate production-ready React components with ShadCN styling, complete with live editing and preview.

## Key Features

• **5-phase AI workflow** - Design analysis → Component selection → Code generation → Integration
• **53 ShadCN components** - Forms, navigation, data display, feedback, overlays
• **Live code editing** - Real-time preview with Sandpack integration
• **Full-stack deployment** - React frontend (Vercel) + Node.js API (Railway)
• **Modern UX** - Clean chat interface with collapsible panels

## Tech Stack

**Frontend:** React, Vite, TailwindCSS, ShadCN/ui, Sandpack
**Backend:** Node.js, Express, OpenAI API
**Deployment:** Vercel + Railway

## Quick Start

```bash
# 1. Setup backend
cd server && npm install
echo "OPENAI_API_KEY=your_key_here" > .env
npm start

# 2. Setup frontend
cd .. && npm install && npm run dev

# 3. Open http://localhost:5173
```

## Example Prompts

```
"Create a login form with email and password"
"Make a pricing table with 3 tiers"
"Build a navigation menu with dropdown"
"Create a data table with search"
```

## Architecture Highlights

- **AI Integration**: Custom 5-phase generation workflow with OpenAI
- **Component Library**: Automated ShadCN registry integration
- **Real-time Preview**: Sandpack-powered code execution
- **Production Ready**: CORS handling, environment config, error boundaries
- **Modern React**: Hooks, functional components, clean architecture

---

<details>
<summary>🔧 Development Setup</summary>

### Prerequisites
- Node.js 18+
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Full Setup
```bash
# Clone and install
git clone <repo-url>
cd component-forge
npm install

# Backend setup
cd server
npm install
cp .env.example .env
# Add OPENAI_API_KEY to .env

# Start both servers
npm start & cd .. && npm run dev
```

### Common Issues
- **"Cannot connect to server"**: Check backend is running on port 3004
- **"Generation failed"**: Verify OpenAI API key and quota
- **Preview not loading**: Hard refresh (Ctrl+Shift+R)

</details>

---

*Built as a portfolio project showcasing AI integration, modern React patterns, and full-stack deployment capabilities.*