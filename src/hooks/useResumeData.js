import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { defaultData } from '../sections/defaultdata';
import { resetData } from '../sections/resetdata';

export const useResumeData = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('resumeData');
    return savedData ? JSON.parse(savedData) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setData(resetData);
    }
  };

  const handleDefault = () => {
    if (window.confirm('Load sample data? This will replace your current content.')) {
      setData(defaultData);
    }
  };

  const addEducation = () => setData((prev) => ({
    ...prev,
    educations: {
      ...prev.educations,
      institutions: [
        ...prev.educations.institutions,
        { id: uuidv4(), institution: '', program: '', startDate: '', endDate: '' },
      ],
    },
  }));

  const removeEducation = (id) => setData((prev) => ({
    ...prev,
    educations: {
      ...prev.educations,
      institutions: prev.educations.institutions.filter((i) => i.id !== id),
    },
  }));

  const addExperience = () => setData((prev) => ({
    ...prev,
    experiences: {
      ...prev.experiences,
      jobs: [
        ...prev.experiences.jobs,
        { id: uuidv4(), company: '', title: '', location: '', startDate: '', endDate: '', description: [] },
      ],
    },
  }));

  const removeExperience = (id) => setData((prev) => ({
    ...prev,
    experiences: {
      ...prev.experiences,
      jobs: prev.experiences.jobs.filter((j) => j.id !== id),
    },
  }));

  const addSkill = () => setData((prev) => ({
    ...prev,
    skills: {
      ...prev.skills,
      skill: [...prev.skills.skill, { id: uuidv4(), skll: '' }],
    },
  }));

  const removeSkill = (id) => setData((prev) => ({
    ...prev,
    skills: {
      ...prev.skills,
      skill: prev.skills.skill.filter((s) => s.id !== id),
    },
  }));

  const addProject = () => setData((prev) => ({
    ...prev,
    projects: {
      ...prev.projects,
      project: [...prev.projects.project, { id: uuidv4(), projname: '', description: [] }],
    },
  }));

  const removeProject = (id) => setData((prev) => ({
    ...prev,
    projects: {
      ...prev.projects,
      project: prev.projects.project.filter((p) => p.id !== id),
    },
  }));

  return {
    data,
    setData,
    handleChange,
    handleReset,
    handleDefault,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
  };
};