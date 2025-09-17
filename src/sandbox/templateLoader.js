// Template loader for converting template files to Sandpack project structure

import { SDK_DUMMY } from "../data/test";

// Template file contents (manually copied since we can't use ?raw imports reliably in all setups)
// const templateFiles = {
//   indexHtml: `<!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Custom component</title>
//   </head>
//   <body>
//     <div id="root"></div>
//     <script src="https://unpkg.com/@kissflow/lowcode-client-sdk@latest/dist/kfsdk.umd.js"></script>
//     <script type="module" src="./src/main.jsx"></script>
//   </body>
// </html>`,

//   packageJsonTemplate: `{
//   "name": "<%= projectName %>",
//   "private": true,
//   "version": "0.0.0",
//   "type": "module",
//   "scripts": {
//     "dev": "vite",
//     "zip": "cd dist/ && bestzip ../build.zip *",
//     "build": "vite build && npm run zip",
//     "preview": "vite preview"
//   },
//   "dependencies": {
//     "react": "^18.2.0",
//     "react-dom": "^18.2.0",
//     "@kissflow/lowcode-client-sdk": "1.0.39"
//   },
//   "engines": {
//     "node": "^18.0.0 || >=20.0.0"
//   },
//   "devDependencies": {
//     "@types/react": "^18.2.64",
//     "@types/react-dom": "^18.2.21",
//     "@vitejs/plugin-react": "^4.2.1",
//     "eslint": "^8.57.0",
//     "eslint-plugin-react": "^7.34.0",
//     "eslint-plugin-react-hooks": "^4.6.0",
//     "eslint-plugin-react-refresh": "^0.4.5",
//     "vite": "^5.1.6",
//     "bestzip": "^2.2.1"
//   }
// }`,

//   mainJsx: `import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "../App.js";
// import { SDKWrapper } from "./sdk/index.js";
// import "./index.css";

// const Root = createRoot(document.getElementById("root"));
// Root.render(
//   <SDKWrapper>
//     <App />
//   </SDKWrapper>
// );`,

//   appJsx: `import { DefaultLandingComponent } from "./src/landing/index.jsx";
// import React from "react";

// function App() {
//   return (
//     <div className="rootDiv">
//       <DefaultLandingComponent />
//     </div>
//   );
// }

// export default App;`,

//   indexCss: `* {
//   box-sizing: border-box;
//   text-rendering: optimizeLegibility !important;
//   font-synthesis: none;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }

// :root {
//   font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
//   line-height: 1.5;
//   font-weight: 400;
//   color-scheme: light dark;
//   color: #ffffff;
//   background-color: #242424;
// }

// body {
//   margin: 0;
//   display: flex;
//   place-items: center;
//   justify-content: center;
//   min-width: 320px;
//   min-height: 100vh;
// }

// button {
//   border-radius: 8px;
//   border: 1px solid transparent;
//   padding: 0.6em 1.2em;
//   font-size: 1em;
//   font-weight: 500;
//   font-family: inherit;
//   background-color: #1a1a1a;
//   cursor: pointer;
//   transition: border-color 0.25s;
// }
// button:hover {
//   border-color: #646cff;
// }
// button:focus,
// button:focus-visible {
//   outline: 4px auto -webkit-focus-ring-color;
// }

// a {
//   font-weight: 500;
//   color: #646cff;
//   text-decoration: inherit;
// }
// a:hover {
//   color: #535bf2;
// }

// .rootDiv {
//   width: 100%;
//   height: 100%;
//   max-height: 500px;
// }

// h1 {
//   font-weight: 700;
// }

// @media (prefers-color-scheme: light) {
//   :root {
//     color: #213547;
//     background-color: #ffffff;
//   }
//   a:hover {
//     color: #747bff;
//   }
//   button {
//     background-color: #f9f9f9;
//   }
// }`,

//   sdkIndex: `import KFSDK from '@kissflow/lowcode-client-sdk'
//   import React, { useState, useEffect } from "react";

// let kf;
// export function SDKWrapper(props) {
//   const [kfInstance, setKfInstance] = useState(null);

//   useEffect(function onLoad() {
//     if (!window.kf) {
//             KFSDK.initialize()
//                 .then((sdk) => {
//                     window.kf = kf = sdk
//                     setKfInstance(sdk)
//                     console.info('SDK initialized successfully')
//                 })
//                 .catch((err) => {
//                     setKfInstance({ isError: true })
//                     console.error('Error initializing SDK:', err)
//                 })
//         }
//   }, []);

