# ⚡ Component Forge

AI-powered React component generator with intelligent ShadCN integration

## 🌐 Live Demo

**[🚀 Try Custom_Component_Generation Live](https://custom-component-creation-with-ai.vercel.app)**
 
 | 💬 Chat → 🎨 Generate → 👀 Preview


![Component Forge Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![AI Powered](https://img.shields.io/badge/AI-OpenAI%20GPT--4-orange)

## 🎯 What it does

Transform natural language into production-ready React components. Simply chat with AI and watch as it generates complete components with ShadCN styling, TypeScript support, and live preview.

## ✨ Key Features

🧠 **Intelligent AI Workflow** - 5-phase generation: Design → Registry → Merge → Generate → Integrate

📦 **53+ ShadCN Components** - Complete UI library from forms to data visualization

⚡ **Real-time Preview** - Instant Sandpack-powered code execution and editing

🌐 **Production Deployment** - Live on Vercel + Railway with CI/CD

🎨 **Modern Interface** - Clean chat UI with collapsible workspace panels

📱 **Responsive Design** - Optimized for all screen sizes and devices

---
## Landing Page

<img width="2052" height="1242" alt="Screenshot 2026-01-09 at 12 42 59 AM" src="https://github.com/user-attachments/assets/4168fc2c-293c-4971-ba56-a035cef87af0" />

## Component generated
<img width="2052" height="1242" alt="Screenshot 2026-01-09 at 1 35 54 AM" src="https://github.com/user-attachments/assets/7aaf15cd-1a65-44d3-8bdf-ca1290adb04c" />


## Prompting and Reprompting

https://github.com/user-attachments/assets/7cf34cd0-1842-4ef4-a13e-1d36fccb7d33




---

## 🛠️ Tech Stack

| Layer           | Technologies                            |
| --------------- | --------------------------------------- |
| **Frontend**    | React 18, Vite, TypeScript, TailwindCSS |
| **UI Library**  | ShadCN/ui, Lucide Icons, CVA            |
| **Code Engine** | Sandpack (CodeSandbox)                  |
| **Backend**     | Node.js, Express, OpenAI GPT-4          |
| **Deployment**  | Vercel (Frontend) + Railway (API)       |

## ⚡ Quick Start

```bash
# 1. Clone & Install
git clone <repo-url> && cd component-forge
npm install

# 2. Backend Setup
cd server && npm install
echo "OPENAI_API_KEY=your_key_here" > .env && npm start

# 3. Frontend
cd .. && npm run dev
# → Open http://localhost:5173
```

## 💡 Try These Prompts

```bash
💻 "Create a modern login form with email validation"
💳 "Build a pricing table with 3 tiers and highlight popular plan"
🧭 "Make a responsive navigation with dropdown menus"
📊 "Generate a data table with search, sort, and pagination"
🎨 "Design a hero section with gradient background"
📱 "Create a contact form with file upload support"
```

## 🏗️ Architecture Highlights

🔄 **Smart AI Pipeline** - Multi-phase workflow with context awareness and error recovery
📚 **Dynamic Registry** - Real-time ShadCN component fetching and integration
⚡ **Live Code Execution** - Sandpack-powered instant preview with hot reload
🛡️ **Production Ready** - CORS, environment config, error boundaries, TypeScript
🎯 **Modern Patterns** - React 18, custom hooks, clean architecture, performance optimized

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

- **"Cannot connect to server"**: Check backend is running on port 3005
- **"Generation failed"**: Verify OpenAI API key and quota
- **Preview not loading**: Hard refresh (Ctrl+Shift+R)

</details>

---
