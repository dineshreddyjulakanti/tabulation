import React, { createContext, useReducer } from 'react';

export const FormContext = createContext();

const initialState = {
  name: '',
  email: '',
  phone: '',
  degree: '',
  institution: '',
  year: '',
  interests: [],
  achievements: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export const FormProvider = ({ children }) => {
  const [formData, dispatch] = useReducer(reducer, initialState);

  return (
    <FormContext.Provider value={{ formData, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};
