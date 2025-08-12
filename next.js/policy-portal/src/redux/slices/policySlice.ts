import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ViewPolicyState = {
  policies: string[];
  selectedPolicy: string | null;
  policyDetails: Record<any , null>;
};

const initialState: ViewPolicyState = {
  policies: [],
  selectedPolicy: null,
  policyDetails: {},
};

const viewPolicySlice = createSlice({
  name: "viewPolicy",
  initialState,
  reducers: {
    setPolicies: (state, action: PayloadAction<string[]>) => {
      state.policies = action.payload;
    },
    setSelectedPolicy: (state, action: PayloadAction<string | null>) => {
      state.selectedPolicy = action.payload;
    },
    setPolicyDetails: (state, action: PayloadAction<{policyNumber:string;details:any}>) => {
     const {policyNumber,details} = action.payload;
     state.policyDetails[policyNumber]= details;
     

    },
    clearPolicy: (state) => {
      state.selectedPolicy = null;
     
    }
  },
});

export const {
  setPolicies,
  setSelectedPolicy,
  setPolicyDetails,
  clearPolicy
} = viewPolicySlice.actions;

export default viewPolicySlice.reducer;