//   return (
//     <React.Fragment>
//       {kfInstance && !kfInstance.isError && props.children}
//       {kfInstance && kfInstance.isError && (
//         <h3>Please use this component inside Kissflow</h3>
//       )}
//     </React.Fragment>
//   );
// }

// export { kf };`,

//   landingIndex: `import { kf } from "./../sdk/index.js";
// import styles from "./styles.module.css";

// const handleClick = () => {
//   if (kf && kf.client) {
//     kf.client.showInfo(\`Hi \${kf.user.Name}!\`);
//   }
// };

// export function DefaultLandingComponent() {
//   return (
//     <div className={styles.landingHero}>
//       <div className={styles.mainDiv}>
//         <h1>Welcome, {kf && kf.user ? kf.user.Name : "User"}</h1>
//         <div>
//           <p className={styles.sampletext}>
//             This is a sample custom component pre-loaded with the Kissflow SDK.
//             <br />
//             Edit <code>App.jsx</code> to make changes.
//           </p>
//           <p className={styles.sampletext}>
//             Click{" "}
//             <a href="https://kissflow.github.io/lcnc-sdk-js/" target="_blank">
//               here
//             </a>{" "}
//             to read the SDK documentation.
//           </p>
//         </div>
//         <button onClick={handleClick}>Click me</button>
//       </div>
//     </div>
//   );
// }`,

//   landingStyles: `.landingHero {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   min-height: 100vh;
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   padding: 20px;
// }

// .mainDiv {
//   background: white;
//   border-radius: 12px;
//   padding: 40px;
//   box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
//     0 10px 10px -5px rgba(0, 0, 0, 0.04);
//   text-align: center;
//   max-width: 600px;
//   width: 100%;
// }

// .mainDiv h1 {
//   font-size: 2.5rem;
//   font-weight: bold;
//   color: #1f2937;
//   margin-bottom: 1rem;
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   -webkit-background-clip: text;
//   -webkit-text-fill-color: transparent;
//   background-clip: text;
// }

// .sampletext {
//   font-size: 1.1rem;
//   color: #6b7280;
//   line-height: 1.6;
//   margin-bottom: 1.5rem;
// }

// .sampletext code {
//   background: #f3f4f6;
//   padding: 0.25rem 0.5rem;
//   border-radius: 0.375rem;
//   font-family: 'Monaco', 'Menlo', monospace;
//   font-size: 0.9em;
// }

// .sampletext a {
//   color: #4f46e5;
//   text-decoration: none;
//   font-weight: 500;
// }

// .sampletext a:hover {
//   text-decoration: underline;
// }

// .mainDiv button {
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
//   border: none;
//   padding: 12px 24px;
//   border-radius: 8px;
//   font-size: 1rem;
//   font-weight: 600;
//   cursor: pointer;
//   margin: 1.5rem 0;
//   transition: transform 0.2s ease, box-shadow 0.2s ease;
// }

// .mainDiv button:hover {
//   transform: translateY(-2px);
//   box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
// }

// .logo {
//   margin-top: 2rem;
//   border-radius: 8px;
// }`,
// };

// // Function to convert templateFiles to Sandpack-compatible files
// export function loadReactTemplate(projectName = "custom-component") {
//   const sandpackPackageJson = `{
//     "name": "${projectName}",
//     "private": true,
//     "version": "0.0.0",
//     "scripts": {
//       "start": "react-scripts start"
//     },
//     "dependencies": {
//       "react": "^18.2.0",
//       "react-dom": "^18.2.0"
//     }
//   }`;

//   const projectFiles = {
//     "/index.html": templateFiles.indexHtml,
//     "/package.json": sandpackPackageJson,
//     "/src/main.jsx": templateFiles.mainJsx,
//     "/App.js": templateFiles.appJsx,
//     "/src/index.css": templateFiles.indexCss,
//     "/src/sdk/index.js": templateFiles.sdkIndex,
//     "/src/landing/index.jsx": templateFiles.landingIndex,
//     "/src/landing/styles.module.css": templateFiles.landingStyles,
//   };

//   return projectFiles;
// }

// // Load template for download (includes real Kissflow SDK in package.json)
// export function loadReactTemplateForDownload(projectName = "custom-component") {
//   // Process package.json template with project name (includes real SDK)
//   const packageJson = templateFiles.packageJsonTemplate.replace(
//     /<%= projectName %>/g,
//     projectName
//   );

