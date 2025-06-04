// src/components/steps/Step3.js
import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const Step3 = ({ data, dispatch }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      <h3>Step 3: Interests</h3>
      <TextField
        label="Interests (comma-separated)"
        multiline
        rows={3}
        value={data.interests}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'interests', value: e.target.value })}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="text" onClick={() => dispatch({ type: 'PREV_STEP' })}>Previous</Button>
        <Button variant="contained" onClick={() => dispatch({ type: 'NEXT_STEP' })}>Next</Button>
      </Box>
    </Box>
  );
};

export default Step3;
