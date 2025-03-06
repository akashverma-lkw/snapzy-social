Description of the project____

Some Features:

-   ⚛️ Tech Stack: React.js, MongoDB, Node.js, Express, Tailwind
-   🔐 Authentication with JSONWEBTOKENS (JWT)
-   🔥 React Query for Data Fetching, Caching etc.
-   👥 Suggested Users to Follow
-   ✍️ Creating Posts
-   🗑️ Deleting Posts
-   💬 Commenting on Posts
-   ❤️ Liking Posts
-   🔒 Delete Posts (if you are the owner)
-   📝 Edit Profile Info
-   🖼️ Edit Cover Image and Profile Image
-   📷 Image Uploads using Cloudinary
-   🔔 Send Notifications
-   🌐 Deployment
  # Add an empty line to README
# snapzy-social



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
			sameSite: "none", // Cross-Origin ke liye Fix
			secure: process.env.NODE_ENV !== "production", // True on deployment Required for Render (HTTPS)
		});

		// Store token in response for debugging
		res.token = token;
		
	} catch (error) {
		console.error("JWT Generation Error:", error);
	}
};



import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies?.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;
		next();
	} catch (err) {
		console.log("Error in protectRoute middleware", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};