//   const projectFiles = {
//     "/index.html": templateFiles.indexHtml,
//     "/package.json": packageJson, // This includes the real SDK
//     "/src/main.jsx": templateFiles.mainJsx,
//     "/src/App.jsx": templateFiles.appJsx,
//     "/src/index.css": templateFiles.indexCss,
//     "/src/sdk/index.js": templateFiles.sdkIndex,
//     "/src/sdk/wrapper.jsx": templateFiles.sdkWrapper,
//     "/src/landing/index.jsx": templateFiles.landingIndex,
//     "/src/landing/styles.module.css": templateFiles.landingStyles,
//   };

//   return projectFiles;
// }

// // Get available templates
// export function getAvailableTemplates() {
//   return [
//     {
//       id: "react",
//       name: "React + Kissflow SDK",
//       description: "React project with Kissflow SDK integration",
//       loader: loadReactTemplate,
//       downloadLoader: loadReactTemplateForDownload,
//     },
//   ];
// }

// export default {
//   loadReactTemplate,
//   loadReactTemplateForDownload,
//   getAvailableTemplates,
// };

// Template loader for converting template files to Sandpack project structure

// Template file contents (manually copied since we can't use ?raw imports reliably in all setups)
const templateFiles = {
  indexHtml: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Custom component</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>`,

  packageJsonTemplate: `{
    "name": "<%= projectName %>",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "zip": "cd dist/ && bestzip ../build.zip *",
        "build": "vite build && npm run zip",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@kissflow/lowcode-client-sdk": "1.0.39"
    },
    "engines": {
        "node": "^18.0.0 || >=20.0.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.64",
        "@types/react-dom": "^18.2.21",
        "@vitejs/plugin-react": "^4.2.1",
        "eslint": "^8.57.0",
        "eslint-plugin-react": "^7.34.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.5",
        "vite": "^5.1.6",
        "bestzip": "^2.2.1"
    }
}`,

  mainJsx: `import React from "react";
import { createRoot } from "react-dom/client";
import { SDKWrapper } from "./sdk/index.js"
console.error("sss")

import App from "./App.jsx";

import "./index.css";

const Root = createRoot(document.getElementById("root"));
Root.render(
<SDKWrapper>
		<App /></SDKWrapper>
);`,

  appJsx: `import { DefaultLandingComponent } from "./landing/index.jsx";
import React from "react";
console.error("Inside app");
function App() {
	return (
		<div className='rootDiv'>
			<DefaultLandingComponent />
		</div>
	);
}

export default App;`,

  indexCss: `* {
  box-sizing: border-box;
  text-rendering: optimizeLegibility !important;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: #ffffff;
  background-color: #242424;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  justify-content: center;
  min-width: 320px;
  min-height: 100vh;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

.rootDiv{
  width: 100%;
  height: 100%;
  max-height: 500px;
}

h1{
  font-weight: 700;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}`,

  sdkIndex: `export * from "./wrapper.jsx";`,

  //   sdkWrapper: `import KFSDK from "@kissflow/lowcode-client-sdk";
  // import React, { useState, useEffect } from "react";
  // console.log("hi",KFSDK);
  // let kf;
  // export function SDKWrapper(props) {
  // 	const [kfInstance, setKfInstance] = useState(null);

  // 	useEffect(function onLoad() {
  // 		if (!window.kf) {
  // 			KFSDK.initialize()
  // 				.then((sdk) => {
  // 					window.kf = kf = sdk;
  // 					setKfInstance(sdk);
  // 					console.info("SDK initialized successfully");
  // 				})
  // 				.catch((err) => {
  // 					setKfInstance({ isError: true });
  // 					console.error("Error initializing SDK:", err);
  // 				});
  // 		}
  // 	}, []);

  // 	return (
  // 		<React.Fragment>
  // 			{kfInstance && !kfInstance.isError && props.children}
  // 			{kfInstance && kfInstance.isError && (
  // 				<h3>Please use this component inside Kissflow</h3>
  // 			)}
  // 		</React.Fragment>
  // 	);
  // }

  // export { kf };`,

  sdkWrapper: `import KFSDK from "./dummyContext.js";
  import React, { useState, useEffect } from "react";
  
let kf;
export function SDKWrapper(props) {
	const [kfInstance, setKfInstance] = useState(null);

	useEffect(function onLoad() {
  console.error("Window", window)
  console.error("Done")
		 if (!window.kf) {
      console.info("Inside if",KFSDK)
			 KFSDK.initialize()
				.then((sdk) => {
          console.info("SDK",sdk)
					window.kf = kf = sdk;
					setKfInstance(sdk);
					console.info("SDK initialized successfully");
				})
				.catch((err) => {
          console.info("SDK error",err)
					setKfInstance({ isError: true });
					console.error("Error initializing SDK:", err);
				});
		 }
	}, []);

	return (
		<React.Fragment>
			{kfInstance && !kfInstance.isError && props.children}
			{kfInstance && kfInstance.isError && (
				<h3>Please use this component inside Kissflow</h3>
			)}
		</React.Fragment>
	);
}

export { kf };`,

  landingIndex: `

import styles from "../index.css";
console.error("Inside lnding");
export function DefaultLandingComponent() {
function handleClick(){}
	return (
		<div className={styles.landingHero}>
			<div className={styles.mainDiv}>
				<div>
					<p className={styles.sampletext}>
						This is a sample custom component pre-loaded with the
						Kissflow SDK. <br></br>Edit <code>App.jsx</code> to make
						changes.
					</p>
					<p className={styles.sampletext}>
						Click{" "}
						<a
							href='https://kissflow.github.io/lcnc-sdk-js/'
							target='_blank'>
							here
						</a>{" "}
						to read the SDK documentation.{" "}
					</p>
				</div>
				<button onClick={handleClick}>Click me</button>
			</div>
		</div>
	);
}`,

  landingStyles: `.landingHero {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 20px;
}

.mainDiv {
	background: white;
	border-radius: 12px;
	padding: 40px;
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	text-align: center;
	max-width: 600px;
	width: 100%;
}

.mainDiv h1 {
	font-size: 2.5rem;
	font-weight: bold;
	color: #1f2937;
	margin-bottom: 1rem;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.sampletext {
	font-size: 1.1rem;
	color: #6b7280;
	line-height: 1.6;
	margin-bottom: 1.5rem;
}

.sampletext code {
	background: #f3f4f6;
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 0.9em;
}

.sampletext a {
	color: #4f46e5;
	text-decoration: none;
	font-weight: 500;
}

.sampletext a:hover {
	text-decoration: underline;
}

.mainDiv button {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	padding: 12px 24px;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	margin: 1.5rem 0;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mainDiv button:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.logo {
	margin-top: 2rem;
	border-radius: 8px;
}`,

  sdkDummyContext: SDK_DUMMY,
};

