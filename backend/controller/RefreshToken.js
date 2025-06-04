import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    // Try to get the refresh token from different sources (body, authorization header)
    const refreshToken =
      req.body.refreshToken ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ") &&
        req.headers.authorization.split(" ")[1]) ||
      req.cookies.refresh_token; // Also check for refresh token in cookies

    // If no refresh token is provided
    if (!refreshToken)
      return res.status(401).json({
        status: "Error",
        message: "Refresh token required",
      });

    // Find user with this refresh token
    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    // If user not found or token doesn't match
    if (!user || !user.refresh_token) {
      return res.status(403).json({
        status: "Error",
        message: "Invalid refresh token",
      });
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: "Error",
            message: "Invalid or expired refresh token",
          });
        }

        const userPlain = user.toJSON();
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;

        // Generate new access token that expires in 30 SECONDS
        const accessToken = jwt.sign(
          safeUserData,
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30s", // 30 seconds, not minutes
          }
        );

        // Return the new access token
        res.json({
          status: "Success",
          accessToken,
        });
      }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      status: "Error",
      message: "Failed to refresh token",
    });
  }
};