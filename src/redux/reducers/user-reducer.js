import { ADD_USER } from '../actions/types';

const initialState = {
  user: {}
};

const placeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
}

export default placeReducer;