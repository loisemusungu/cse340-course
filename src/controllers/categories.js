import { getAllCategories, getCategoryDetails } from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };