import {Box, CircularProgress, Typography} from '@mui/material';

export const LoadingIndicator = ({ message }: { message: string}) => (
    <Box mt={4} textAlign="center">
        <CircularProgress color="secondary" />
        <Typography variant="h6" mt={2}>
            { message }
        </Typography>
    </Box>
)