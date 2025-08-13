import { v4 as uuidv4 } from 'uuid';

export const defaultData = {
    firstname: 'Alex',
    lastname: 'John',
    email: 'alex.john@email.com',
    phone: '(555) 123-4567',
    website: 'alexjohn.dev',
    showWebsite: true,
    github: 'github.com/alexjohn-dev',
    showGithub: true,
    linkedin: 'linkedin.com/in/alexjohn-dev',
    summary: `Innovative Full Stack Developer with 3+ years of experience building scalable web applications 
    and microservices. Passionate about creating efficient, user-friendly solutions using modern technologies. 
    Proven track record of improving application performance and implementing best practices in software development. 
    Strong collaboration skills and experience working in agile environments.`,
    educations: {
      institutions: [
        {
          id: uuidv4(),
          institution: 'University of Technology',
          program: 'Bachelor of Science in Computer Science',
          startDate: 'September 2019',
          endDate: 'May 2023',
        },
        {
          id: uuidv4(),
          institution: 'Tech Academy Bootcamp',
          program: 'Advanced Web Development',
          startDate: 'June 2022',
          endDate: 'December 2022',
        }
      ],
    },
    experiences: {
      jobs: [
        {
          id: uuidv4(),
          company: 'TechCorp Solutions',
          title: 'Full Stack Developer',
          location: 'San Francisco, CA',
          startDate: 'January 2023',
          endDate: 'Present',
          description: [
            'Led development of a microservices-based e-commerce platform serving 50,000+ daily users',
            'Improved application performance by 40% through implementation of Redis caching and API optimization',
            'Developed and maintained CI/CD pipelines using GitHub Actions, reducing deployment time by 60%',
            'Mentored 3 junior developers and conducted weekly code reviews to ensure code quality'
          ],
        },
        {
          id: uuidv4(),
          company: 'InnovateTech Startup',
          title: 'Frontend Developer',
          location: 'Austin, TX',
          startDate: 'June 2022',
          endDate: 'December 2022',
          description: [
            'Built responsive web applications using React.js and TypeScript, serving 10,000+ users',
            'Implemented state management using Redux, resulting in 30% improved component reusability',
            'Created reusable UI component library reducing development time by 25%',
            'Collaborated with UX team to implement responsive designs and improve user experience'
          ],
        },
        {
          id: uuidv4(),
          company: 'Digital Solutions Inc.',
          title: 'Software Engineering Intern',
          location: 'Seattle, WA',
          startDate: 'May 2021',
          endDate: 'August 2021',
          description: [
            'Developed RESTful APIs using Node.js and Express, handling 1000+ requests per minute',
            'Implemented automated testing using Jest, achieving 90% code coverage',
            'Optimized database queries resulting in 50% faster response times',
            'Participated in daily stand-ups and sprint planning meetings in an agile environment'
          ],
        }
      ],
    },
    skills: {
      skill: [
        {
          id: uuidv4(),
          skll: 'Frontend: React.js, TypeScript, Redux, HTML5/CSS3',
        },
        {
          id: uuidv4(),
          skll: 'Backend: Node.js, Express, Python, Django',
        },
        {
          id: uuidv4(),
          skll: 'Database: MongoDB, PostgreSQL, Redis',
        },
        {
          id: uuidv4(),
          skll: 'Cloud: AWS, Docker, Kubernetes',
        },
        {
          id: uuidv4(),
          skll: 'Testing: Jest, Cypress, PyTest',
        },
        {
          id: uuidv4(),
          skll: 'CI/CD: GitHub Actions, Jenkins',
        },
        {
          id: uuidv4(),
          skll: 'Agile Methodologies & Scrum',
        },
        {
          id: uuidv4(),
          skll: 'Version Control: Git, GitHub',
        }
      ],
    },
    projects: {
      project: [
        {
          id: uuidv4(),
          projname: 'AI-Powered Task Manager',
          description: [
            'Built a full-stack task management application using React, Node.js, and MongoDB',
            'Implemented machine learning algorithms for smart task prioritization',
            'Integrated OpenAI API for automated task categorization and time estimation',
            'Deployed application using Docker and AWS, serving 1000+ active users'
          ],
        },
        {
          id: uuidv4(),
          projname: 'Real-time Collaboration Platform',
          description: [
            'Developed a real-time collaboration tool using Socket.io and React',
            'Implemented WebRTC for peer-to-peer video conferencing',
            'Created a custom state management solution for real-time updates',
            'Achieved 99.9% uptime through robust error handling and fallback mechanisms'
          ],
        },
        {
          id: uuidv4(),
          projname: 'E-commerce Analytics Dashboard',
          description: [
            'Designed and built a real-time analytics dashboard using React and D3.js',
            'Integrated multiple data sources using GraphQL and REST APIs',
            'Implemented responsive visualizations for key business metrics',
            'Reduced data processing time by 60% through efficient caching strategies'
          ],
        }
      ],
    },
}