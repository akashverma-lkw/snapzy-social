import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000, // ✅ Frontend will run on port 3000
		proxy: {
			"/api": {
				target: import.meta.env.VITE_API_URL, // ✅ Correct way to access VITE env variables
				changeOrigin: true,
				secure: true, // 🔥 Secure https request
				ws: true,
			},
		},
	},
});
