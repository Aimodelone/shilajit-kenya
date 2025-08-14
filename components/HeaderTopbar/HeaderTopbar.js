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
                                <Link className="theme-btn" href="#">Buy Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderTopbar;
