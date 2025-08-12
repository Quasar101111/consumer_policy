
import Modal from "@/components/modal";
import React from "react";

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeDeleteModal, confirmDelete, openDeleteModal } from '@/redux/slices/deletemodalSlice';



type DeleteModalProps = {
  // open: boolean;
  // onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
};

export default function DeleteModal({  children ,onConfirm}: DeleteModalProps) {
    const {open}= useAppSelector((state)=>state.deleteModal);
    const dispatch = useAppDispatch();
    const onClose= ()=>{
    dispatch(closeDeleteModal());
    }
    
  return (
    <Modal open={open} onClose={onClose} className="confirm delete">
      <div className="text-center">
        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" fill="none" viewBox="0 0 20 20">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        {children}
        <button 
          onClick={onConfirm}
          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
        >
          Yes, I'm sure
        </button>
        <button
          onClick={onClose}
          className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          No, cancel
        </button>
      </div>
    </Modal>
  );
}
