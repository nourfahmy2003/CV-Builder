import React from 'react';

function SkillForm({ data, setData, removeSkill }) {
  const handleSkillChange = (index, value) => {
    const next = [...data.skills.skill];
    next[index].skll = value; // ← fix: correct key is skll
    setData((prev) => ({
      ...prev,
      skills: { ...prev.skills, skill: next },
    }));
  };

  return (
    <div>
      {data.skills.skill.map((skll, index) => (
        <div key={skll.id} className="input-group">
          <label>
            Skill {index + 1}
            <input
              type="text"
              value={skll.skll}
              onChange={(e) => handleSkillChange(index, e.target.value)}
            />
          </label>
          <button type="button" className="delete-btn" onClick={() => removeSkill(skll.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

export default SkillForm;