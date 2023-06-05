import { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CurrencySelect from './modules/CurrencySelect';
import From from './modules/From';
import Amount from './modules/Amount';
import To from './modules/To';
import Balance from './modules/Balance';

function App() {
  const [currency, setCurrency] = useState();
  const [sender, setSender] = useState();
  const [receiver, setReceiver] = useState();
  const [amount, setAmount] = useState();
  const [userList, setUserList] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const filteredSenderOptions = useMemo(
    () => userList.filter((user) => user.currencies[currency?.code] && user.id !== receiver?.id),
    [userList, currency, receiver],
  );

  const filteredReceiverOptions = useMemo(
    () => userList.filter((user) => user.currencies[currency?.code] && user.id !== sender?.id),
    [userList, currency, sender],
  );

  const handleCurrencyChange = useCallback(
    (newCurrency) => {
      if (newCurrency?.decimals < currency?.decimals) {
        setAmount(Number(amount).toFixed(newCurrency.decimals));
      }

      setCurrency(newCurrency);

      if (sender && !sender.currencies[newCurrency.code]) {
        setSender(undefined);
      }
      if (receiver && !receiver.currencies[newCurrency.code]) {
        setReceiver(undefined);
      }
    },
    [currency, sender, receiver, amount],
  );

  const addAlert = (status, text) => {
    // Подразумевается что у каждого Alert'a будет уникальное значение id
    const id = new Date().getTime();

    setAlerts((state) => [
      ...state,
      {
        text,
        status,
        id,
      },
    ]);

    setTimeout(() => {
      setAlerts((state) => state.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      sender &&
      receiver &&
      currency &&
      Number(amount) > 0 &&
      Number(amount) <= sender.currencies[currency.code]
    ) {
      const body = {
        currencyId: currency.id,
        fromUserId: sender.id,
        toUserId: receiver.id,
        amount: amount,
      };

      try {
        const response = await fetch('http://91.193.43.93:3000/transfers/make-transfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (response.status !== 200) {
          throw Error(result.message);
        }

        addAlert(
          'success',
          <p>
            Success! <br />
            TransferId: {result.transferId}
          </p>,
        );
      } catch (error) {
        addAlert('error', error.message);
      }
    }
  };

  useEffect(() => {
    fetch('http://91.193.43.93:3000/users')
      .then((response) => response.json())
      .then((data) => setUserList(data));
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <form onSubmit={onSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
              minWidth: 350,
            }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'space-between',
                justifyContent: 'space-between',
                maxWidth: 350,
                m: 1,
              }}>
              <CurrencySelect currency={currency} setCurrency={handleCurrencyChange} />
              <Amount currency={currency} user={sender} amount={amount} setAmount={setAmount} />
            </Box>
            <From user={sender} options={filteredSenderOptions} setUser={setSender} />
            <To user={receiver} options={filteredReceiverOptions} setUser={setReceiver} />
            <Button
              sx={{
                minWidth: 200,
                m: 1,
              }}
              type="submit"
              variant="contained">
              Send money
            </Button>
          </Box>
        </form>
        <Balance user={sender} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          zIndex: '2',
        }}>
        {alerts.map((alert) => (
          <Alert sx={{ mb: 1 }} severity={alert.status} key={alert.id}>
            {alert.text}
          </Alert>
        ))}
      </div>
    </>
  );
}

export default App;
