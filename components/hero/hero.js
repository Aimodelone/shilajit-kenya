import React from "react";
import Link from 'next/link';
import hero1 from '/public/images/slider/1.png';
import Image from "next/image";

const Hero = () => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <section className="static-hero" style={{ background: '#000', color: '#fff' }}>
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div data-swiper-parallax="300" className="slide-title-sub">
                                <span style={{ color: '#fff' }}>Pure Himalayan Power</span>
                            </div>
                            <div data-swiper-parallax="300" className="slide-title">
                                <h2 style={{ color: '#fff' }}>Unlock Your Energy & Vitality</h2>
                            </div>
                            <div data-swiper-parallax="400" className="slide-text">
                                <p style={{ color: '#fff' }}>
                                    Experience the ancient natural supplement Shilajit — packed with minerals and fulvic acid
                                    to boost stamina, focus, and overall wellness every day.
                                </p>
                            </div>
                            <div className="clearfix"></div>
                            <div data-swiper-parallax="500" className="slide-btns">
                                 <Link onClick={ClickHandler} href="#" className="theme-btn" style={{ color: '#000' }}>
                                     Shop Shilajit Now
                                 </Link>
                            </div>
                            <div className="politian-pic">
                                <Image src={hero1} alt="Shilajit Hero" />
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
