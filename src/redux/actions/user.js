import { ADD_USER } from './types';

export const addUser = placeName => {
  return {
    type: ADD_USER,
    payload: placeName
  }
}