// Import any needed model functions
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// Number of upcoming projects to show
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Controller for the projects page
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

// Controller for the project details page
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const title = 'Project Details';

    res.render('project', { title, project });
};

// Export controllers
export { showProjectsPage, showProjectDetailsPage };