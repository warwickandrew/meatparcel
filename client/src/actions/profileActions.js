import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, PROFILE_ERROR } from './types';

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios.get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

export const createProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    const res = await axios.post('/api/profile', formData, config);

    alert(formData)
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    console.log('hi');

    dispatch( alert('profile created'));

    if(!edit) {
      history.push('/dashboard');
    }

  } catch (err) {
    const errors = err.response.data.errors;

    if(errors) {
      errors.forEach(error => dispatch(alert(error.msg)));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Profile loading
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};