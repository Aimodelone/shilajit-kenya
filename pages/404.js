import React, {Fragment} from 'react';
import Navbar2 from '../components/Navbar2/Navbar2';
import PageTitle from '../components/pagetitle/PageTitle'
import Error from '../components/404/404'
import Scrollbar from '../components/scrollbar/scrollbar'
import Footer from '../components/footer/Footer';
import Seo from '../components/Seo/Seo';

const ErrorPage = () => {
    return(
        <Fragment>
            <Seo
              title="Page Not Found | Shilajit Kenya"
              description="The page you are looking for could not be found."
              noindex={true}
            />
            <Navbar2/>
            <PageTitle pageTitle={'404'} pagesub={'404'}/> 
            <Error/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ErrorPage;
