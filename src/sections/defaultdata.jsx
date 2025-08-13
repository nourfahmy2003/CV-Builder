import { v4 as uuidv4 } from 'uuid';

export const defaultData = {
    firstname: 'NOURELDEEN',
    lastname: 'FAHMY',
    location: 'St. Johns’s, NL, Canada',
    phone: '+1 709-764-5946',
    email: 'nourfahmy2003@gmail.com',
    website: 'https://nourfahmy2003.github.io/Resume.github.io/',
    showWebsite: true,
    linkedin: 'http://www.linkedin.com/in/nefahmy/',
    github: 'http://github.com/nourfahmy2003',
    showGithub: true,
    showSummary: true,
    showGpa: true,
    summary: 'A highly motivated and results-oriented Computer Science student with a passion for developing innovative solutions. Experienced in full-stack development, data science, and machine learning. Proven ability to lead teams and deliver high-quality projects on time.',
    educations: {
      institutions: [
        {
          id: uuidv4(),
          institution: 'Memorial University of Newfoundland',
          program: 'Bachelor of Science, Computer Science (Honours)',
          endDate: 'May 2025',
          gpa: '3.6',
          coursework: 'Algorithmic Techniques for AI, Data Prep Techniques, Intro to Data Mining, Web Programming, Software Dev.'
        }
      ],
    },
    skills: {
      skill: [
        { id: uuidv4(), skll: 'Languages: Java, Python, JavaScript, SQL, HTML' },
        { id: uuidv4(), skll: 'Frameworks & Libraries: React, Node.js, MongoDB, Pandas, NumPy' }
      ],
    },
    experiences: {
      jobs: [
        {
          id: uuidv4(),
          company: 'Storelx (https://storelx.com)',
          location: 'NL, Canada',
          title: 'Lead developer',
          startDate: 'January 2023',
          endDate: 'Present',
          description: [
            'Led the development of a P2P storage marketplace platform using Node.js and React, serving 100+ active users.',
            'Designed and implemented a scalable microservices architecture using Express.js, reducing API response time by 40%',
            'Designed and optimized MongoDB schemas, resulting in 30% faster query performance',
            'Led a team of 3 developers using Agile methodology, achieving 95% on-time sprint completion rate'
          ],
        },
        {
          id: uuidv4(),
          company: 'Union Group FZCO',
          location: 'Dubai, UAE',
          title: 'Data Science Intern',
          startDate: 'April 2023',
          endDate: 'August 2023',
          description: [
            'Developed pipelines using Python and Pandas, processing 20k+ daily transactions with 99.9% accuracy',
            'Created predictive models using scikit-learn, achieving 85% accuracy in sales forecasting',
            'Built interactive dashboards using Plotly and Dash, reducing report generation time by 75%'
          ],
        },
        {
          id: uuidv4(),
          company: 'Hoopoe Digital',
          location: 'Cairo, Egypt',
          title: 'Full Stack Intern',
          startDate: 'July 2022',
          endDate: 'October 2022',
          description: [
            'Developed a customer tracking application serving 5+ shopping malls and processing 20K+ daily visitors',
            'Built RESTful APIs using Node.js and Express, handling 1000+ requests per minute with 99.9% uptime',
            'Implemented real-time analytics dashboard using React and D3.js, processing 10k+ daily data points',
            'Contributed to microservices architecture design, improving system scalability by 40%'
          ],
        },
        {
          id: uuidv4(),
          company: 'Union Group',
          location: 'Cairo, Egypt',
          title: 'Data Science Intern',
          startDate: 'April 2022',
          endDate: 'July 2022',
          description: [
            'Analyzed 5+ years of financial data using Python and SQL, identifying patterns that led to 15% cost reduction',
            'Created automated data cleaning pipelines processing 10k+ records daily with 99% accuracy',
            'Developed interactive Power BI dashboards viewed by 50+ stakeholders daily',
            'Implemented statistical analysis methods resulting in 25% more accurate financial forecasting',
            'Documented 20+ technical processes, reducing onboarding time for new team members by 50%'
          ],
        }
      ],
    },
    projects: {
      project: [
        {
          id: uuidv4(),
          projname: 'Memory Game (https://card-memory-game-gold.vercel.app/)',
          location: 'NL, Canada',
          date: 'May 2024',
          description: [
            'Developed an interactive web-based memory game using React and Vite',
            'Implemented game logic and state management using React hooks',
            'Optimized performance and deployed on Vercel with CI/CD pipeline'
          ],
        },
        {
          id: uuidv4(),
          projname: 'CV Maker (https://cv-builder-noureldeen.vercel.app/)',
          location: 'NL, Canada',
          date: 'April 2024',
          description: [
            'Developed a full-stack resume builder with PDF export functionality using react-pdf, supporting multiple template designs',
            'Created drag-and-drop interface using react-beautiful-dnd for section reordering',
            'Achieved 40% faster render time through React optimization techniques',
            'Implemented auto-save feature, preventing data loss and improving user experience'
          ],
        }
      ],
    },
}