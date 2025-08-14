import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import './App.css';

// Forms
import ExperienceForm from './sections/experiences';
import EducationForm from './sections/education';
import ResumePreview from './components/ResumePreview';
import SkillForm from './sections/skills';
import ProjectForm from './sections/projects';
import CollapsibleCard from './components/CollapsibleCard';

// UI
import SidebarLayout from './components/SidebarLayout';
import TopBar from './components/TopBar';
import ResumeImprover from './components/ResumeImprover';

// Hooks
import { useResumeData } from './hooks/useResumeData';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
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
    <div className={`app theme-${theme}`}>
      <SidebarLayout
        topbar={
          <TopBar
            onPrint={handlePrint}
            onReset={handleReset}
            onDefault={handleDefault}
            onToggleTheme={toggleTheme}
            theme={theme}
          />
        }
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


          <CollapsibleCard title="Education">
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
            <button type="button" className="btn primary" onClick={addEducation}>
              Add Education
            </button>
          </CollapsibleCard>

          <CollapsibleCard title="Experience">
            <ExperienceForm
              data={data}
              setData={setData}
              removeExperience={removeExperience}
            />
            <button type="button" className="btn primary" onClick={addExperience}>
              Add Experience
            </button>
          </CollapsibleCard>

          <CollapsibleCard title="Skills">
            <SkillForm data={data} setData={setData} removeSkill={removeSkill} />
            <button type="button" className="btn primary" onClick={addSkill}>
              Add Skill
            </button>
          </CollapsibleCard>

          <CollapsibleCard title="Projects">
            <ProjectForm data={data} setData={setData} removeProject={removeProject} />
            <button type="button" className="btn primary" onClick={addProject}>
              Add Project
            </button>
          </CollapsibleCard>

          <ResumeImprover resumeData={data} setData={setData} />
        </>
      }
      preview={<ResumePreview ref={printRef} data={data} />}
    />
    </div>
  );
}

export default App;
