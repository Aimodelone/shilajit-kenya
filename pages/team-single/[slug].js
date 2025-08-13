import React, { Fragment } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Scrollbar from '../../components/scrollbar/scrollbar';
import { useRouter } from 'next/router';
import Footer from '../../components/footer/Footer';
import Teams from '../../api/team';
import Image from 'next/image';

const TeamSinglePage = () => {
  const router = useRouter();
  const TeamDetails = Teams.find(item => item.slug === router.query.slug);

  if (!TeamDetails) return null;

  const SubmitHandler = (e) => e.preventDefault();

  return (
    <Fragment>
      <Navbar2 />
      <PageTitle pageTitle={TeamDetails.name} pagesub={TeamDetails.title} />

      <div className="team-pg-area section-padding">
        <div className="container">
          <div className="team-single-wrap">

            {/* Team Info */}
            <div className="team-info-wrap">
              <div className="row align-items-center">
                <div className="col-lg-5">
                  <div className="team-info-img">
                    <Image src={TeamDetails.tSImg} alt={TeamDetails.name} />
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="team-info-text">
                    <h2>{TeamDetails.name}</h2>
                    <ul>
                      <li>Position: <span>{TeamDetails.title}</span></li>
                      <li>Experience: <span>{TeamDetails.experience}</span></li>
                      <li>Address: <span>{TeamDetails.address}</span></li>
                      <li>Phone: <span>{TeamDetails.phone}</span></li>
                      <li>Email: <span>{TeamDetails.email}</span></li>
                    </ul>

                    {/* Certificates */}
                    <div className="certificates-wrap">
                      <h2>Certificates</h2>
                      <div className="certificates-items">
                        {TeamDetails.certificates.map((crt, i) => (
                          <div className="certificates-item" key={i}>
                            <Image src={crt} alt="Certificate" width={200} height={150} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience and Education */}
            <div className="team-exprience-area team-widget">
              <div className="row">
                <div className="col-lg-6">
                  <div className="exprience-wrap">
                    <h2>Personal Experience</h2>
                    {TeamDetails.experienceDescription.map((exp, i) => (
                      <p key={i}>{exp}</p>
                    ))}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="education-area">
                    <h2>Education</h2>
                    <ul>
                      {TeamDetails.education.map((edu, i) => (
                        <li key={i}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Skills and Achievements */}
              <div className="skills-area">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="exprience-wrap">
                      <h2>Skills</h2>
                      <div className="wpo-skill-section">
                        <div className="wpo-skill-progress">
                          {TeamDetails.skills.map((skill, i) => (
                            <div className="wpo-progress-single" key={i}>
                              <h5 className="progress-title">{skill.name}</h5>
                              <div className="progress">
                                <div className="progress-bar" role="progressbar" style={{ width: `${skill.value}%` }}></div>
                              </div>
                              <span className="progress-number">{skill.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="education-area ex-wiget">
                      <h2>Achievements</h2>
                      <ul>
                        {TeamDetails.achievements.map((ach, i) => (
                          <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Form */}
            <div className="wpo-contact-area ex-wiget">
              <div className="wpo-contact-title">
                <h2>Make an Appointment</h2>
                <p>Do not put off until tomorrow the problems that need to be solved today, especially if it concerns your life!</p>
              </div>
              <div className="quote-form">
                <form onSubmit={SubmitHandler}>
                  <div className="form-group half-col">
                    <input type="text" className="form-control" placeholder="Name:" name="name" />
                  </div>
                  <div className="form-group half-col">
                    <input type="email" className="form-control" placeholder="Email:" name="email" />
                  </div>
                  <div className="form-group half-col">
                    <input type="text" className="form-control" placeholder="Phone:" name="phone" />
                  </div>
                  <div className="form-group half-col">
                    <select name="subject" className="form-control">
                      <option disabled defaultValue="Subject">Subject</option>
                      {TeamDetails.appointmentSubjects.map((subj, i) => (
                        <option key={i}>{subj}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full-col">
                    <textarea className="form-control" name="note" placeholder="Case Description"></textarea>
                  </div>
                  <div className="form-group full-col text-center">
                    <button className="btn theme-btn" type="submit">Appointment</button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
};

export default TeamSinglePage;
