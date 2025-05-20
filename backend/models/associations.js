import User from './UserModel.js';
import Product from './ProductModel.js';
import Order from './OrderModel.js';
import OrderDetail from './OrderDetailModel.js';

// User and Order associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order and OrderDetail associations
Order.hasMany(OrderDetail, { foreignKey: 'orderId' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId' });

// Product and OrderDetail associations
Product.hasMany(OrderDetail, { foreignKey: 'productId' });
OrderDetail.belongsTo(Product, { foreignKey: 'productId' });

export { User, Product, Order, OrderDetail };
