import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dataRegisterChef: {},
};

export const PersonalRegisterChefSlice = createSlice({
    name: "PersonalRegisterChef",
    initialState,
    reducers: {
        getDataRegisterChef: (state, action) => {
            state.dataRegisterChef = {...action.payload};
        },

    },
});

export const { getDataRegisterChef } = PersonalRegisterChefSlice.actions;

export default PersonalRegisterChefSlice.reducer;
