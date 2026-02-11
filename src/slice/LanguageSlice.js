// languageSlice.js
import { createSlice } from '@reduxjs/toolkit';
import i18n from 'i18next';

const initialState = {
  selectedLanguage: 'en', // Default language
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
      // console.log(action.payload)
      i18n.changeLanguage(action.payload);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
const { reducer } = languageSlice;
export default reducer;