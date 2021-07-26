import React, { useState } from 'react';
import axios from 'axios';
import * as Constants from '../constants/APiUrlConstants';
import { setUserSession } from '../utils/Common';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);

    axios.post(Constants.SIGN_IN, { user_id: username.value, pass_key: password.value }).then(response => {
      setUserSession(response.data);
      props.history.push('/dashboard');
      setLoading(false);
    }).catch(error => {
      const errorResponse = error.response;
      console.log(errorResponse);
      if(errorResponse !== undefined && errorResponse.status !== 500) {
        setError(errorResponse.data);
      } else {
        setError("Something went wrong. Please try again later.");
      }
      setLoading(false);
    });
  }

  return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} />

      <br /><br />
      <small>(Access without token)</small>
    </div>
  );
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;