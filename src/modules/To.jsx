import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useCallback, memo } from 'react';

const To = ({ user, setUser, options }) => {
  const handleChange = useCallback(
    (e) => {
      setUser(e.target.value);
    },
    [setUser],
  );

  return (
    <Box sx={{ m: 1 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">To</InputLabel>
        <Select required value={user ?? ''} label="To" onChange={handleChange}>
          {options?.map((option) => (
            <MenuItem key={option.id} value={option}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default memo(To);
