import React from 'react';
import Link from 'next/link'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const Donors = () => {

    return (
        <section className="wpo-donors-section">
            <div className="container">
                <div className="wpo-donors-wrap">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2>Would you like to become one of
                                our honorable donors?</h2>
                        </div>
                        <div className="col-lg-6">
                            <div className="donors-btn">
                                <Link onClick={ClickHandler} href="/donate">$10 Donation</Link>
                                <Link onClick={ClickHandler} href="/donate">Other</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Donors;
