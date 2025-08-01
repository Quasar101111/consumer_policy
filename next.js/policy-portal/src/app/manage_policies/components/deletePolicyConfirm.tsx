

import DeleteModal from "@/components/modalDelete";
import { deletePolicy as dp } from "@/services/api";


import React from "react";

type DeletePolicyProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  policyId: number;
  
};

export default function DeletePolicy({ open, onClose, onConfirm, policyId }: DeletePolicyProps) {

  
  return (
    <DeleteModal open={open} onClose={onClose} onConfirm={onConfirm}>
      <p >Are you sure you want to delete this policy?</p>
    </DeleteModal>
  );
}
