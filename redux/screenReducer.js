import { SET_LOCATION, SET_USER_TYPE, SET_CONTACT_INFO } from './screenAction';

const initialState = {
  city: '',
  role: '',
  full_name: '',
  phone_number: '',
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:

      return { ...state, city: action.payload };
   
    
    case SET_USER_TYPE:
      return { ...state, role: action.payload };
     
    case SET_CONTACT_INFO:
      return { ...state, full_name: action.payload.full_name, phone_number: action.payload.phone_number };
    default:
      return state;
  }
};

export default reducer;
