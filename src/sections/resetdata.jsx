import { v4 as uuidv4 } from 'uuid';

export const resetData = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    summary: '',
    educations: {
      institutions: [
        {
          id: uuidv4(),
          institution: '',
          program: '',
          startDate: '',
          endDate: '',
        },
      ],
    },
    experiences: {
      jobs: [
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
    skills: {
      skill: [
        {
          id: uuidv4(),
          skll: '',
        },
      ],
    },
    projects: {
      project: [
        {
          id: uuidv4(),
          projname: '',
          description: [],
        },
      ],
    },
  };

