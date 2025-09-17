import React, { useState, useEffect } from 'react';
import { generateSDKEnhancedPrompt, matchSDKCommands } from '../utils/sdkCommandMatcher';

// Demo component to show SDK integration in action
export default function SDKDemo() {
  const [testPrompt, setTestPrompt] = useState("create a form component that shows data from Example Form 1");
  const [selectedSuggestions, setSelectedSuggestions] = useState([
    { id: "formId1", name: "Example Form 1", type: "form" }
  ]);
  const [result, setResult] = useState(null);

  const handleTest = () => {
    const enhancement = generateSDKEnhancedPrompt(testPrompt, selectedSuggestions);
    setResult(enhancement);
  };

  useEffect(() => {
    handleTest();
  }, [testPrompt, selectedSuggestions]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-4">SDK Integration Demo</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Test Prompt:</label>
          <textarea
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Selected Suggestions:</label>
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(selectedSuggestions, null, 2)}
          </pre>
        </div>

        <button
          onClick={handleTest}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test SDK Integration
        </button>

        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Results:</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Has SDK Commands:</h4>
                <p className={result.hasSDKCommands ? "text-green-600" : "text-red-600"}>
                  {result.hasSDKCommands ? "✅ Yes" : "❌ No"}
                </p>
              </div>

              {result.hasSDKCommands && (
                <>
                  <div>
                    <h4 className="font-medium">Detected Commands:</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      {result.commands.map((cmd, index) => (
                        <div key={index} className="mb-2 p-2 bg-white rounded border">
                          <div><strong>Category:</strong> {cmd.category}</div>
                          <div><strong>Description:</strong> {cmd.description}</div>
                          <div><strong>Usage:</strong> <code className="bg-gray-200 px-1 rounded">{cmd.enhancedUsage}</code></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium">Entity IDs:</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm">
                      {JSON.stringify(result.entityIds, null, 2)}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium">Enhanced Prompt for LLM:</h4>
                    <div className="bg-blue-50 p-3 rounded text-sm max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">{result.enhancedPrompt}</pre>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}