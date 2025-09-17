import React, { createContext, useContext, useEffect, useState } from "react";
import KFSDK from "@kissflow/lowcode-client-sdk";

let kf = null; // ✅ global export (for non-React code)

const SDKContext = createContext(null);

export function SDKProvider({ children }) {
  const [kfInstance, setKfInstance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    KFSDK.initialize()
      .then((sdk) => {
        kf = sdk; // ✅ set global instance
        setKfInstance(sdk);
        console.info("✅ SDK initialized successfully");
      })
      .catch((err) => {
        console.error("❌ Error initializing SDK:", err);
        setError(err);
      });
  }, []);

  if (error) {
    return <h3>Please use this component inside Kissflow</h3>;
  }

  if (!kfInstance) {
    return <div>Loading SDK...</div>;
  }

  return <SDKContext.Provider value={kfInstance}>{children}</SDKContext.Provider>;
}

export function useKF() {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error("useKF must be used within an SDKProvider");
  }
  return context;
}

export { kf }; // ✅ export singleton (can be null until initialized)