import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { PluginOption } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react()];

  if (mode === 'development') {
    plugins.push(componentTagger());
  }

  return {
    server: {
      host: "0.0.0.0",      // ✅ enables external access (e.g. Codespaces)
      port: 8080,           // or change to 5173 if you prefer
      watch: {
        usePolling: false,
        interval: 1000,
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // ✅ import using "@/..."
      },
    },
  };
});
