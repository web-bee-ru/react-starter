import react from "@vitejs/plugin-react-swc";
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const root = resolve(__dirname);
const outDir = resolve(__dirname, 'dist');

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, root, ['']) ?? {};
  const { VITE_API_STAND_URL, VITE_APP_PORT, VITE_API_BASE_URL } = env;

  return defineConfig({
    plugins: [react(), svgrPlugin(), tsconfigPaths()],
    root,
    server: {
      port: +VITE_APP_PORT || 3000,
      proxy: {
        [VITE_API_BASE_URL]: {
          target: VITE_API_STAND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir,
      emptyOutDir: true,
    },
    define: {
      'global': {},
      'process.env': env,
    },
  });
};
