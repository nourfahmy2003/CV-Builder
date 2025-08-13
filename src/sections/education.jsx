

function EducationForm({ data, setData, removeEducation }) {
  const handleducationChange = (index, field, value) => {
    const newEduc = [...data.educations.institutions];
    newEduc[index][field] = value;
    setData((prevData) => ({
      ...prevData,
      educations: {
        ...prevData.educations,
        institutions: newEduc,
      },
    }));
  };

  return (
    <div>

      {data.educations.institutions.map((val, index) => (
        <div key={val.id}>
          <h4>
            {val.institution ? `${val.institution}` : `Education ${index + 1}`}
            <button
              type="button"
              className="delete-btn"
              onClick={() => removeEducation(val.id)}
              data-tooltip={`Remove ${val.institution ? `${val.institution}` : `Education ${index + 1}`}`}
            >×</button>
          </h4>
          <div className="input-group">
            <label className='program'>
              Program:
              <input
                type="text"
                value={val.program}
                onChange={(e) => handleducationChange(index, 'program', e.target.value)}
              />
            </label>
          </div>
          <div className="input-group">
            <label className='insti'>
              Institution:
              <input
                type="text"
                value={val.institution}
                onChange={(e) => handleducationChange(index, 'institution', e.target.value)}
              />
            </label>
          </div>
          <div className="dates-group">
            <label className='startdate'>
              Start Date:
              <input
                type="text"
                value={val.startDate}
                onChange={(e) => handleducationChange(index, 'startDate', e.target.value)}
              />
            </label>
            <label className='enddate'>
              End Date:
              <input
                type="text"
                value={val.endDate}
                onChange={(e) => handleducationChange(index, 'endDate', e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}

    </div>
  );
}

export default EducationForm;
