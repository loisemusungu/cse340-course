import express from 'express';

import { showHomePage } from './index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// Home
router.get('/', showHomePage);

// List of organizations
router.get('/organizations', showOrganizationsPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Upcoming projects page
router.get('/projects', showProjectsPage);

// ⭐ New project details route
router.get('/projects/:id', showProjectDetailsPage);

// Categories
router.get('/categories', showCategoriesPage);

// Error test route
router.get('/test-error', testErrorPage);

export default router;