import { 
  Button, Dialog, Page, TextAreaField, Box, Heading, Paragraph 
} from '@constellation/core';
import { Plus } from '@constellation/core/icons';

import React, { useState } from 'react';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setDescription, setOnBoardingDetails } from '../redux/candidateDataSlice';
import Skills from '../components/customComponents/Skills';
import FileUpload from '../components/fileupload/FileUpload';


const contentArray = [
  { title: 'HR Policies', text: 'Details about HR policies and procedures.' },
  { title: 'Employee Benefits', text: 'Information on health, retirement, and perks.' },
  { title: 'Leave Tracker', text: 'Check your leave balance and request time off.' },
  { title: 'Performance Reviews', text: 'Guidelines and feedback for career growth.' },
];

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const onBoardingDetails = useSelector(
    (state: RootState) => state.candidateData.onBoardingDetails
  );

  const fileName = useSelector(
    (state: RootState) => state.candidateData.onBoardingDetails.fileName
  );

  const description = useSelector(
    (state: RootState) => state.candidateData.onBoardingDetails.description || ''
  );

  const handleSkillsChange = (selectedOptions: string[]) => {
    dispatch(
      setOnBoardingDetails({ ...onBoardingDetails, skills: selectedOptions })
    );
  };

  const submitHandler = () => {
    console.log('data', onBoardingDetails, fileName, description);
  };

  return (
    <Page>
      <Box>
        <Heading>HR Dashboard</Heading>
        {contentArray.map((item, index) => (
          <Box key={index} mb={2}>
            <Heading size="md">{item.title}</Heading>
            <Paragraph>{item.text}</Paragraph>
          </Box>
        ))}
      </Box>

      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            icon={<Plus />}
            iconPosition="left"
            onClick={() => {
              setOpen(true);
            }}
          >
            Candidate Onboarding
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        title="Candidate OnBoarding"
        onClose={() => setOpen(false)}
        className="customDialog"
      >
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Skills onChange={handleSkillsChange} />
        </div>

        <TextAreaField
          label="description"
          name="description"
          inputWidth="fluid"
          value={description}
          onChange={(event: { currentTarget: { value: string; }; }) => {
            dispatch(setDescription(event.currentTarget.value));
          }}
        />

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <FileUpload />
        </div>

        <Button width="fluid" onClick={submitHandler}>
          Submit
        </Button>
      </Dialog>
    </Page>
  );
}