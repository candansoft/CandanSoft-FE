import React from "react";
import { Typography, Grid, Paper, Box } from "@mui/material";
import { People, Timeline, PendingActions } from "@mui/icons-material";
import { useAuthentication } from "../contexts/authentication/AuthenticationContext";

const Dashboard: React.FC = () => {
    const { sessionUser } = useAuthentication();

    return (
        <Box sx={{ p: 3 }}>
            {/* Başlık */}
            <Typography variant="h4" fontWeight={600} gutterBottom>
                Welcome, {sessionUser?.username || "User"} 👋
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={4}>
                Here’s an overview of your system.
            </Typography>

            {/* Özet Kartlar */}
            <Grid container spacing={3}>
                {[
                    { icon: <People sx={{ fontSize: 40 }} />, label: "Total Users", value: "1,200" },
                    { icon: <Timeline sx={{ fontSize: 40 }} />, label: "Active Sessions", value: "75" },
                    { icon: <PendingActions sx={{ fontSize: 40 }} />, label: "Pending Tasks", value: "23" },
                ].map((card) => (
                    <Paper
                        key={card.label}
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            textAlign: "center",
                            transition: "0.3s",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: 6,
                            },
                        }}
                    >
                        <Box color="primary.main" mb={1}>
                            {card.icon}
                        </Box>
                        <Typography variant="h6">{card.label}</Typography>
                        <Typography variant="h4" fontWeight={600}>
                            {card.value}
                        </Typography>
                    </Paper>
                ))}
            </Grid>
        </Box>
    );
};

export default Dashboard;
