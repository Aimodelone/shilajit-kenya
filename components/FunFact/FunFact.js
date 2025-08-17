import React from 'react'
import CountUp, { useCountUp } from 'react-countup';
import VideoModal from '../ModalVideo/VideoModal';

const FunFact = (props) => {

    useCountUp({
        ref: 'counter',
        end: 1234567,
        enableScrollSpy: true,
        scrollSpyDelay: 1000,
    });

    return (
        <section className="wpo-fun-fact-section content">
            <div className="right-bg">
                <VideoModal/>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-lg-6">
                        <div className="wpo-fun-fact-wrap">
                            <div className="wpo-fun-fact-grids clearfix">
                                <div className="grid">
                                    <div className="info">
                                        <h3><span><CountUp end={350} enableScrollSpy /></span>+</h3>
                                        <p>Improved energy and vitality with Shilajit</p>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="info">
                                        <h3><span><CountUp end={50} enableScrollSpy /></span>+</h3>
                                        <p>People reporting better mental clarity</p>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="info">
                                        <h3><span><CountUp end={300} enableScrollSpy /></span>+</h3>
                                        <p>Improved immunity and well-being</p>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div className="info">
                                        <h3><span><CountUp end={250} enableScrollSpy /></span>+</h3>
                                        <p>People experiencing hormonal balance support</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span id="counter" className='d-none' />
        </section>
    )
}

export default FunFact;
