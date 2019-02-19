import { TEST_DISPATCH } from './types';

// Register User
const registeruser = userData => {
  return {
    type: TEST_DISPATCH,
    payload: userData
  };
};

export default registeruser