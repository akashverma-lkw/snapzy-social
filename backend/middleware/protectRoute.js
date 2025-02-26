import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		// ✅ Ensure cookies are available
		const token = req.cookies?.jwt; // Extract token from cookie

		if (!token) {
			console.log("No token found in cookies");
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		// ✅ Verify JWT
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			console.error("JWT Verification Error:", err.message);
			return res.status(401).json({ error: "Unauthorized: Token is invalid or expired" });
		}

		console.log("Decoded Token:", decoded); // Debugging

		// ✅ Fetch user (exclude password)
		const user = await User.findById(decoded.userId).select("-password");
		if (!user) {
			console.log("User not found in database");
			return res.status(404).json({ error: "User not found" });
		}

		// ✅ Attach user to request
		req.user = user;
		next();
	} catch (err) {
		console.error("Error in protectRoute middleware:", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
