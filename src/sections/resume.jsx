import React from 'react';
import './resume.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLink, faL } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';



function Resume({ data }) {
  const hasExperiences = data.experiences.jobs.length > 0;
  const hasEducation = data.educations.institutions.length > 0;
  const hasProjects = data.projects.project.length > 0;
  const hasSkills = data.skills.skill.length > 0;

  return (
    <>
      <div className='top'>
        <p className='Name'>
          {data.firstname} {data.lastname}
        </p>
        <div className='contact-info'>
          <span>{data.location}</span>
          <span> | </span>
          <span>{data.phone}</span>
          <span> | </span>
          <a href={`mailto:${data.email}`}>{data.email}</a>
          {data.showWebsite && data.website && (
            <>
              <span> | </span>
              <a href={data.website}>{data.website}</a>
            </>
          )}
          <span> | </span>
          <a href={data.linkedin}>{data.linkedin}</a>
          {data.showGithub && data.github && (
            <>
              <span> | </span>
              <a href={data.github}>{data.github}</a>
            </>
          )}
        </div>
      </div>

      {data.showSummary && data.summary && (
        <div className='section'>
          <h3 className='section-title'>SUMMARY</h3>
          <p>{data.summary}</p>
        </div>
      )}

      {hasEducation && (
        <div className='section'>
          <h3 className='section-title'>EDUCATION</h3>
          {data.educations.institutions.map((educ) => (
            <div key={educ.id} className='education-item'>
              <div className='education-header'>
                <span className='institution'>{educ.institution}</span>
                {data.showGpa && <span className='gpa'>GPA: {educ.gpa}</span>}
              </div>
              <div className='education-details'>
                <span className='program'>{educ.program}</span>
                <span className='date'>{educ.endDate}</span>
              </div>
              <p className='coursework'>Relevant Coursework: {educ.coursework}</p>
            </div>
          ))}
        </div>
      )}

      {hasSkills && (
        <div className='section'>
          <h3 className='section-title'>SKILLS</h3>
          <div className='skills-list'>
            {data.skills.skill.map((skll) => (
              <p key={skll.id} className='skill-item'>▪ {skll.skll}</p>
            ))}
          </div>
        </div>
      )}

      {hasExperiences && (
        <div className='section'>
          <h3 className='section-title'>PROFESSIONAL EXPERIENCE</h3>
          {data.experiences.jobs.map((job) => (
            <div key={job.id} className='experience-item'>
              <div className='experience-header'>
                <span className='company'>{job.company}</span>
                <span className='location'>{job.location}</span>
              </div>
              <div className='experience-details'>
                <span className='title'>{job.title}</span>
                <span className='date'>{job.startDate} - {job.endDate}</span>
              </div>
              <ul className='job-description'>
                {job.description.map((desc, index) => (
                  <li key={index}>▪ {desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {hasProjects && (
        <div className='section'>
          <h3 className='section-title'>PROJECTS</h3>
          {data.projects.project.map((proj) => (
            <div key={proj.id} className='project-item'>
              <div className='project-header'>
                <span className='project-name'>{proj.projname}</span>
                <span className='location'>{proj.location}</span>
              </div>
              <div className='project-details'>
                <span className='project-type'>Project</span>
                <span className='date'>{proj.date}</span>
              </div>
              <ul className='project-description'>
                {proj.description.map((desc, index) => (
                  <li key={index}>▪ {desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Resume;
