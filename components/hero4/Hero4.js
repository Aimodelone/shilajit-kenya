import React from "react";
import VideoModal from '../ModalVideo/VideoModal';
import hero from '/public/images/slider/video.png'
import innerImg from '/public/images/slider/4.png'

import Shape1 from '/public/images/slider/back-shape-3.png'
import Shape2 from '/public/images/slider/back-shape-4.png'
import Shape3 from '/public/images/slider/back-shape-2.png'
import Image from "next/image";




const Hero4 = () => {
    return (
        <section className="static-hero-s3">
            <div className="hero-container">
                <div className="hero-inner">
                    <div className="container-fluid">
                        <div className="hero-content">
                            <div className="hero-content-wrap">
                                <div data-swiper-parallax="300" className="slide-title">
                                    <h2>Isabella Wilson</h2>
                                </div>
                                <div data-swiper-parallax="400" className="slide-text">
                                    <p>The Great and Ideological Leader For The Next Generation</p>
                                </div>
                                <div className="clearfix"></div>
                                <div data-swiper-parallax="500" className="slide-video-content">
                                    <div className="slide-video-img">
                                        <Image src={hero} alt="" />
                                        <VideoModal />
                                    </div>
                                    <div className="slide-video-text">
                                        <h4>Join My Campaign</h4>
                                        <p>The revolution is a great dictatorship of the exploited against the
                                            exploiters.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="politian-pic">
                                <div className="inner">
                                    <Image src={innerImg} alt="" />
                                </div>
                                <div className="back-shape"></div>
                                <div className="back-shape-2"><Image src={Shape1} alt="" /></div>
                                <div className="back-shape-3"><Image src={Shape2} alt="" /></div>
                            </div>
                            <div className="right-shape"><Image src={Shape3} alt="" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero4;
