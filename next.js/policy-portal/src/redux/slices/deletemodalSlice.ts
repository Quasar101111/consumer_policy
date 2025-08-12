import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DeleteModalState = {
    open: boolean;
      Id: string | null;
      confirmDelete: boolean;
};

const initialState: DeleteModalState={
    open : false,
   Id: null,
   confirmDelete :false,

};

const deleteModalSlice = createSlice({
    name: "deleteModal",
    initialState,
    reducers:{
        openDeleteModal: (state,action:PayloadAction<{policyId:string}>)=>
        {
            state.open = true;
            state.Id= action.payload.policyId;
        },
        closeDeleteModal: (state)=>{
            state.open = false;
            state.Id = null;   
        },
        confirmDelete:(state)=>{
            state.open = false;
            state.confirmDelete = true;
        }
    },

});
export const {openDeleteModal, closeDeleteModal,confirmDelete}= deleteModalSlice.actions;
export default deleteModalSlice.reducer;