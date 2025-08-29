
//deletepolicyCom.tsx
import DeleteModal from "@/components/modalDelete";


import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from "next/navigation";

type DeletePolicyProps = {

  onConfirm: () => void;
 
  
};

export default function DeletePolicy({onConfirm }: DeletePolicyProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const {open,Id}= useAppSelector((state)=>state.deleteModal);

  
  return (
    <DeleteModal  onConfirm={onConfirm}  >
      <p >Are you sure you want to delete this policy?  </p>
    </DeleteModal>
  );
}
