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
        showDashboard 
        };