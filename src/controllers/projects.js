// Import any needed model functions
import { getAllOrganizations } from '../models/organizations.js';
import { 
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject,
} from '../models/projects.js';

import { 
  getAllCategories,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments as updateProjectCategories
} from '../models/categories.js';

import {
  addVolunteer,
  removeVolunteer,
  hasVolunteered
} from '../models/volunteers.js';

import { body, validationResult } from 'express-validator';

const projectValidation = [
  body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('location')
      .trim()
      .notEmpty().withMessage('Location is required')
      .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
  
  body('start_date')
      .notEmpty().withMessage('Start date is required')
      .isISO8601().withMessage('Start date must be a valid date'),
    
  body('end_date')
      .notEmpty().withMessage('End date is required')
      .isISO8601().withMessage('End date must be a valid date'),
  
    // body('organizationId')
      // .notEmpty().withMessage('Organization is required')
      // .isInt().withMessage('Organization must be a valid integer')
];

// Number of upcoming projects to show
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Controller for the projects page
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

// Process new project form submission
const processNewProjectForm = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-project');
  }

  try {
    const { title, description, location, start_date, end_date, organizationId } = req.body;

    const newProjectId = await createProject(
      title,
      description,
      location,
      start_date,
      end_date,
      organizationId
    );

    req.flash('success', 'New service project created successfully!');
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error('Error creating new project:', error);
    req.flash('error', 'There was an error creating the service project.');
    res.redirect('/new-project');
  }
};

// Controller for the project details page
const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  let isVolunteer = false;

  if (req.session.user) {
      isVolunteer = await hasVolunteered(
          req.session.user.user_id,
          projectId
      );
  }

  res.render('project', {
      title: 'Project Details',
      project,
      user: req.session.user,
      isVolunteer
  });
};

// show edit project form
const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const project = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();

  const title = 'Edit Service Project';

  res.render('update-project', { title, project, organizations });
};

// process form submission for editing project

const processEditProjectForm = async (req, res) => {
  const projectId = req.params.id;

  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-project/${projectId}`);
  }

  const { title, description, start_date, end_date, location, organization_id } = req.body;

  await updateProject(
    projectId,
    title,
    description,
    start_date,
    end_date,
    location,
    organization_id
  );

  req.flash('success', 'Project updated successfully.');
  res.redirect(`/project/${projectId}`);
};

// show aassign categories

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.id; // URL parameter

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);

  res.render('assign-categories', { projectDetails, categories, assignedCategories, projectId });
};

//process assign categories
const assignCategoriesToProject = async (req, res) => {
  const projectId = req.params.id;
  const { categoryIds } = req.body;

  // Ensure it's always an array
  const selectedCategories = categoryIds ? (Array.isArray(categoryIds) ? categoryIds : [categoryIds]) : [];

  try {
    await updateProjectCategories(projectId, selectedCategories);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Error updating categories:', error);
    req.flash('error', 'Failed to update categories.');
    res.redirect(`/assign-categories/${projectId}`);
  }
};

// volunteer controllers

const volunteerForProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.session.user.user_id;

  try {
      await addVolunteer(userId, projectId);
      req.flash('success', 'You are now volunteering for this project.');
      res.redirect(`/project/${projectId}`);
  } catch (error) {
      console.error(error);
      req.flash('error', 'Could not join project.');
      res.redirect(`/project/${projectId}`);
  }
};

const unvolunteerFromProject = async (req, res) => {
  const projectId = req.params.id;
  const userId = req.session.user.user_id;

  try {
      await removeVolunteer(userId, projectId);
      req.flash('success', 'You have left the project.');
      res.redirect(`/project/${projectId}`);
  } catch (error) {
      console.error(error);
      req.flash('error', 'Could not remove volunteer.');
      res.redirect(`/project/${projectId}`);
  }
};

// Export controllers
export { 
        showProjectsPage, 
        showProjectDetailsPage, 
        showNewProjectForm,
        processNewProjectForm,
        projectValidation,
        showEditProjectForm,
        processEditProjectForm,
        showAssignCategoriesForm,
        assignCategoriesToProject,
        volunteerForProject,
        unvolunteerFromProject
    };