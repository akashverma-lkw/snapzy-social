import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		httpOnly: true, // Prevents XSS attacks
		sameSite: "None", // Allows cross-site cookies (important for frontend & backend on different domains)
		secure: process.env.NODE_ENV === "production", // Ensures secure cookies in production (Render)
	});
};
