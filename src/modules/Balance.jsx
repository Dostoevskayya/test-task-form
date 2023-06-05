import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

const Balance = ({ user }) => {
  const balance = Object.entries(user?.currencies ?? {}).map(([key, value]) => `${key} ${value}`);

  return (
    <Box sx={{ ml: 3 }}>
      <Typography
        sx={{
          mt: 1,
          p: 2,
          maxWidth: 300,
          minWidth: 200,
          borderRadius: 1,
          position: 'absolute',
          backgroundColor: '#f5f9fc',
        }}>
        Balance:
        {user
          ? balance.map((item, index) => (
              <span key={index}>
                <br />
                {item}
              </span>
            ))
          : ''}
      </Typography>
    </Box>
  );
};

export default memo(Balance);
