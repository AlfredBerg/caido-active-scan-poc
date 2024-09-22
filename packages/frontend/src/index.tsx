import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { runScan } from "@/scan/scan";
import { CaidoSDK } from "@/types/types";
import { initializeSDK } from "@/stores/sdkStore";
import { useScansStore } from "@/stores/scansStore";
import { useTemplatesStore } from "@/stores/templatesStore";
import useSettingsStore from "@/stores/settingsStore";
import { useTemplateResultsStore } from "@/stores/templateResultsStore";

export const init = (sdk: CaidoSDK) => {
  initializeSDK(sdk);
  useScansStore.getState().initialize();
  useTemplatesStore.getState().initialize();
  useSettingsStore.getState().initialize();
  useTemplateResultsStore.getState().initialize();

  const rootElement = document.createElement("div");
  Object.assign(rootElement.style, {
    height: "100%",
    width: "100%",
  });

  const root = createRoot(rootElement);
  root.render(<App />);

  // Add the root element to the SDK navigation page
  sdk.navigation.addPage("/activescan", {
    body: rootElement,
  });

  // Register a sidebar item
  sdk.sidebar.registerItem("Active Scan", "/activescan");

  sdk.commands.register("activeScan", {
    name: "Active Scan: Scan",
    run: (context) => runScan(sdk, context),
  });

  sdk.menu.registerItem({
    type: "Request",
    commandId: "activeScan",
  });

  sdk.menu.registerItem({
    type: "RequestRow",
    commandId: "activeScan",
  });
};
