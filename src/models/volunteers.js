import db from './db.js'

const addVolunteer = async (userId, projectId) => {
    const sql = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    return db.query(sql, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const sql = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    return db.query(sql, [userId, projectId]);
};

const getUserVolunteerProjects = async (userId) => {
    const sql = `
        SELECT sp.project_id, sp.title, sp.description
        FROM project_volunteers pv
        JOIN service_project sp ON pv.project_id = sp.project_id
        WHERE pv.user_id = $1;
    `;
    const result = await db.query(sql, [userId]);
    return result.rows;
};

const hasVolunteered = async (userId, projectId) => {
    const sql = `
        SELECT 1 FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(sql, [userId, projectId]);
    return result.rows.length > 0;
};

export { 
        addVolunteer, 
        removeVolunteer, 
        getUserVolunteerProjects, 
        hasVolunteered 
        };