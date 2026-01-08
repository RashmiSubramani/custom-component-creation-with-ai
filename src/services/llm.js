// LLM service for making API calls through backend proxy
// This avoids CORS issues by routing requests through your server

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3005";

/**
 * Simple error toast function for user feedback
 */
function _sendErrorToast(error) {
  console.error("LLM Error:", error.message);
  // Could be extended to show actual toast notifications in the future
}

/**
 * Makes an LLM API call with the given prompt
 * @param {string} prompt - The user's prompt
 * @param {string} model - The model to use ("openai" or "anthropic")
 * @returns {Promise<string>} - The LLM response
 */
export async function callLLM(prompt, model = "openai") {
  try {
    const response = await fetch(`${SERVER_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, model }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      _sendErrorToast(
        new Error(
          "Cannot connect to server. Make sure the backend server is running on port 3005."
        )
      );
    }
    console.error("LLM API Error:", error);
    throw error;
  }
}
