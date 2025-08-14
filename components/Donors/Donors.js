import React from 'react';
import Link from 'next/link';

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
                            <h2>Would you like to try our premium Shilajit products?</h2>
                        </div>
                        <div className="col-lg-6">
                            <div className="donors-btn">
                                <Link onClick={ClickHandler} href="#">Buy Now</Link>
                                <Link onClick={ClickHandler} href="#">Make Inquiry</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Donors;
