import {createSlice} from '@reduxjs/toolkit';

const initialState: {completedSections: string[]} = {
  completedSections: [],
};

// Create auth slice with reducers and actions
export const guestProfileSlice = createSlice({
  name: 'guestProfile',
  initialState,
  reducers: {
    addCompletedSection: (state, {payload: sectionId}) => {
      state.completedSections.push(sectionId);
    },
  },
});

export default guestProfileSlice.reducer;

export const {addCompletedSection} = guestProfileSlice.actions;
