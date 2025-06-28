import React from 'react';
import {Typography} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {IntakeProfileSection} from '../../services/coordinator';

interface IntakeProfileSectionsAccordionProps {
  IntakeProfileSectionsList: IntakeProfileSection[];
}

export const IntakeProfileSectionsAccordion: React.FC<
  IntakeProfileSectionsAccordionProps
> = ({IntakeProfileSectionsList}) => {
  return (
    <>
      {IntakeProfileSectionsList.map((section, section_index) => (
        <Accordion key={section_index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{section.sectionName}</Typography>
          </AccordionSummary>
          {section.queries.map((query, query_index) => (
            <AccordionDetails key={query_index}>
              <Typography sx={{color: 'gray'}}>{query.question}</Typography>
              <Typography>{query.answer}</Typography>
            </AccordionDetails>
          ))}
        </Accordion>
      ))}
    </>
  );
};
