import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import './App.css';

// Forms
import ExperienceForm from './sections/experiences';
import EducationForm from './sections/education';
import ResumePreview from './components/ResumePreview';
import SkillForm from './sections/skills';
import ProjectForm from './sections/projects';

// UI
import SidebarLayout from './components/SidebarLayout';
import TopBar from './components/TopBar';
import ResumeImprover from './components/ResumeImprover';

// Hooks
import { useResumeData } from './hooks/useResumeData';

function App() {
  const {
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
  } = useResumeData();

  // Print
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Resume',
  });

  return (
    <SidebarLayout
      topbar={<TopBar onPrint={handlePrint} onReset={handleReset} onDefault={handleDefault} />}
      sidebar={
        <>
          <div className="grid grid-2">
            <label>
              First Name
              <input type="text" name="firstname" value={data.firstname} onChange={handleChange} />
            </label>
            <label>
              Last Name
              <input type="text" name="lastname" value={data.lastname} onChange={handleChange} />
            </label>
          </div>

          <div className="grid grid-2">
            <label>
              Email
              <input type="email" name="email" value={data.email} onChange={handleChange} />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" value={data.phone} onChange={handleChange} />
            </label>
          </div>

          <div className="grid grid-2">
            <label>
              LinkedIn
              <input type="text" name="linkedin" value={data.linkedin} onChange={handleChange} />
            </label>
          </div>

          <div className="input-group website-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showWebsite"
                checked={data.showWebsite}
                onChange={handleChange}
              />
              Include Website
            </label>
            {data.showWebsite && (
              <input
                type="text"
                name="website"
                value={data.website}
                onChange={handleChange}
                placeholder="Your website URL"
              />
            )}
          </div>

          <div className="input-group github-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showGithub"
                checked={data.showGithub}
                onChange={handleChange}
              />
              Include GitHub
            </label>
            {data.showGithub && (
              <input
                type="text"
                name="github"
                value={data.github}
                onChange={handleChange}
                placeholder="Your GitHub profile"
              />
            )}
          </div>

          <div className="input-group summary-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showSummary"
                checked={data.showSummary}
                onChange={handleChange}
              />
              Include Summary
            </label>
            {data.showSummary && (
              <textarea
                name="summary"
                value={data.summary}
                onChange={handleChange}
                rows={4}
                placeholder="A brief summary about yourself"
              />
            )}
          </div>


          <div className="card">
            <h3>Education</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="showGpa"
                checked={data.showGpa}
                onChange={handleChange}
              />
              Include GPA
            </label>
            <EducationForm data={data} setData={setData} removeEducation={removeEducation} />
            <button type="button" className="btn" onClick={addEducation}>Add Education</button>
          </div>

          <div className="card">
            <h3>Experience</h3>
            <ExperienceForm data={data} setData={setData} removeExperience={removeExperience} />
            <button type="button" className="btn" onClick={addExperience}>Add Experience</button>
          </div>

          <div className="card">
            <h3>Skills</h3>
            <SkillForm data={data} setData={setData} removeSkill={removeSkill} />
            <button type="button" className="btn" onClick={addSkill}>Add Skill</button>
          </div>

          <div className="card">
            <h3>Projects</h3>
            <ProjectForm data={data} setData={setData} removeProject={removeProject} />
            <button type="button" className="btn" onClick={addProject}>Add Project</button>
          </div>

          <ResumeImprover resumeData={data} setData={setData} />
        </>
      }
      preview={<ResumePreview ref={printRef} data={data} />}
    />
  );
}

export default App;
