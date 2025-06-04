// src/components/ProfileDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/profiles/${id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile", err));
  }, [id]);

  if (!profile)
    return (
      <Typography sx={{ mt: 8, textAlign: "center" }}>Loading...</Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Paper
        sx={{
          background: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          minWidth: 400,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Profile of {profile.name}
        </Typography>
        {/* Personal */}
        <Section title="Personal Info">
          <Field label="Email" value={profile.email} />
          <Field label="Phone" value={profile.phone} />
        </Section>
        {/* Education */}
        <Section title="Education">
          <Field label="Degree" value={profile.degree} />
          <Field label="Institution" value={profile.institution} />
          <Field label="Year" value={profile.year} />
        </Section>
        {/* Interests & Achievements */}
        <Section title="Interests">
          <Typography>{profile.interests.join(", ")}</Typography>
        </Section>
        <Section title="Achievements">
          <Typography>{profile.achievements.join(", ")}</Typography>
        </Section>
      </Paper>
    </Box>
  );
}

/* ---------- small helpers ---------- */
const Section = ({ title, children }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h6">{title}</Typography>
    {children}
  </Box>
);

const Field = ({ label, value }) => (
  <>
    <Typography variant="subtitle2" sx={{ mt: 1 }}>
      {label}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value}
    </Typography>
  </>
);
