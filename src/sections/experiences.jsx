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
          <h4 style={{ color: 'black' }}>Experience {index + 1}</h4>
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
          <label className='desc'>
            Descriptions:
            {job.description.map((desc, descIndex) => (
              <input
                key={descIndex}
                type='text'
                value={desc}
                onChange={(e) => {
                  const newJobs = [...data.experiences.jobs];
                  newJobs[index].description[descIndex] = e.target.value;
                  setData((prevData) => ({
                    ...prevData,
                    experiences: {
                      ...prevData.experiences,
                      jobs: newJobs,
                    },
                  }));
                }}
              />
            ))}
          </label>
          <button type="button" onClick={() => addDescription(index)}>
            Add Description
          </button>
          <button type="button" onClick={() => removeExperience(job.id)}>
            Remove
          </button>
        </div>
      ))}
      
    </div>
  );
}

export default ExperienceForm;
