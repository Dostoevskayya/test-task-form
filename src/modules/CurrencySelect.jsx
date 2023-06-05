import { useEffect, useCallback, useState, memo } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GEL: '₾',
  RUB: '₽',
};

const CurrencySelect = ({ currency, setCurrency }) => {
  const [currencyList, setCurrencyList] = useState();

  const handleChange = useCallback(
    (e) => {
      setCurrency(e.target.value);
    },
    [setCurrency],
  );

  useEffect(() => {
    fetch('http://91.193.43.93:3000/currencies')
      .then((response) => response.json())
      .then((data) => setCurrencyList(data));
  }, []);

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
        <Select value={currency ?? ''} label="Currency" required onChange={handleChange}>
          {currencyList?.map((option) => (
            <MenuItem key={option.id} value={option}>
              {currencySymbols[option.code]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default memo(CurrencySelect);
