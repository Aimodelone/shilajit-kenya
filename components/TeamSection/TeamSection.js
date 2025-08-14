import React from 'react'
import Team from '../../api/team'
import SectionTitle from '../SectionTitle/SectionTitle';
import Image from 'next/image';

const ClickHandler = (e) => {
    e.preventDefault(); // prevent default link behavior
    window.scrollTo(0, 0); // scroll to top
}

const TeamSection = (props) => {
    return (
        <section className={`wpo-team-section section-padding ${props.tmClass}`}>
            <div className="container">
                <SectionTitle subTitle={'PRODUCTS'} Title={'Our Popular Products'} />
                <div className="wpo-team-wrap">
                    <div className="row">
                        {Team.map((team, aitem) => (
                            <div className="col col-lg-3 col-md-6 col-12" key={aitem}>
                                <div className="wpo-team-item">
                                    <div className="wpo-team-img">
                                        <div className="wpo-team-img-box">
                                            <Image src={team.tImg} alt={team.name} />
                                        </div>
                                    </div>
                                    <div className="wpo-team-text">
                                        <h2>
                                            <a href="#" onClick={ClickHandler}>{team.name}</a>
                                        </h2>
                                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{team.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TeamSection;
