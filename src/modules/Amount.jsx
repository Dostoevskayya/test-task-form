import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useMemo, useCallback, memo } from 'react';

const Amount = ({ currency, amount, setAmount, user }) => {
  const handleValueChange = useCallback(
    (e) => {
      const newValue = e.target.value;

      const indexOfDot = newValue.indexOf('.');

      if (indexOfDot === -1) {
        setAmount(newValue);
      } else {
        const decimals = (currency?.decimals ?? 3) + 1;

        const parcedValue =
          newValue.slice(0, indexOfDot) + newValue.slice(indexOfDot, indexOfDot + decimals);

        setAmount(parcedValue);
      }
    },
    [setAmount, currency],
  );

  const maxValue = useMemo(() => {
    return user?.currencies[currency.code] ?? Infinity;
  }, [user, currency]);

  const doWeHaveError = maxValue - amount < 0;

  const step = (currency?.decimals ?? 2) === 2 ? 0.01 : 0.001;

  return (
    <Box
      sx={{
        '& > :not(style)': { width: 200 },
      }}>
      <TextField
        label="Amount"
        variant="outlined"
        type="number"
        required
        error={doWeHaveError}
        inputProps={{ min: 0, max: maxValue, step, lang: 'en-US' }}
        helperText={doWeHaveError ? 'You have no enough money' : ''}
        value={amount ?? ''}
        onChange={handleValueChange}
      />
    </Box>
  );
};

export default memo(Amount);
