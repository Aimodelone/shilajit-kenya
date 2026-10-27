import React from 'react'
import Link from 'next/link'
import Logo from '/public/images/logo.png'
import Image from 'next/image';
import useSiteSettings from '../../lib/useSiteSettings.js';


const ClickHandler = () => {
    window.scrollTo(10, 0);
}
const SubmitHandler = (e) => {
    e.preventDefault()
}

const Footer = (props) => {
    const settings = useSiteSettings();
    return (
        <footer className="wpo-site-footer">
            <div className="wpo-upper-footer">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget about-widget">
                                <div className="logo widget-title">
                                    <Link onClick={ClickHandler} className="navbar-brand" href="/index"><Image src={Logo} alt="" /></Link>
                                </div>
                                <ul className="info">
                                    {settings.phone && <li>Phone: {settings.phone}</li>}
                                </ul>
                                <div className="social">
                                    <ul>
                                        {settings.socialLinks?.facebook && (
                                        <li>
                                            <Link onClick={ClickHandler} href={settings.socialLinks.facebook}>
                                                <i className="fi flaticon-facebook-app-symbol"></i>
                                            </Link>
                                        </li>
                                        )}
                                        {settings.socialLinks?.instagram && (
                                        <li>
                                            <Link onClick={ClickHandler} href={settings.socialLinks.instagram}>
                                                <i className="fi flaticon-instagram-1"></i>
                                            </Link>
                                        </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget">
                                <div className="widget-title">
                                    <h3>Quick Links</h3>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} href="/">Home</Link></li>
                                    <li><Link onClick={ClickHandler} href="/about">About Us</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget link-widget s2">
                                <div className="widget-title">
                                    <h3>Shilajit</h3>
                                </div>
                                <ul>
                                    <li><Link onClick={ClickHandler} href="/benefits">Shilajit Benefits</Link></li>
                                    <li><Link onClick={ClickHandler} href="/products">Products</Link></li>
                                    <li><Link onClick={ClickHandler} href="/faq">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-lg-3 col-md-6 col-12 col-md-6 col-sm-12 col-12">
                            <div className="widget newsletter-widget">
                                <div className="widget-title">
                                    <h3>Our treding blogs</h3>
                                </div>
                                <p>Get timely updates ! Our informative blogs about shilajit benefits</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="wpo-lower-footer">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col col-lg-6 col-md-12 col-12">
                            <ul>
                                <li>&copy; 2025 <Link onClick={ClickHandler} href="/">Shilajit-Kenya</Link>. All rights reserved.</li>
                            </ul>
                        </div>
                        <div className="col col-lg-6 col-md-12 col-12">
                            <div className="link">
                                <ul>
                                    <li><Link onClick={ClickHandler} href="/about">About us</Link></li>
                                    <li><Link onClick={ClickHandler} href="/faq">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
