import React from 'react';
import ContactForm from '../ContactFrom/ContactForm'


const Contactpage = () => {

    return (
        <section className="wpo-contact-pg-section section-padding">
          <div className="container">
            <div className="row">
              <div className="col col-lg-10 offset-lg-1">
                <div className="office-info">
                  <div className="row justify-content-center">
                    {/* Address */}
                    <div className="col-md-6 col-lg-5 mb-4">
                      <div className="office-info-item text-center p-4 h-100 shadow rounded bg-white">
                        <div className="office-info-icon mb-3">
                          <div className="icon text-primary text-3xl">
                            <i className="fi flaticon-maps-and-flags"></i>
                          </div>
                        </div>
                        <div className="office-info-text">
                          <h2 className="text-xl font-semibold mb-2">Address</h2>
                          <p className="text-gray-600">Kusi Ln, Nairobi</p>
                        </div>
                      </div>
                    </div>
      
                    {/* Phone */}
                    <div className="col-md-6 col-lg-5 mb-4">
                      <div className="office-info-item text-center p-4 h-100 shadow rounded bg-white">
                        <div className="office-info-icon mb-3">
                          <div className="icon text-primary text-3xl">
                            <i className="fi flaticon-phone-call"></i>
                          </div>
                        </div>
                        <div className="office-info-text">
                          <h2 className="text-xl font-semibold mb-2">Call Now</h2>
                          <p className="text-gray-600">+254 793 313743</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                {/* Title */}
                <div className="wpo-contact-title text-center mt-8">
                    <h2 className="text-2xl font-bold">Have Any Question?</h2>
                    <p className="text-gray-500 mt-2">
                        Contact us anytime at <a href="tel:+254793313743" className="text-blue-500 font-semibold hover:underline">
                        +254 793 313743
                        </a>
                    </p>
                 </div>


                {/* Form */}
              </div>
            </div>
          </div>

          {/* Map */}
          <section className="wpo-contact-map-section mt-10">
            <div className="wpo-contact-map h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.864516071451!2d36.81930387496539!3d-1.2920655356174386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1149e06e36cf%3A0x3b3e8a6cfbb6b09b!2sKusi%20Ln%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1723875600000!5m2!1sen!2ske"
                className="w-full h-full border-0 rounded"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </section>
        </section>
      );

}

export default Contactpage;
