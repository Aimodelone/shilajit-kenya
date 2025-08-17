import React from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const Scrollbar = () => {
  return (
    <div className="col-lg-12">
      <div className="header-menu">
        <ul className="smothscroll">
          <li>
            <AnchorLink href="#__next">
            <i
                className="ti-arrow-up"
                style={{
                    backgroundColor: '#FFD700', // gold
                    color: '#fff',              // white arrow
                    borderRadius: '50%',        // round
                    padding: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    width: '40px',
                    height: '40px',
                    border: 'none',             // remove border
                    outline: 'none',            // remove focus outline
                    boxShadow: 'none',          // no extra glow
                    cursor: 'pointer',
                }}
                ></i>
            </AnchorLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Scrollbar;
