import express from 'express';

import { showHomePage } from './index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm 
    } from './organizations.js';

import { 
        showProjectsPage, 
        showProjectDetailsPage,
        showNewProjectForm,
        processNewProjectForm,
        projectValidation,
        showEditProjectForm,
        processEditProjectForm 
        } from './projects.js';

import { 
        showCategoriesPage, 
        showCategoryDetailsPage,
        showAssignCategoriesForm, 
        processAssignCategoriesForm
        } from './categories.js';

import { testErrorPage } from './errors.js';


const router = express.Router();

// Home
router.get('/', showHomePage);

// List of organizations
router.get('/organizations', showOrganizationsPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', processEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Upcoming projects page
router.get('/projects', showProjectsPage);

// ⭐ New project details route
router.get('/projects/:id', showProjectDetailsPage);
router.get('/project/:id', showProjectDetailsPage);

// New project routes
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

// Ability to edit service projects
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

// Categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

/// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Error test route
router.get('/test-error', testErrorPage);

export default router;