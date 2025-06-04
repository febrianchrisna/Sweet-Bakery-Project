import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    console.log('Refresh token request received');
    console.log('All cookies:', req.cookies);
    
    // Get the refresh token from cookies ONLY
    const refreshToken = req.cookies.refresh_token;

    console.log('Refresh token from cookies:', refreshToken ? 'Present' : 'Not found');

    // If no refresh token is provided in cookies
    if (!refreshToken) {
      console.log('No refresh token cookie found');
      return res.status(401).json({
        status: "Error",
        message: "Refresh token required - no cookie found",
      });
    }

    // Find user with this refresh token
    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    // If user not found or token doesn't match
    if (!user || !user.refresh_token) {
      console.log('User not found or token mismatch');
      return res.status(403).json({
        status: "Error",
        message: "Invalid refresh token - user not found or token mismatch",
      });
    }

    // Verify the refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log('JWT verification failed:', err.message);
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
            expiresIn: "30s", // 30 seconds
          }
        );

        console.log('New access token generated successfully for user:', safeUserData.id);

        // Return the new access token (refresh token stays in cookie)
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