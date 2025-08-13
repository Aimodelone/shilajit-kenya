import React from "react";
import Link from 'next/link';
import hero1 from '/public/images/slider/1.png';
import Image from "next/image";

const Hero = () => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <section className="static-hero" style={{ background: '#000', color: '#fff' }}> {/* Black background & white text */}
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div data-swiper-parallax="300" className="slide-title-sub">
                                <span style={{ color: '#fff' }}>We Are Waiting For You</span>
                            </div>
                            <div data-swiper-parallax="300" className="slide-title">
                                <h2 style={{ color: '#fff' }}>Lets Make The World Great Again</h2>
                            </div>
                            <div data-swiper-parallax="400" className="slide-text">
                                <p style={{ color: '#fff' }}>
                                    We can start by taking small steps and making small changes that can have a big
                                    impact on the world.
                                </p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-btns">
                                 <Link onClick={ClickHandler} href="/about" className="theme-btn" style={{ color: '#000' }}>Join The Campaign</Link>
                            </div>
                            <div className="politian-pic">
                                <Image src={hero1} alt="" />
                                <div className="politian-shape">
                                    <div className="shape-1"></div>
                                    <div className="shape-2"></div>
                                    <div className="shape-3"></div>
                                    <div className="shape-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero;
