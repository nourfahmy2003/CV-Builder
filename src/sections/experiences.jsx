import React from 'react';


function ExperienceForm({ data, setData, removeExperience }) {
  const handleExperienceChange = (index, field, value) => {
    const newJobs = [...data.experiences.jobs];
    newJobs[index][field] = value;
    setData((prevData) => ({
      ...prevData,
      experiences: {
        ...prevData.experiences,
        jobs: newJobs,
      },
    }));
  };
  const addDescription = (index) => {
    const newJobs = [...data.experiences.jobs];
    newJobs[index].description.push(''); // Add an empty item
    setData((prevData) => ({
      ...prevData,
      experiences: {
        ...prevData.experiences,
        jobs: newJobs,
      },
    }));
  };
  return (
    <div>
      {data.experiences.jobs.map((job, index) => (
        <div key={job.id}>
          <h4>
            {job.title ? job.title + ' - ' + job.company : `Experience ${index + 1}`}
            <button
              type="button"
              className="delete-btn"
              onClick={() => removeExperience(job.id)}
              data-tooltip={`Remove  ${job.title ? job.title : `Experience ${index + 1}`}`}
            >×</button>
          </h4>
          <label className='title'>
            Job Title:
            <input
              type="text"
              value={job.title}
              onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
            />
          </label>
          <label className='company'>
            Company:
            <input
              type="text"
              value={job.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
            />
          </label>
          <label className='location'>
            Location:
            <input
              type="text"
              value={job.location}
              onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
            />
          </label>
          <label className='startdate'>
            Start Date:
            <input
              type="text"
              value={job.startDate}
              onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
            />
          </label>
          <label className='enddate'>
            End Date:
            <input
              type="text"
              value={job.endDate}
              onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
            />
          </label>
          <label className='projectdescription'>
            Descriptions:
            <div className="description-list">
              {job.description.map((desc, descIndex) => (
                <div key={descIndex} className="description-item">
                  <textarea
                    value={desc}
                    placeholder="Add a bullet point description"
                    rows={1}
                    onChange={(e) => {
                      // Update content
                      const newJobs = [...data.experiences.jobs];
                      newJobs[index].description[descIndex] = e.target.value;
                      setData((prevData) => ({
                        ...prevData,
                        experiences: {
                          ...prevData.experiences,
                          jobs: newJobs,
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
                      const newJobs = [...data.experiences.jobs];
                      newJobs[index].description.splice(descIndex, 1);
                      setData((prevData) => ({
                        ...prevData,
                        experiences: {
                          ...prevData.experiences,
                          jobs: newJobs,
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

export default ExperienceForm;
