import db from './db.js';

// Get all categories
const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category
    ORDER BY name;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Get single category with its projects
const getCategoryDetails = async (categoryId) => {
  // Get category info
  const categoryQuery = `
    SELECT category_id, name
    FROM category
    WHERE category_id = $1;
  `;
  const categoryResult = await db.query(categoryQuery, [categoryId]);
  const category = categoryResult.rows[0];

  // Get projects for this category
  const projectsQuery = `
    SELECT sp.project_id, sp.title, sp.description, sp.start_date, sp.end_date, sp.location, o.organization_id, o.name AS organization_name
    FROM service_project sp
    JOIN project_category pc ON sp.project_id = pc.project_id
    JOIN category c ON pc.category_id = c.category_id
    JOIN organization o ON sp.organization_id = o.organization_id
    WHERE c.category_id = $1
    ORDER BY sp.start_date ASC;
  `;
  const projectsResult = await db.query(projectsQuery, [categoryId]);
  category.projects = projectsResult.rows;

  return category;
};

export { getAllCategories, getCategoryDetails };