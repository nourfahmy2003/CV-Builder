import React from 'react';

function ProjectForm({ data, setData, removeProject }) {
  const handleProjectChange = (index, field, value) => {
    const newProject = [...data.projects.project];
    newProject[index][field] = value;
    setData((prevData) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        project: newProject,
      },
    }));
  };

  const addDescription = (index) => {
    const newProjects = [...data.projects.project];
    newProjects[index].description.push(''); // Add empty description
    setData((prevData) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        project: newProjects,
      },
    }));
  };

  return (
    <div>
      {data.projects.project.map((proj, index) => (
        <div key={proj.id}>
          <h4>
            {proj.projname ? proj.projname : `Project ${index + 1}`}
            <button
              type="button"
              className="delete-btn"
              onClick={() => removeProject(proj.id)}
              data-tooltip={`Remove ${proj.projname ? proj.projname : `Project ${index + 1}`}`}
            >×</button>
          </h4>
          <div className="input-group">
            <label className='project'>
              Project Name:
              <input
                type="text"
                value={proj.projname}
                onChange={(e) => handleProjectChange(index, 'projname', e.target.value)}
              />
            </label>
          </div>
          <label className='projectdescription'>
            Project Descriptions:
            <div className="description-list">
              {proj.description.map((desc, descIndex) => (
                <div key={descIndex} className="description-item">
                  <textarea
                    value={desc}
                    placeholder="Add a bullet point description"
                    rows={1}
                    onChange={(e) => {
                      // Update content
                      const newProjects = [...data.projects.project];
                      newProjects[index].description[descIndex] = e.target.value;
                      setData((prevData) => ({
                        ...prevData,
                        projects: {
                          ...prevData.projects,
                          project: newProjects,
                        },
                      }));
                      
                      // Auto-adjust height
                      e.target.style.height = '0';
                      const scrollHeight = e.target.scrollHeight;
                      e.target.style.height = scrollHeight + 'px';
                    }}
                    onFocus={(e) => {
                      setTimeout(() => {
                        e.target.style.height = '0';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }, 0);
                    }}
                  />
                  <button 
                    type="button" 
                    className="bullet-delete"
                    onClick={() => {
                      const newProjects = [...data.projects.project];
                      newProjects[index].description.splice(descIndex, 1);
                      setData((prevData) => ({
                        ...prevData,
                        projects: {
                          ...prevData.projects,
                          project: newProjects,
                        },
                      }));
                    }}
                    title="Remove this description"
                  >×</button>
                </div>
              ))}
            </div>
          </label>
          <button 
            type="button" 
            className="add-bullet-btn" 
            onClick={() => addDescription(index)}
            data-tooltip="Add a new bullet point description"
          >
            + Add Description Bullet Point
          </button>
          
        </div>
      ))}
    </div>
  );
}

export default ProjectForm;
