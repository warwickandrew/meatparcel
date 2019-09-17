import axios from 'axios'; 
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import { 
  GET_ERRORS, 
  SET_CURRENT_USER,
  CLEAR_CURRENT_PROFILE
} from './types';

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
  axios.post('/api/users/login', userData)
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

export const logoutUser = () => dispatch => {
  // Remove token from localstorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch({ type: CLEAR_CURRENT_PROFILE});
}

export default registeruser