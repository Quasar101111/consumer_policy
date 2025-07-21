

import DeleteModal from "@/components/modalDelete";


import React from "react";

type DeletePolicyProps = {
  open: boolean;
  onClose: () => void;
};

export default function DeletePolicy({ open, onClose }: DeletePolicyProps) {

  const handleConfirmDelete = () => {
   
  };

  return (
    <DeleteModal open={open} onClose={onClose} onConfirm={handleConfirmDelete}>
      <p>Are you sure you want to delete this policy?</p>
    </DeleteModal>
  );
}
