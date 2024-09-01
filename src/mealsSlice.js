// mealsSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const mealsSlice = createSlice({
  name: "meals",
  initialState: [
    {
      name: "Breakfast",
      cost: 50, 
      chkBox: false,
    },
    {
      name: "High Tea",
      cost: 25,
      chkBox: false,
    },
    {
      name: "Lunch",
      cost: 65,
      chkBox: false,
    },
    {
      name: "Dinner",
      cost: 70,
      chkBox: false,
    }, 
  ],
  reducers: {
    toggleMealSelection: (state, action) => {
      // const{payload:index} = action;
      // state[index].chkBox ? state[index].chkBox = false : state[index].chkBox = true;
      state[action.payload].chkBox = !state[action.payload].chkBox;
    },
  },
});

export const { toggleMealSelection } = mealsSlice.actions;

export default mealsSlice.reducer;