// Load template files and convert them to Sandpack format (without SDK in package.json to avoid CDN issues)
export function loadReactTemplate(projectName = "custom-component") {
  // Create Sandpack-compatible package.json (without Kissflow SDK to avoid CDN 503)
  const sandpackPackageJson = `{
    "name": "${projectName}",
    "private": true,
    "version": "0.0.0",
    "scripts": {
        "start": "react-scripts start"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@kissflow/lowcode-client-sdk": "latest"
    }
}`;

  // console.log("KFSDK_Raw", KFSDK_Raw);

  const projectFiles = {
    "/index.html": templateFiles.indexHtml,
    "/package.json": sandpackPackageJson,
    "/src/main.jsx": templateFiles.mainJsx,
    "/src/App.jsx": templateFiles.appJsx,
    "/src/index.css": templateFiles.indexCss,
    "/src/sdk/index.js": templateFiles.sdkIndex,
    "/src/sdk/wrapper.jsx": templateFiles.sdkWrapper,
    "src/sdk/dummyContext.js": templateFiles.sdkDummyContext,
    "/src/landing/index.jsx": templateFiles.landingIndex,
    "/src/landing/styles.module.css": templateFiles.landingStyles,
  };

  return projectFiles;
}

// Load template for download (includes real Kissflow SDK in package.json)
export function loadReactTemplateForDownload(projectName = "custom-component") {
  // Process package.json template with project name (includes real SDK)
  const packageJson = templateFiles.packageJsonTemplate.replace(
    /<%= projectName %>/g,
    projectName
  );

  const projectFiles = {
    "/index.html": templateFiles.indexHtml,
    "/package.json": packageJson, // This includes the real SDK
    "/src/main.jsx": templateFiles.mainJsx,
    "/src/App.jsx": templateFiles.appJsx,
    "/src/index.css": templateFiles.indexCss,
    "/src/sdk/index.js": templateFiles.sdkIndex,
    "/src/sdk/wrapper.jsx": templateFiles.sdkWrapper,
    "/src/landing/index.jsx": templateFiles.landingIndex,
    "/src/landing/styles.module.css": templateFiles.landingStyles,
    // Don't include mock node_modules for download
  };

  return projectFiles;
}

// Get available templates
export function getAvailableTemplates() {
  return [
    {
      id: "react",
      name: "React + Kissflow SDK",
      description: "React project with Kissflow SDK integration",
      loader: loadReactTemplate,
      downloadLoader: loadReactTemplateForDownload,
    },
  ];
}

export default {
  loadReactTemplate,
  loadReactTemplateForDownload,
  getAvailableTemplates,
};
