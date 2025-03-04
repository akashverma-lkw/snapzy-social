import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000, // ✅ Ensures frontend runs on port 3000
		proxy: {
			"/api": {
				target: import.meta.env.VITE_API_URL, // ✅ Ensure this matches your backend port
				changeOrigin: true,
				secure: ture, // Optional: use `false` if you have HTTPS issues in development
				ws: true, // Optional: handles WebSocket connections if needed
			},
		},
	},
});
