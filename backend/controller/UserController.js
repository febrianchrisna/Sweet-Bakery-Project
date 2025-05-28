import User from '../models/UserModel.js'; // Import model User dari sequelize
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Get all users
async function getUser(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'username', 'role'] // Include role
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ 
      status: "Error", 
      message: error.message 
    });
  }
}

// Register new user
async function register(req, res) {
  try {
    const { email, username, password, role = 'customer' } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({
      where: {
        email: email
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        status: "Error", 
        message: "Email already registered" 
      });
    }
    
    // Hash the password
    const encryptPassword = await bcrypt.hash(password, 5);
    
    // Create new user
    const newUser = await User.create({
      email,
      username,
      password: encryptPassword,
      role,
      refresh_token: null
    });
    
    // Return success but don't include password in response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    
    res.status(201).json({
      status: "Success",
      message: "Registration successful",
      data: userWithoutPassword
    });
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ 
      status: "Error", 
      message: error.message 
    });
  }
}

async function login(req, res) {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({
        where: {
          email: email,
        },
      });
  
      if (user) {
        const userPlain = user.toJSON();
  
        // Exclude sensitive information from user data sent to frontend
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;
  
        const decryptPassword = await bcrypt.compare(password, user.password);
  
        if (decryptPassword) {
          const accessToken = jwt.sign(
            safeUserData,
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "30m",
            }
          );
  
          const refreshToken = jwt.sign(
            safeUserData,
            process.env.REFRESH_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );
  
          await User.update(
            { refresh_token: refreshToken },
            {
              where: {
                id: user.id,
              },
            }
          );
  
          // Set access token in cookie - with more permissive settings
          res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "lax", // Changed from "none" to "lax"
            maxAge: 30 * 60 * 1000, // 30 minutes
            secure: process.env.NODE_ENV === "production", // Only secure in production
            path: "/"
          });

          // Set refresh token in cookie
          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "lax", // Changed from "none" to "lax"
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === "production", // Only secure in production
            path: "/"
          });
  
          // Also send tokens in response body as fallback
          res.status(200).json({
            status: "Success",
            message: "Login Successful",
            safeUserData,
            accessToken,
            refreshToken
          });
        } else {
          const error = new Error("Password or email incorrect");
          error.statusCode = 400;
          throw error;
        }
      } else {
        const error = new Error("Password or email incorrect");
        error.statusCode = 400;
        throw error;
      }
    } catch (error) {
      res.status(error.statusCode || 500).json({
        status: "Error",
        message: error.message,
      });
    }
}
  
async function logout(req, res) {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    
    // Update user to clear refresh token
    if (userId) {
      await User.update(
        { refresh_token: null },
        {
          where: {
            id: userId,
          },
        }
      );
    }
    
    // Clear cookies with the same settings that were used to set them
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
    
    res.status(200).json({
      status: "Success",
      message: "Logout successful"
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: "Error",
      message: "Logout failed"
    });
  }
}

// Delete user (admin only)
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId == req.userId) {
      return res.status(400).json({
        status: "Error",
        message: "Cannot delete your own account"
      });
    }
    
    // Find the user to be deleted
    const userToDelete = await User.findByPk(userId);
    
    if (!userToDelete) {
      return res.status(404).json({
        status: "Error",
        message: "User not found"
      });
    }
    
    // Delete the user
    await userToDelete.destroy();
    
    return res.status(200).json({
      status: "Success",
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      status: "Error",
      message: error.message || "Failed to delete user"
    });
  }
}

export { login, logout, getUser, register, deleteUser };