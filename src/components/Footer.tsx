import React from 'react';
import {
    Typography,
    Box,
} from '@mui/material';
import { PROJECT_NAME } from '../constants/Constants';

const Footer: React.FC = () => {

    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                width: '100%',
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderTop: '1px solid #e0e0e0',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
