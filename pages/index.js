import React, {Fragment} from 'react';
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/hero/hero';
import About from '../components/about/about';
import ServiceSection from '../components/ServiceSection/ServiceSection';
import Testimonial from '../components/Testimonial/Testimonial';
import FunFact from '../components/FunFact/FunFact';
import TeamSection from '../components/TeamSection/TeamSection';
import BlogSection from '../components/BlogSection/BlogSection';
import InstagramSection from '../components/InstagramSection/InstagramSection';
import Donors from '../components/Donors/Donors';
import PartnerSection from '../components/PartnerSection/PartnerSection';
import abimg from '/public/images/about.jpg'
import Footer from '../components/footer/Footer';
import Scrollbar from '../components/scrollbar/scrollbar';

const HomePage =() => {
    return(
        <Fragment>
            <Navbar hclass={'wpo-site-header-s1'} topbarNone={'topbar-none'} Logo={'/images/logo.png'}/>
            <Hero/>
            <About abimg={abimg}/>
            <ServiceSection/>
            <Testimonial/>
            <FunFact/>
            <TeamSection/>
            <Donors/>
            <BlogSection/>
            <InstagramSection/>
            <PartnerSection/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage;
