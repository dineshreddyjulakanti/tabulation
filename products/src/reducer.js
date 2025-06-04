export const initialState = {
    step: 1,
    formData: {
      name: '',
      email: '',
      phone: '',
      degree: '',
      institution: '',
      year: '',
      interests: '',
      achievements: ''
    }
  };
  
  export function reducer(state, action) {
    switch (action.type) {
      case 'NEXT_STEP':
        return { ...state, step: state.step + 1 };
      case 'PREV_STEP':
        return { ...state, step: state.step - 1 };
      case 'UPDATE_FIELD':
        return {
          ...state,
          formData: {
            ...state.formData,
            [action.field]: action.value
          }
        };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }
  