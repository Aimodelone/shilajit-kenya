import React from 'react'
import sign from '/public/images/signeture.png'
import Image from 'next/image';

const About = (props) => {
    return (
        <section className={`wpo-about-section section-padding ${props.abClass}`}>
            <div className="container">
                <div className="wpo-about-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-img">
                                <Image src={props.abimg} alt="Shilajit" />
                                <div className="wpo-about-img-text">
                                    <h4>Ages</h4>
                                    <div className="rotate-text">
                                        <span>W</span>
                                        <span>e</span>
                                        <span>A</span>
                                        <span>r</span>
                                        <span>e</span>
                                        <span>W</span>
                                        <span>o</span>
                                        <span>r</span>
                                        <span>k</span>
                                        <span>i</span>
                                        <span>n</span>
                                        <span>g</span>
                                        <span>F</span>
                                        <span>o</span>
                                        <span>r</span>
                                        <span>Y</span>
                                        <span>o</span>
                                        <span>u</span>
                                        <span>S</span>
                                        <span>i</span>
                                        <span>n</span>
                                        <span>c</span>
                                        <span>e</span>
                                    </div>
                                    <div className="dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <div className="border-shape-1"></div>
                                    <div className="border-shape-2"></div>
                                    <div className="border-shape-3"></div>
                                </div>
                                <div className="about-shape">
                                    <div className="shape-1"></div>
                                    <div className="shape-2"></div>
                                    <div className="shape-3"></div>
                                    <div className="shape-4"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="wpo-about-text">
                                <div className="wpo-section-title">
                                    <span>About Shilajit</span>
                                    <h2>The Ancient Natural Resin That Boosts Energy and Vitality</h2>
                                </div>
                                <p>Shilajit is a mineral-rich resin that has been used for centuries in traditional medicine to enhance energy, vitality, and overall wellness. It is harvested from the high-altitude rocks of the Himalayas and contains fulvic acid, humic acid, and over 80 essential minerals.</p>
                                <p>This powerful substance is known to support cognitive function, improve stamina, and promote cellular regeneration. Regular use can help combat fatigue, improve immunity, and enhance overall physical performance.</p>
                                <div className="quote">
                                    <p>“Nature provides the ultimate energy booster in Shilajit — unlocking vitality from within.”</p>
                                </div>
                                <div className="wpo-about-left-info">
                                    <div className="wpo-about-left-inner">
                                        <div className="wpo-about-left-text">
                                            <h5>Natural Wellness</h5>
                                            <span>Ancient Health Tradition</span>
                                        </div>
                                    </div>
                                    <div className="signeture">
                                        <Image src={sign} alt="Signature" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About;
