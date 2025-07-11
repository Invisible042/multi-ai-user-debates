export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react()];
  
  if (mode === 'development') {
    plugins.push(componentTagger());
  }
  
  return {
    server: {
      host: "0.0.0.0", // ✅ instead of "::"
      port: 8080,
      watch: {
        usePolling: false,
        interval: 1000,
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
