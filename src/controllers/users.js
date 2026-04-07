import { authenticateUser } from '../models/users.js';

// Show the login form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Process the login form
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            req.session.user = user;
            req.flash('success', 'Login successful!');

            console.log('User logged in:', user);

            return res.redirect('/dashboard');
        }

        req.flash('error', 'Invalid email or password.');
        res.redirect('/login');

    } catch (error) {
        console.log('Error during login:', error);
        req.flash('error', 'Something went wrong. Try again.');
        res.redirect('/login');
    }
};

// Logout user
const processLogout = (req, res) => {
    if (req.session) {
        // Set the flash message first
        req.flash('success', 'Logout successful!');

        // Then destroy the session
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.redirect('/');
            }

            // Redirect after session is gone
            res.redirect('/login');
        });
    } else {
        res.redirect('/login');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        // User has required role, continue
        next();
    };
};

// Show the form to create a new organization (admin only)
const newOrganizationPage = (req, res) => {
    res.render('new-organization', { title: 'Create New Organization' });
};

// Handle form submission (already in your routes as processNewOrganizationForm)
const processNewOrganizationForm = (req, res) => {
    // Your logic to save the new organization to the database
    // For now, just redirect with a success message
    req.flash('success', 'Organization created successfully!');
    res.redirect('/organizations');
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

export { 
        showLoginForm, 
        processLoginForm, 
        processLogout,
        requireLogin,
        showDashboard,
        requireRole,
        newOrganizationPage,
        processNewOrganizationForm 
        };