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
              expiresIn: "30s", // 30 seconds
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
  
          // Set refresh token in HTTP-only cookie
          res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "none", // Required for cross-origin cookies
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: true, // Always true for HTTPS deployment
            path: "/",
          });

          console.log('Refresh token cookie set successfully');
  
          // Send access token in response body for localStorage
          res.status(200).json({
            status: "Success",
            message: "Login Successful",
            safeUserData,
            accessToken
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
    
    // Clear refresh token cookie with same settings
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      path: "/",
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

// Update user profile - accessible for all authenticated users (admin & customer)
async function updateProfile(req, res) {
  try {
    const userId = req.userId;
    const { username, currentPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User not found"
      });
    }

    // If user wants to change password
    if (currentPassword && newPassword) {
      // Validate current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "Error",
          message: "Current password is incorrect"
        });
      }
      
      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 5);
      
      // Update user with new password
      await User.update(
        { 
          username: username || user.username,
          password: hashedNewPassword 
        },
        { where: { id: userId } }
      );
    } else {
      // Just update username
      await User.update(
        { username: username || user.username },
        { where: { id: userId } }
      );
    }
    
    // Get updated user data
    const updatedUser = await User.findByPk(userId);
    const { password: _, refresh_token: __, ...safeUserData } = updatedUser.toJSON();
    
    return res.status(200).json({
      status: "Success",
      message: "Profile updated successfully",
      data: safeUserData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: "Error",
      message: error.message || "Failed to update profile"
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

export { login, logout, getUser, register, updateProfile, deleteUser };