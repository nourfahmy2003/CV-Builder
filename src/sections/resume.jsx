import React from 'react';
import './resume.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faLink } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';



function Resume({ data }) {
  const hasExperiences = data.experiences.jobs.length > 0;
  const hasEducation = data.educations.institutions.length > 0;
  const hasProjects = data.projects.project.length > 0;

  return (
    <>
      <div className='top'>
        <p className='Name'>
          {data.firstname} {data.lastname}
        </p>
        <div className='line'>
          <p className='Email'><FontAwesomeIcon icon={faEnvelope}/> {data.email}</p>
          <p className='Phone'><FontAwesomeIcon icon={faPhone}/> {data.phone}</p>
          <p className='LinkedIn'><FontAwesomeIcon icon={faLinkedin}/> {data.linkedin}</p>
        </div>
        <div className='linetwo'>
          <p className='Website'><FontAwesomeIcon icon={faLink}/> {data.website}</p>
          <p className='Github'><FontAwesomeIcon icon={faGithub}/> {data.github}</p>
        </div>
      </div>

      <div className='Summary'>
        <h2>Summary</h2>
        <p >{data.summary}</p>
      </div>

      {hasEducation && (
        <div className='Education'>
          <h3 id='edu'>Education</h3>
          {data.educations.institutions.map((educ) => (
            <div key={educ.id}>
              <p className='eduprogram'>{educ.program}</p>
              <p className='educInst'>{educ.institution}</p>
              <p className='educdate'>
                {educ.startDate} - {educ.endDate}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasExperiences && (
        <div className='Experiences'>
          <h3>Experience</h3>
          {data.experiences.jobs.map((job) => (
            <div key={job.id}>
              <p className='jobTitle'>{job.title}</p>
              <p className='jobsub'>
                {job.company}, {job.location} | {job.startDate} - {job.endDate}
              </p>
              <ul className='jobDesc'>
                {job.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {hasProjects && (
        <div className='Projects'>
          <h3>Projects</h3>
          {data.projects.project.map((proj) => (
            <div key={proj.id} className='proj'>
              <p className='projName'>{proj.projname}</p>
              <ul className='projDesc'>
                {proj.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className='Skills'>
        <h3 id='skll'>Skills</h3>
        {data.skills.skill.map((skll) => (
          <div key={skll.id}>
            <p className='skill'>-{skll.skll}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Resume;
