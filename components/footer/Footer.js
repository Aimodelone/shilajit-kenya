import React from 'react'
import Link from 'next/link'
import Logo from '/public/images/logo.png'
import Services from '../../api/service';
import Image from 'next/image';

const ClickHandler = () => {
    window.scrollTo(10, 0);
}
const SubmitHandler = (e) => {
    e.preventDefault()
}

const Footer = (props) => {
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
                                    <li>Phone: +254 793 313743</li>
                                </ul>
                                <div className="social">
                                    <ul>
                                        <li>
                                            <Link onClick={ClickHandler} href="https://facebook.com/shilajitkenya">
                                                <i className="fi flaticon-facebook-app-symbol"></i>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link onClick={ClickHandler} href="https://instagram.com/shilajitkenya">
                                                <i className="fi flaticon-instagram-1"></i>
                                            </Link>
                                        </li>
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
                                    <li><Link onClick={ClickHandler} href="/home">Home</Link></li>
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
                                    <li><Link onClick={ClickHandler} href="/service">Shilajit Benefits</Link></li>
                                    <li><Link onClick={ClickHandler} href="/team">Products</Link></li>
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
