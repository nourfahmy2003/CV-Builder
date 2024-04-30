import { v4 as uuidv4 } from 'uuid';

export const defaultData = {
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
          description: ['Cleaned and manipulated raw data through Python'
            ,'Recommended data analysis tools to address business issues',
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
}