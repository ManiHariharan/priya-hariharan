import React, { useState } from 'react';
import axios from 'axios';
import * as Constants from '../constants/APiUrlConstants';
import { getToken, getUser, removeUserSession } from '../utils/Common';

function Dashboard(props) {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    const token = getToken();
    if (!token) {
      return;
    }

    setLogoutLoading(true);
    axios.get(Constants.SESSION_LOGOUT + `?tokenId=${token}`).then(_response => {
      removeUserSession();
      props.history.push('/login');
      setLogoutLoading(false);
    });
  }

  if(logoutLoading){
    return <div className="content">Performing Session Logout...</div>
  } else {
    return (
      <div>
        Welcome {user.userName}!<br /><br />
        <input type="button" onClick={handleLogout} value="Logout" />

        <br /><br />
        <small>(Access with token)</small>
      </div>
    );
    }
}

export default Dashboard;
