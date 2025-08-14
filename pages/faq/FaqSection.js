import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const FaqSection = (props) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className="wpo-benefits-section">
            <div className="row">
                <div className="col-lg-12 col-12">
                    <div className="wpo-benefits-item">
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={""}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography>What is Shilajit and how does it work?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Shilajit is a natural resin packed with minerals and fulvic acid that helps boost energy, vitality, and overall wellness when taken consistently.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary
                                expandIcon={""}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography>Can Shilajit improve mental clarity?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Many users report enhanced focus, memory, and mental clarity after using Shilajit regularly as part of their daily routine.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                            <AccordionSummary
                                expandIcon={""}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                            >
                                <Typography>How does Shilajit support energy and stamina?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Shilajit helps improve physical performance and reduces fatigue by delivering essential minerals and nutrients to the body.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                            <AccordionSummary
                                expandIcon={""}
                                aria-controls="panel4bh-content"
                                id="panel4bh-header"
                            >
                                <Typography>Is Shilajit safe for daily use?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    When sourced from a reliable supplier and used as directed, Shilajit is safe and supports overall health and hormonal balance.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FaqSection;
