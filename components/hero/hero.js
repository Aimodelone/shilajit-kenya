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
                            <a
                                href="https://wa.me/254793313743?text=Welcome!%0A%0AWe%E2%80%99re%20now%20selling%20pure%20Himalayan%20Shilajit%20%E2%80%93%20known%20for%20boosting%20energy%20and%20vitality%20%E2%80%93%20for%20just%203500.%0A100%25%20natural%2C%20straight%20from%20the%20Himalayas%20mountains!%0A%0AWould%20you%20like%20to%20place%20an%20order%3F"
                                className="theme-btn"
                                style={{ color: '#000' }}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                Shop Shilajit Now
                            </a>
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
