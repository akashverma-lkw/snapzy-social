import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		// Ensure the token is properly accessed
		const token = req.cookies?.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			console.error("JWT Verification Error:", err.message);
			return res.status(401).json({ error: "Unauthorized: Token is invalid or expired" });
		}

		console.log("Decoded Token:", decoded); // Debugging

		// Fetch user from DB and exclude password
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (err) {
		console.error("Error in protectRoute middleware:", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
