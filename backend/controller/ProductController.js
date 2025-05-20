import Product from '../models/ProductModel.js';
import { Op } from 'sequelize';

// Get all products
export const getProducts = async (req, res) => {
    try {
        const { category, featured, search } = req.query;
        let whereClause = {};
        
        // Filter by category if provided
        if (category) {
            whereClause.category = category;
        }
        
        // Filter featured products
        if (featured === 'true') {
            whereClause.featured = true;
        }
        
        // Search by product name
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        
        const products = await Product.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new product (admin only)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, featured, stock } = req.body;
        
        const newProduct = await Product.create({
            name,
            description,
            price,
            image,
            category,
            featured: featured || false,
            stock: stock || 0
        });
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update product (admin only)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        await product.update(req.body);
        
        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete product (admin only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        await product.destroy();
        
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get product categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.findAll({
            attributes: ['category'],
            group: ['category']
        });
        
        res.status(200).json(categories.map(item => item.category));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
