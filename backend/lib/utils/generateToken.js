import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true, // Prevents XSS attacks
      secure: true, // ✅ Always use secure cookies (Render requires HTTPS)
      sameSite: "None", // ✅ Allows cross-origin requests
    });

    res.status(200).json({ message: "Token generated successfully", token });
  } catch (error) {
    console.error("JWT Generation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
