import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	try {
		const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
			expiresIn: "15d",
		});

		// Ensure secure cookies & CORS settings for Render
		res.cookie("jwt", token, {
			maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
			httpOnly: true, // Prevents XSS attacks
			sameSite: "lax", // Cross-Origin ke liye Fix
			secure: true, // True on deployment Required for Render (HTTPS)
		});

		// Store token in response for debugging
		res.token = token;
		
	} catch (error) {
		console.error("JWT Generation Error:", error);
	}
};
