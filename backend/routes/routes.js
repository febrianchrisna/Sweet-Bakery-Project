import express from 'express';
import { login, register, logout, getUser, updateProfile, deleteUser } from '../controller/UserController.js';
import { 
    getProducts, getProductById, createProduct, 
    updateProduct, deleteProduct, getCategories 
} from '../controller/ProductController.js';
import { 
    getAllOrders, getUserOrders, getOrderById, 
    createOrder, updateOrderStatus, updateUserOrderStatus, deleteUserOrder, updateUserOrder
} from '../controller/OrderController.js';
import { verifyToken, isAdmin } from '../middleware/AuthMiddleware.js';
import { refreshToken } from '../controller/RefreshToken.js';

const router = express.Router();

// ==================== AUTH ROUTES (untuk semua) ====================
router.post("/login", login);
router.post("/register", register);
router.get("/logout", verifyToken, logout);
router.get("/token", refreshToken);

// ==================== USER PROFILE ROUTES ====================
// Update profile (all authenticated users)
router.put("/profile", verifyToken, updateProfile);

// ==================== ADMIN ROUTES (khusus admin) ====================
// User management (admin only)
router.get("/users", verifyToken, isAdmin, getUser);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

// Product management (admin only)
router.get("/products", getProducts);
router.post("/products", verifyToken, isAdmin, createProduct);
router.put("/products/:id", verifyToken, isAdmin, updateProduct);
router.delete("/products/:id", verifyToken, isAdmin, deleteProduct);

// Order Status management (admin only)
router.get("/orders", verifyToken, isAdmin, getAllOrders);
router.put("/orders/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.delete("/orders/:id", verifyToken, isAdmin, deleteUserOrder); // Admin hapus pesanan

// Admin check endpoint - simple endpoint that returns 200 if the user is an admin
router.get("/check-admin", verifyToken, isAdmin, (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "You have admin privileges"
  });
});

// ==================== USER ROUTES (khusus user) ====================
// Product browsing (user & public)
router.get("/products/categories", getCategories);
router.get("/products/:id", getProductById);

// Order management (user only)
router.get("/user/orders", verifyToken, getUserOrders);
router.get("/orders/:id", verifyToken, getOrderById);
router.post("/orders", verifyToken, createOrder);
router.put("/user/orders/:id/cancel", verifyToken, updateUserOrderStatus);
router.put("/user/orders/:id", verifyToken, updateUserOrder); // User edit pesanan
router.delete("/user/orders/:id", verifyToken, deleteUserOrder);

// ==================== HEALTH CHECK ====================
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

export default router;
