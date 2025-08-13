import React, { Fragment } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useRouter } from 'next/router'
import Campaign from '../../api/campaign'
import Footer from '../../components/footer/Footer';
import ServiceSidebar from './sidebar';
import CampaignTab from './Tabs/CampaignTab';
import Image from 'next/image';

const CampaignSinglePage = (props) => {

    const router = useRouter()

    const CampaignDetails = Campaign.find(item => item.slug === router.query.slug)


    return (
        <Fragment>
            <Navbar2 />
            <PageTitle pageTitle={CampaignDetails?.title} pagesub={'Campaign'} />
            <div className="wpo-Campaign-single-area">
                <div className="wpo-campaign-details-area section-padding">
                    <div className="container">
                        <div className="row">
                            <div className="col col-lg-8">
                                <div className="wpo-campaign-details-wrap">
                                    <div className="wpo-campaign-details-img">
                                        <Image src={CampaignDetails?.cSimg} alt="" />
                                    </div>

                                    <CampaignTab CampaignDetails={CampaignDetails} />
                                </div>
                            </div>
                            <div className="col col-lg-4 col-12">
                                <ServiceSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CampaignSinglePage;