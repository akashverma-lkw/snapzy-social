import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
	const API_URL = process.env.VITE_API_URL; // ✅ Environment variable yahan access karo

	return {
		plugins: [react()],
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: API_URL, // ✅ Use the API URL
					changeOrigin: true,
					secure: true,
					ws: true,
				},
			},
		},
	};
});
