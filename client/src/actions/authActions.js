import axios from 'axios'; 
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
const registeruser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios.post('/api/user/login', userData)
    .then(res => {
      // Save to local storage
      const { token } = res.data;
      // Set toke to LS
      localStorage.setItem('jwtToken', token);
      // Set token to auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }));
};


export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

export default registeruser