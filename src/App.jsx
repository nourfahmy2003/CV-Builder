import { useState,useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import ExperienceForm from './sections/experiences';
import EducationForm from './sections/education';
import Resume from './sections/resume';
import SkillForm from './sections/skills';
import ProjectForm from './sections/projects';
import { resetData } from './sections/resetdata';
import { defaultData } from './sections/defaultdata';
import AISuggestions from './sections/AISuggestions';



function App() {
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('resumeData')) || {
    firstname: 'Noureldeen',
    lastname: 'Fahmy',
    email: 'nourfahmy2003@gmail.com',
    phone: '709-771-9840',
    website: 'https://nourfahmy2003.github.io/Resume.github.io/',
    github: 'github.com/nourfahmy2003',
    linkedin: 'www.linkedin.com/in/nefahmy/',
    summary: `Highly-motivated employee with desire to take on new challenges. 
    Strong work ethic, adaptability and exceptionalinterpersonal skills.
    I am driven by a passion for problem-solving and innovation. 
    I thrive in an ever-evolving environment, andmy adaptability allows me to quickly grasp new concepts and technologies.`,
    educations: {
      institutions: [
        {
          id: uuidv4(),
          institution: 'Memorial University of Newfoundland',
          program: 'Computer Science',
          startDate: 'September 2021',
          endDate: 'Present',
        },
      ],
    },
    experiences: {
      jobs: [
        {
          id: uuidv4(),
          company: 'Union Group FZCO',
          title: 'Data Science Intern',
          location: 'Dubai, UAE',
          startDate: 'April 2023',
          endDate: 'August 2023',
          description: ['Cleaned and manipulated raw data through Python',
            'Recommended data analysis tools to address business issues',
            'Searched for a perfect match of web developers to help aid in their web app program',],
        },
        {
          id: uuidv4(),
          company: 'Hoopoe Digital',
          title: 'Full stack Intern',
          location: 'Cairo, Egypt',
          startDate: 'July 2022 ',
          endDate: 'October 2022',
          description: ['Did data analyzing and presentation through Python',
          'Developed some backend for web app using Javascript',
          'Overall gained many new terminology in the industry of computer science'],
        },
        {
          id: uuidv4(),
          company: 'Union Group',
          title: 'Data Science Intern',
          location: 'Cairo, Egypt',
          startDate: 'April 2022',
          endDate: 'July 2022',
          description: ['Cleaned and manipulated raw data through the use ofSQL',
          'Created graphs and charts detailing data analysis results by using SQL',
          'Used statistical software to analyze and process large data sets'],
        }
      ],
    },
    skills: {
      skill: [
        {
          id: uuidv4(),
          skll: 'Basic programming skills in Python, Java,JavaScript, SQL, and HTML',
        },
        {
          id: uuidv4(),
          skll: 'Data management',
        },
        {
          id: uuidv4(),
          skll: 'Analytical thinking',
        },
        {
          id: uuidv4(),
          skll: 'Friendly, positive attitude',
        },
        {
          id: uuidv4(),
          skll: 'Microsoft tools',
        },
        {
          id: uuidv4(),
          skll: 'Time management',
        },
        {
          id: uuidv4(),
          skll: 'Research skills',
        },
        {
          id: uuidv4(),
          skll: 'Effective communication, teamwork',
        },
        {
          id: uuidv4(),
          skll: 'Adaptability, Integrity, Dependability',
        },
      ],
    },
    projects: {
      project: [
        {
          id: uuidv4(),
          projname: 'Stock Game',
          description: ['I used nodejs and mongodb for creating the code for this game', ''],
        },
      ],
    },
  });

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(data));
  }, [data]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const printRef = useRef();
  const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle: 'Resume',
      
    });    
 


  const addEducation = () => {
    setData((prevData) => ({
      ...prevData,
      educations: {
        ...prevData.educations,
        institutions: [
          ...prevData.educations.institutions,
          {
            id: uuidv4(),
            institution: '',
            program: '',
            startDate: '',
            endDate: '',
          },
        ],
      },
    }));
  };

  const removeEducation = (id) => {
    setData((prevData) => ({
      ...prevData,
      educations: {
        ...prevData.educations,
        institutions: prevData.educations.institutions.filter((institutions) => institutions.id !== id),
      },
    }));
  };

  const addExperience = () => {
    setData((prevData) => ({
      ...prevData,
      experiences: {
        ...prevData.experiences,
        jobs: [
          ...prevData.experiences.jobs,
          {
            id: uuidv4(), 
            company: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            description: [],
          },
        ],
      },
    }));
  };

  const removeExperience = (id) => {
    setData((prevData) => ({
      ...prevData,
      experiences: {
        ...prevData.experiences,
        jobs: prevData.experiences.jobs.filter((job) => job.id !== id),
      },
    }));
  };
  
  const addSkill = () => {
    setData((prevData) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        skill: [
          ...prevData.skills.skill,
          {
            id: uuidv4(), 
            skll:''
          },
        ],
      },
    }));
  };

  const removeSkill = (id) => {
    setData((prevData) => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        skill: prevData.skills.skill.filter((skll) => skll.id !== id),
      },
    }));
  };

  const addProject = () => {
    setData((prevData) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        project: [
          ...prevData.projects.project,
          {
            id: uuidv4(), 
            projname:'',
            description:[]
          },
        ],
      },
    }));
  };

  const removeProject = (id) => {
    setData((prevData) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        project: prevData.projects.project.filter((proj) => proj.id !== id),
      },
    }));
  };

  const resetForm = () => {
    console.log('Resetting data');
    setData(resetData); // Reset data to its initial empty state
  };

  const defaultForm = () => {
    setData(defaultData);
  };


  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      setData(JSON.parse(savedData)); // This might be causing the state reversion
    }
  }, []);

  return (
    <>
    <div className="flex-container">
      <div className="Forms">
        <form>
          {/* Place the print button at the top right */}
          <div className="print-button-container">
            <button className="print-button" onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} />
            </button>

            <button
              className="reset-button"
              onClick={() => {
                 // Check if the click is detected
                resetForm();
              }}
            >
              Reset Data
            </button>

            <button
              className="default-button"
              onClick={() => {
                
                defaultForm();
              }}
            >
              Default Data
            </button>
            

          </div>
          <label className='firstname'>
            First Name:
            <input
              type="text"
              name="firstname"
              value={data.firstname}
              onChange={handleChange}
            />
          </label>
          <label className='lastname'>
            Last Name:
            <input
              type="text"
              name="lastname"
              value={data.lastname}
              onChange={handleChange}
            />
          </label>
          <label className='email'>
            Email:
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </label>
          <label className='number'>
            Phone number:
            <input
              type="tel"
              name="phone"
              value={data.phone}
              onChange={handleChange}
            />
          </label>
          <label className='linkedin'>
            Linkdin:
            <input
              type="text"
              name="linkedin"
              value={data.linkedin}
              onChange={handleChange}
            />
          </label>
          <label className='website'>
            Website:
            <input
              type="text"
              name="website"
              value={data.website}
              onChange={handleChange}
            />
            <label className='github'>
            Github:
            <input
              type="text"
              name="github"
              value={data.github}
              onChange={handleChange}
            />
          </label>
          </label>
          <label className="summary">
            Summary:
            <textarea
              name="summary"
              id="summary"
              value={data.summary}
              onChange={handleChange}
              rows={4}
              className="textarea" // Apply the CSS class
            />
          </label>

          <EducationForm data={data} setData={setData} removeEducation={removeEducation}/>
          <button type="button" onClick={addEducation}>
            Add Education
          </button>

          <ExperienceForm data={data} setData={setData} removeExperience={removeExperience}/>
          <button type="button" onClick={addExperience}>
            Add Experience
          </button>

          <SkillForm data={data} setData={setData} removeSkill={removeSkill}/>
          <button type="button" onClick={addSkill}>
            Add Skill
          </button>

          <ProjectForm data={data} setData={setData} removeProject={removeProject}/>
          <button type="button" onClick={addProject}>
            Add Project
          </button>
        </form>
      </div>

     
      <div className="Resume" ref={printRef}>
        <Resume data={data} />
      </div>
      <AISuggestions data={data} />
    </div>
    </>
  );
}

export default App;
