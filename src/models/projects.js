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
      project_id,
      organization_id,
      title,
      description,
      location,
      date
    FROM project
    WHERE organization_id = $1
    ORDER BY date;
  `;
  
  const query_params = [organizationId];
  const result = await db.query(query, query_params);

  return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };