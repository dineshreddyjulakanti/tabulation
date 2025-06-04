import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const Step1 = ({ data, dispatch }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}>
      <h3>Step 1: Personal Info</h3>
      <TextField
        label="Name"
        value={data.name}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
      />
      <TextField
        label="Email"
        type="email"
        value={data.email}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
      />
      <TextField
        label="Phone"
        type="tel"
        value={data.phone}
        onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: e.target.value })}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <span /> {/* Placeholder to balance button */}
        <Button variant="contained" onClick={() => dispatch({ type: 'NEXT_STEP' })}>Next</Button>
      </Box>
    </Box>
  );
};

export default Step1;
