import React from 'react'
import Link from 'next/link'
import Logo from '/public/images/logo2.png'
import Image from 'next/image'

const HeaderTopbar = () => {
    return (
        <div className="topbar">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-3 col-12 d-lg-block d-none">
                        <Link className="navbar-brand" href="/"><Image src={Logo} alt=""/></Link>
                    </div>
                    <div className="col-lg-9 col-12">
                        <div className="contact-info-wrap">
                            <div className="contact-info">
                                <div className="icon">
                                    <i className="fi flaticon-phone-call"></i>
                                </div>
                                <div className="info-text">
                                    <span>Call Us:</span>
                                    <p>+254 793 313743</p>
                                </div>
                            </div>
                            <div className="contact-info">

                            </div>
                            <div className="contact-info">
                                <Link
                                    className="theme-btn"
                                    href="https://wa.me/254793313743?text=Welcome!%0A%0AWe%E2%80%99re%20now%20selling%20pure%20Himalayan%20Shilajit%20%E2%80%93%20known%20for%20boosting%20energy%20and%20vitality%20%E2%80%93%20for%20just%203500.%0A100%25%20natural%2C%20straight%20from%20the%20Himalayas%20mountains!%0A%0AWould%20you%20like%20to%20place%20an%20order%3F"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Buy Now
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderTopbar;
