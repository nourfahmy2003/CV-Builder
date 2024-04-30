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
          <h4 style={{ color: 'black' }}>Project {index + 1}</h4>
          <label className='project'>
            Project Name:
            <input
              type="text"
              value={proj.projname}
              onChange={(e) => handleProjectChange(index, 'projname', e.target.value)}
            />
          </label>
          <label className='projectdescription'>
            Project Descriptions:
            {proj.description.map((desc, descIndex) => (
              <input
                key={descIndex}
                type='text'
                value={desc}
                onChange={(e) => {
                  const newProjects = [...data.projects.project];
                  newProjects[index].description[descIndex] = e.target.value;
                  setData((prevData) => ({
                    ...prevData,
                    projects: {
                      ...prevData.projects,
                      project: newProjects,
                    },
                  }));
                }}
              />
            ))}
          </label>
          <button type="button" onClick={() => addDescription(index)}>
            Add Description
          </button>
          <button type="button" onClick={() => removeProject(proj.id)}>
            Remove Project
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProjectForm;
