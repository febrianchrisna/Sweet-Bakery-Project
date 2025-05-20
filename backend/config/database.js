import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql",
});

// Add a function to sync all models in the correct order
export const syncDatabase = async () => {
    try {
        // Test database connection
        await db.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync all models - force:true will drop tables if they exist
        // Use { force: true } only in development and with caution
        // For production or existing databases use { alter: true }
        await db.sync({ alter: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database or sync models:', error);
    }
};

export default db;