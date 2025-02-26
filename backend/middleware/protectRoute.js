import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies?.jwt; // Ensure cookie is properly accessed
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({ error: "Unauthorized: Token is invalid or expired" });
		}

		console.log("Decoded Token:", decoded); // Debugging

		const user = await User.findById(decoded.id || decoded.userId).select("-password");

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
