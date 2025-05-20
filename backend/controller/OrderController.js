import Order from '../models/OrderModel.js';
import OrderDetail from '../models/OrderDetailModel.js';
import Product from '../models/ProductModel.js';
import db from '../config/database.js';

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderDetail,
                    include: [Product]
                },
                {
                    association: 'user', // pastikan ada association 'user' di model Order
                    attributes: ['id', 'username', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderDetail,
                    include: [Product]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: OrderDetail,
                    include: [Product]
                },
                {
                    association: 'user',
                    attributes: ['id', 'username', 'email']
                }
            ]
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ambil role user dari request (support req.userRole dan req.user?.role)
        const userRole = req.userRole || (req.user && req.user.role);

        // Admin boleh akses semua order, user hanya order miliknya
        if (userRole === 'admin' || req.userId === order.userId) {
            return res.status(200).json(order);
        } else {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const { items, shipping_address, payment_method } = req.body;
        const userId = req.userId;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }
        
        // Calculate total amount and check stock
        let total_amount = 0;
        const productUpdates = [];
        const insufficientStockProducts = [];
        
        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            
            // Check stock availability
            if (product.stock < item.quantity) {
                insufficientStockProducts.push({
                    id: product.id,
                    name: product.name,
                    available: product.stock,
                    requested: item.quantity
                });
            } else {
                total_amount += product.price * item.quantity;
                productUpdates.push({
                    product,
                    quantityToReduce: item.quantity
                });
            }
        }
        
        // If any products have insufficient stock, abort the order
        if (insufficientStockProducts.length > 0) {
            await transaction.rollback();
            return res.status(400).json({ 
                message: 'Some products have insufficient stock',
                insufficientStockProducts 
            });
        }
        
        // Create order
        const newOrder = await Order.create({
            userId,
            total_amount,
            status: 'pending',
            shipping_address,
            payment_method
        }, { transaction });
        
        // Create order details and update product stock
        const orderDetails = [];
        
        for (const update of productUpdates) {
            const { product, quantityToReduce } = update;
            const subtotal = product.price * quantityToReduce;
            
            // Update product stock
            await product.update({ 
                stock: product.stock - quantityToReduce 
            }, { transaction });
            
            const orderDetail = await OrderDetail.create({
                orderId: newOrder.id,
                productId: product.id,
                quantity: quantityToReduce,
                price: product.price,
                subtotal
            }, { transaction });
            
            orderDetails.push({
                ...orderDetail.toJSON(),
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                }
            });
        }
        
        await transaction.commit();
        
        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: newOrder.id,
                userId,
                total_amount,
                status: 'pending',
                shipping_address,
                payment_method,
                createdAt: newOrder.createdAt,
                order_details: orderDetails
            }
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        await order.update({ status });
        
        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status by user (only their own orders)
export const updateUserOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.userId;
        const orderId = req.params.id;
        
        // Only allow users to cancel their orders
        if (status !== 'cancelled') {
            return res.status(403).json({ 
                message: 'Users can only cancel orders. Other status changes require admin privileges.' 
            });
        }
        
        const order = await Order.findByPk(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Verify the order belongs to the logged-in user
        if (order.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to modify this order' });
        }
        
        // Check if the order is in a status that can be cancelled
        if (order.status === 'completed' || order.status === 'cancelled') {
            return res.status(400).json({ 
                message: `Cannot cancel an order that is already ${order.status}` 
            });
        }
        
        // Handle stock restoration for cancelled orders
        if (status === 'cancelled') {
            const orderDetails = await OrderDetail.findAll({
                where: { orderId: order.id },
                include: [Product]
            });
            
            const transaction = await db.transaction();
            
            try {
                // Return items to inventory
                for (const detail of orderDetails) {
                    await Product.increment(
                        { stock: detail.quantity }, 
                        { 
                            where: { id: detail.productId },
                            transaction 
                        }
                    );
                }
                
                // Update order status
                await order.update({ status }, { transaction });
                
                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        } else {
            await order.update({ status });
        }
        
        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order details by user (only their own pending orders)
export const updateUserOrder = async (req, res) => {
    try {
        const { shipping_address, payment_method } = req.body;
        const userId = req.userId;
        const orderId = req.params.id;
        
        const order = await Order.findByPk(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Verify the order belongs to the logged-in user
        if (order.userId !== userId && req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to modify this order' });
        }
        
        // Check if the order is in a status that can be edited
        if (order.status !== 'pending' && req.userRole !== 'admin') {
            return res.status(400).json({ 
                message: 'Only pending orders can be edited' 
            });
        }
        
        // For admin users, they can update status as well
        if (req.userRole === 'admin' && req.body.status) {
            await order.update({ 
                shipping_address, 
                payment_method,
                status: req.body.status
            });
        } else {
            // Regular users can only update shipping and payment
            await order.update({ shipping_address, payment_method });
        }
        
        res.status(200).json({
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete order (soft delete) - for user's own orders and admin
export const deleteUserOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const orderId = req.params.id;

        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Allow admin to delete any order, user only their own
        const userRole = req.userRole || (req.user && req.user.role);
        if (userRole !== 'admin' && order.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this order' });
        }

        // Only allow deletion of pending orders, unless admin
        if (order.status !== 'pending' && userRole !== 'admin') {
            return res.status(400).json({ 
                message: 'Only pending orders can be deleted. Please cancel the order instead.' 
            });
        }

        // Handle stock restoration
        const orderDetails = await OrderDetail.findAll({
            where: { orderId: order.id }
        });

        const transaction = await db.transaction();

        try {
            // Return items to inventory
            for (const detail of orderDetails) {
                await Product.increment(
                    { stock: detail.quantity }, 
                    { 
                        where: { id: detail.productId },
                        transaction 
                    }
                );
            }

            // Delete order details
            await OrderDetail.destroy({
                where: { orderId: order.id },
                transaction
            });

            // Delete the order
            await order.destroy({ transaction });

            await transaction.commit();

            res.status(200).json({
                message: 'Order deleted successfully'
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
