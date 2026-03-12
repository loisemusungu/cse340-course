-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);
-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO service_project (organization_id, title, description, start_date, end_date)
VALUES
(1, 'Community Park Cleanup', 'Volunteers will clean and refresh the neighborhood park.', '2025-05-10', '2025-05-10'),
(2, 'Urban Garden Build Day', 'Help expand the community garden and plant new crops.', '2025-06-02', '2025-06-02'),
(3, 'Youth Mentoring Workshop', 'Mentor youth and guide them in leadership activities.', '2025-05-20', '2025-05-20');

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

INSERT INTO category (name) VALUES
('Clean Up'),
('Food Drive'),
('Mentoring');

INSERT INTO project_category (project_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 3);

SELECT * FROM service_project;

SELECT * FROM category;

SELECT * FROM project_category;