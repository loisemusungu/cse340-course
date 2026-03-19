import db from './db.js';

const getAllProjects = async () => {
  const query = `
    SELECT project_id, title, description
    FROM service_project
    ORDER BY project_id;
  `;
  const result = await db.query(query);
  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      p.project_id,
      p.organization_id,
      p.title,
      p.description,
      p.location,
      p.date
    FROM service_project p
    WHERE p.organization_id = $1
    ORDER BY p.date;
  `;
  
  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};

// ⭐ New function to get next upcoming projects
const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      o.organization_id,
      o.name AS organization_name
    FROM service_project p
    JOIN organization o ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const params = [number_of_projects];
  const result = await db.query(query, params);

  return result.rows;
};

const getProjectDetails = async (id) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
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

// Export the model functions
export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails
};