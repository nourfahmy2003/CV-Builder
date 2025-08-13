import AiSuggestions from './AiSuggestions';
import { v4 as uuidv4 } from 'uuid';

function ResumeImprover({ resumeData, setData }) {
  const handleSuggestionReceived = (suggestion) => {
    if (suggestion.type === 'add') {
      if (suggestion.section === 'experiences') {
        setData(prev => ({
          ...prev,
          experiences: {
            ...prev.experiences,
            jobs: prev.experiences.jobs.map(job =>
              job.id === suggestion.id
                ? { ...job, description: [...job.description, suggestion.new] }
                : job
            ),
          },
        }));
      } else if (suggestion.section === 'projects') {
        setData(prev => ({
          ...prev,
          projects: {
            ...prev.projects,
            project: prev.projects.project.map(proj =>
              proj.id === suggestion.id
                ? { ...proj, description: [...proj.description, suggestion.new] }
                : proj
            ),
          },
        }));
      } else if (suggestion.section === 'skills') {
        setData(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            skill: [...prev.skills.skill, { id: uuidv4(), skll: suggestion.new }],
          },
        }));
      }
    } else if (suggestion.type === 'replace') {
      if (suggestion.section === 'experiences') {
        setData(prev => ({
          ...prev,
          experiences: {
            ...prev.experiences,
            jobs: prev.experiences.jobs.map(job =>
              job.id === suggestion.id
                ? {
                    ...job,
                    description: job.description.map(desc =>
                      desc === suggestion.old ? suggestion.new : desc
                    ),
                  }
                : job
            ),
          },
        }));
      } else if (suggestion.section === 'projects') {
        setData(prev => ({
          ...prev,
          projects: {
            ...prev.projects,
            project: prev.projects.project.map(proj =>
              proj.id === suggestion.id
                ? {
                    ...proj,
                    description: proj.description.map(desc =>
                      desc === suggestion.old ? suggestion.new : desc
                    ),
                  }
                : proj
            ),
          },
        }));
      } else if (suggestion.section === 'skills') {
        setData(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            skill: prev.skills.skill.map(s =>
              s.skll === suggestion.old ? { ...s, skll: suggestion.new } : s
            ),
          },
        }));
      }
    }
  };

  return (
    <div className="card">
      <h3>Improve Your Resume</h3>
      <p className="hint">
        Our AI assistant can analyze your resume content and provide tailored suggestions 
        to improve your bullet points and recommend relevant skills.
      </p>
      
      <AiSuggestions 
        resumeData={resumeData} 
        onSuggestionReceived={handleSuggestionReceived} 
      />
    </div>
  );
}

export default ResumeImprover;