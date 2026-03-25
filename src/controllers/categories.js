import {
        getAllCategories, 
        getCategoryDetails, 
        getCategoriesByServiceProjectId, 
        updateCategoryAssignments 
      } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';


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


export {
        showCategoriesPage, 
        showCategoryDetailsPage,
        showAssignCategoriesForm,
        processAssignCategoriesForm
      };