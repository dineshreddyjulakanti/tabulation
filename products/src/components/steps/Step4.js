// src/components/steps/Step4.js
import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const Step4 = ({ data, dispatch, onSubmit }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      <h3>Step 4: Achievements</h3>
      <TextField
        label="Achievements (comma-separated)"
        multiline
        rows={3}
        value={data.achievements}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'achievements', value: e.target.value })}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="text" onClick={() => dispatch({ type: 'PREV_STEP' })}>Previous</Button>
        <Button variant="contained" onClick={onSubmit}>Submit</Button>
      </Box>
    </Box>
  );
};

export default Step4;
