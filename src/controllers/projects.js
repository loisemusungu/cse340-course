// Import any needed model functions
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    getAllOrganizations
} from '../models/projects.js';

// Number of upcoming projects to show
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Controller for the projects page
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

// Process new project form submission
const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

// Controller for the project details page
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const title = 'Project Details';

    res.render('project', { title, project });
};

// Export controllers
export { 
        showProjectsPage, 
        showProjectDetailsPage, 
        showNewProjectForm,
        processNewProjectForm
    };