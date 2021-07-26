// const BASE_URL = "http://localhost:3070/H2P";
const BASE_URL = "https://h2predictions.herokuapp.com/";

const UNAUTHORISED_PREFIX = BASE_URL + "/h2P/react";

export const SIGN_IN = UNAUTHORISED_PREFIX + '/signIn';
export const VERIFY_TOKEN = UNAUTHORISED_PREFIX + '/verifyToken';
export const SESSION_LOGOUT = UNAUTHORISED_PREFIX + '/sessionLogout';