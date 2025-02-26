import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000, // ✅ Ensures frontend runs on port 3000
		proxy: {
			"/api": {
				target: "http://localhost:5002", // ✅ Ensure this matches your backend port
				changeOrigin: true,
				secure: false, // Optional: use `false` if you have HTTPS issues in development
				ws: true, // Optional: handles WebSocket connections if needed
			},
		},
	},
});
