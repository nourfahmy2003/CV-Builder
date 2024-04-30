

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
          <h4 style={{ color: 'black' }}>Education {index + 1}</h4>
          <label className='program'>
            Program:
            <input
              type="text"
              value={val.program}
              onChange={(e) => handleducationChange(index, 'program', e.target.value)}
            />
          </label>
          <label className='insti'>
            Institution:
            <input
              type="text"
              value={val.institution}
              onChange={(e) => handleducationChange(index, 'institution', e.target.value)}
            />
          </label>
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
          <button type="button" onClick={() => removeEducation(val.id)}>
            Remove
          </button>
        </div>
      ))}
      
    </div>
  );
}

export default EducationForm;
