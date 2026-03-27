import {
        getAllCategories, 
        getCategoryDetails, 
        getCategoriesByServiceProjectId, 
        updateCategoryAssignments,
        createCategory,
        updateCategory 
      } from '../models/categories.js';

import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation for creating/editing categories
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

// List all categories
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Service Categories';
  res.render('categories', { title, categories });
};

// Show single category and its projects
const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategoryDetails(categoryId);
  const title = `Category: ${category.name}`;
  res.render('category', { title, category });
};

// Show form to assign categories to a project
const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);

  const title = 'Assign Categories to Project';

  res.render('assign-categories', {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories
  });
};

// Handle form submission for assigning categories
const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categories || [];

  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];

  await updateCategoryAssignments(projectId, categoryIdsArray);

  req.flash('success', 'Categories updated successfully');
  res.redirect(`/project/${projectId}`);
};

// Show form to create a new category
const showNewCategoryForm = (req, res) => {
  const title = 'Add New Category';
  res.render('new-category', { title });
};

// Handle new category form submission
const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect('/new-category');
  }

  const { name } = req.body;

  try {
    const newCategory = await createCategory(name);
    req.flash('success', 'New category created successfully!');
    res.redirect(`/category/${newCategory.category_id}`);
  } catch (error) {
    console.error('Error creating category:', error);
    req.flash('error', 'Failed to create category.');
    res.redirect('/new-category');
  }
};

// Show form to edit an existing category
const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const category = await getCategoryDetails(categoryId);
  const allCategories = await getAllCategories(); // fetch all categories
  const title = 'Edit Category';
  res.render('edit-category', { title, category, allCategories });
};

// Handle edit category form submission
const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-category/${categoryId}`);
  }

  const { name } = req.body; // Make sure this matches your form input "name"

  try {
    const updated = await updateCategory(categoryId, name);
    if (!updated) throw new Error('Category not found or update failed');

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error('Error updating category:', error);
    req.flash('error', 'Failed to update category.');
    res.redirect(`/edit-category/${categoryId}`);
  }
};

export {
        showCategoriesPage, 
        showCategoryDetailsPage,
        showAssignCategoriesForm,
        processAssignCategoriesForm,
        categoryValidation,
        showNewCategoryForm,
        processNewCategoryForm,
        showEditCategoryForm,
        processEditCategoryForm
      };