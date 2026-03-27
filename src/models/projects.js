import db from './db.js';

// Get all projects (no date filter)
const getAllProjects = async () => {
  const query = `
    SELECT project_id, title, description
    FROM service_project
    ORDER BY project_id;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Get projects by organization
const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.start_date
    FROM service_project p
    WHERE p.organization_id = $1
    ORDER BY p.start_date;
  `;
  
  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};

// Get next upcoming projects (always show at least some projects)
const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.start_date,
      p.location,
      o.organization_id,
      o.name AS organization_name
    FROM service_project p
    JOIN organization o ON p.organization_id = o.organization_id
    ORDER BY p.start_date ASC
    LIMIT $1;
  `;

  const params = [number_of_projects];
  const result = await db.query(query, params);

  return result.rows;
};

// Get details for a single project
const getProjectDetails = async (id) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.start_date,
      p.location,
      o.organization_id,
      o.name AS organization_name
    FROM service_project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1;
  `;

  const params = [id];
  const result = await db.query(query, params);

  return result.rows[0]; // return a single project object
};

// Create a new service project
const createProject = async (title, description, location, startDate, endDate, organizationId) => {
  const query = `
    INSERT INTO service_project (title, description, location, start_date, end_date, organization_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING project_id;
  `;

  const query_params = [title, description, location, startDate, endDate, organizationId];
  const result = await db.query(query, query_params);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

// update project details (admin only)
const updateProject = async (projectId, title, description, startDate, endDate, location, organizationId) => {
  const query = `
    UPDATE service_project
    SET title = $1,
        description = $2,
        start_date = $3,
        end_date = $4,
        location = $5,
        organization_id = $6
    WHERE project_id = $7
    RETURNING *;
  `;

  const result = await db.query(query, [
    title,
    description,
    startDate,
    endDate,
    location,
    organizationId,
    projectId
  ]);

  return result.rows[0];
};

// Export the model functions
export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject
};