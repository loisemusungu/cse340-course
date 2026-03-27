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

// Create a new category
const createCategory = async (name) => {
  const query = `
    INSERT INTO category (name)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await db.query(query, [name]);
  return result.rows[0];
};

// Update an existing category
const updateCategory = async (id, name) => {
  const query = `
    UPDATE category
    SET name = $1
    WHERE category_id = $2
    RETURNING *;
  `;
  const result = await db.query(query, [name, id]);
  return result.rows[0];
};

// Insert one category assignment into the join table
async function assignCategoryToProject(projectId, categoryId) {
  const query = `
    INSERT INTO project_category (project_id, category_id)
    VALUES ($1, $2);
  `;
  await db.query(query, [projectId, categoryId]);
}

// Update category assignments for a project
const updateCategoryAssignments = async (projectId, categoryIds) => {
  await db.query(`DELETE FROM project_category WHERE project_id = $1`, [projectId]);

  if (Array.isArray(categoryIds)) {
    for (const categoryId of categoryIds) {
      await assignCategoryToProject(projectId, categoryId);
    }
  }
};

// Get categories assigned to a specific project
const getCategoriesByServiceProjectId = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM category c
    JOIN project_category pc ON c.category_id = pc.category_id
    WHERE pc.project_id = $1;
  `;
  const result = await db.query(query, [projectId]);
  return result.rows;
};

export {
  getAllCategories,
  getCategoryDetails,
  updateCategoryAssignments,
  getCategoriesByServiceProjectId,
  createCategory,
  updateCategory
};