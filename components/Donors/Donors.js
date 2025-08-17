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
                            <Link
                                href="https://wa.me/254793313743?text=Welcome!%0A%0AWe%E2%80%99re%20now%20selling%20pure%20Himalayan%20Shilajit%20%E2%80%93%20known%20for%20boosting%20energy%20and%20vitality%20%E2%80%93%20for%20just%203500.%0A100%25%20natural%2C%20straight%20from%20the%20Himalayas%20mountains!%0A%0AWould%20you%20like%20to%20place%20an%20order%3F"
                                className="theme-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Buy Now
                            </Link>

                            <Link
                                href="https://wa.me/254793313743?text=Hi!%20I%20would%20like%20to%20make%20an%20inquiry%20about%20your%20Shilajit."
                                className="theme-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Make Inquiry
                            </Link>
                         </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Donors;
