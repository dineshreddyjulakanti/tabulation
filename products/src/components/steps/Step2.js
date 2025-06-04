// src/components/steps/Step2.js
import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const Step2 = ({ data, dispatch }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      <h3>Step 2: Education</h3>
      <TextField
        label="Degree"
        value={data.degree}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'degree', value: e.target.value })}
      />
      <TextField
        label="Institution"
        value={data.institution}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'institution', value: e.target.value })}
      />
      <TextField
        label="Year"
        value={data.year}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'year', value: e.target.value })}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="text" onClick={() => dispatch({ type: 'PREV_STEP' })}>Previous</Button>
        <Button variant="contained" onClick={() => dispatch({ type: 'NEXT_STEP' })}>Next</Button>
      </Box>
    </Box>
  );
};

export default Step2;
