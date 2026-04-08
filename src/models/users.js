import bcrypt from 'bcrypt';
import db from './db.js';
import pool from "./db.js";

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const query_params = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const query_params = [email];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Authenticate user with email and password
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) return null;

    // Remove password_hash before returning user
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const getAllUsers = async () => {
    const sql = `
        SELECT 
            u.user_id,
            u.name,
            u.email,
            r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.user_id;
    `;

    try {
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        console.log("Error getting all users", error);
        throw error;
    }
};

export { 
        createUser, 
        findUserByEmail, 
        authenticateUser, 
        getAllUsers 
    };