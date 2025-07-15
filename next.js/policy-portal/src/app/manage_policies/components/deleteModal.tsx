import Modal from "@/components/modal";

export default function DeleteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} className="confirm delete" >
      <div className="text-center">
        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <h3 className="mb-5 text-lg font-normal text-gray-500">Are you sure you want to delete this policy details?</h3>
        <button
          onClick={onClose}
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