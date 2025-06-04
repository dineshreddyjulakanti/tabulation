// src/components/ProfileList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/profiles')
      .then(res => setProfiles(res.data))
      .catch(err => console.error('Error fetching profiles', err));
  }, []);

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: 6 }}>
      <Paper sx={{ background: '#fff', p: 4, borderRadius: 2, boxShadow: 3, minWidth: 400 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 400 }}>
          All Profiles
        </Typography>
        <List>
          {profiles.map(profile => (
            <ListItem key={profile._id} alignItems="flex-start" sx={{ display: 'block', mb: 2 }}>
              <ListItemText
                primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{profile.name}</Typography>}
                secondary={<Typography variant="body2" color="text.secondary">{profile.email}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ProfileList;
