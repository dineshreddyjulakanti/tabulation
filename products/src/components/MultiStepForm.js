// src/components/MultiStepForm.js
import React, { useReducer } from 'react';
import { initialState, reducer } from '../reducer';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import axios from 'axios';
import { Box } from '@mui/material';

const MultiStepForm = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/profiles`,
        {
          ...state.formData,
          interests: state.formData.interests.split(','),
          achievements: state.formData.achievements.split(',')
        }
      );
      alert('Profile created!');
      dispatch({ type: 'RESET' });
    } catch (err) {
      alert('Error saving profile.');
    }
  };

  const currentStep = () => {
    const props = { data: state.formData, dispatch };
    switch (state.step) {
      case 1: return <Step1 {...props} />;
      case 2: return <Step2 {...props} />;
      case 3: return <Step3 {...props} />;
      case 4: return <Step4 {...props} onSubmit={handleSubmit} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 6 }}>
      <Box sx={{ background: '#fff', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 400 }}>
        {currentStep()}
      </Box>
    </Box>
  );
};

export default MultiStepForm;
