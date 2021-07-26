// return the user data from the session storage
export const getUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  const sessionToken = sessionStorage.getItem('token');
  if (sessionToken === undefined) return null;
  else return sessionToken;
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

// set the token and user from the session storage
export const setUserSession = (responseData) => {
  console.log(responseData);
  sessionStorage.setItem('token', responseData.sessionToken);
  sessionStorage.setItem('user', JSON.stringify(responseData));
}