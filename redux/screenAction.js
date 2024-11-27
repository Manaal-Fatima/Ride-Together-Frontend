export const SET_LOCATION = 'SET_LOCATION';
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const SET_CONTACT_INFO = 'SET_CONTACT_INFO';

export const setLocation = (city) => ({
  type: SET_LOCATION,
  payload: city,
});

export const setUserType = (role) => ({
  type: SET_USER_TYPE,
  payload: role,
});

export const setContactInfo = (full_name, phone_number, gender) => ({
  type: SET_CONTACT_INFO,
  payload: { full_name, phone_number, gender },
});


