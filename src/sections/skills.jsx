import React from 'react';


function SkillForm({ data, setData, removeSkill }) {
  const handleSkillChange = (index, field, value) => {
    const newSkill = [...data.skills.skill];
    newSkill[index][field] = value;
    setData((prevData) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        skill: newSkill,
      },
    }));
  };

  return (
    <div>
      {data.skills.skill.map((skll, index) => (
        <div key={skll.id}>
        
          <label className='title'>
            Skill {index + 1}:
            <input
              type="text"
              value={skll.skll}
              onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
            />
          </label>
          
          <button type="button" onClick={() => removeSkill(skll.id)}>
            Remove
          </button>
        </div>
      ))}
      
    </div>
  );
}

export default SkillForm;
