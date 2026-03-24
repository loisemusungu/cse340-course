import express from 'express';

import { showHomePage } from './index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './categories.js';
import { testErrorPage } from './errors.js';
import { showNewOrganizationForm } from './organizations.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// List of organizations
router.get('/organizations', showOrganizationsPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Upcoming projects page
router.get('/projects', showProjectsPage);

// ⭐ New project details route
router.get('/projects/:id', showProjectDetailsPage);
router.get('/project/:id', showProjectDetailsPage);

// Categories
router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

// Error test route
router.get('/test-error', testErrorPage);

export default router;