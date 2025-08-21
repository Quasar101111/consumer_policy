//manage_policies/page.tsx
'use client';

import { useState, useEffect,useMemo,useCallback } from 'react';
import CollapsibleSidebar from "@/components/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import PolicyButtons from './components/policyButtons';
import DeletePolicy from './components/deletePolicyCom';
import { policyNumbersWithStatus, togglePolicyStatus,deletePolicy } from '@/services/api';

import { ToastContainer,toast } from 'react-toastify';
import Link from 'next/link';
import { getAuthenticatedUsername } from '@/utils/authenticate';
import { useSession } from 'next-auth/react';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeDeleteModal, openDeleteModal,confirmDelete } from '@/redux/slices/deletemodalSlice';
export default  function ManagePolicies() {


  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const {open,Id}= useAppSelector((state)=>state.deleteModal);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const [policies, setPolicies] = useState<{ policyId: number, policyNumber: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
 const [policyId, setpolicyId] = useState(0);
  // const[confirmDelete, setconfirmDelete]= useState(false);
    const { data: session ,status:sessionStatus } = useSession();
   

           
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
          const username = await getAuthenticatedUsername(sessionStatus,session,);
        if (!username) return;
        console.log(username);
        
        const data = await policyNumbersWithStatus(username);
        setPolicies(data);

      } finally {

        setLoading(false);
      }
    };
    fetchPolicies();
  }, [session,sessionStatus]);
  console.log(policies);
  
  const handleDelete = useCallback((policyId:number) => {
   const Id= policyId.toString();
    dispatch(openDeleteModal({policyId:Id}));

  },[dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeDeleteModal());
  }, [dispatch]);

  const handleConfirmDelete = useCallback(async () => {
    dispatch(confirmDelete());
   const policyId = Number(Id);
    console.log(policyId);



 
  const result = await deletePolicy(policyId);
  toast.error(result,result.message);
  setPolicies(prev=>prev.filter(p=> p.policyId !==policyId))
 
  },[dispatch,Id]);


 const handleToggle = (policyId: number) => {
  const currentPolicy = policies.find(p => p.policyId === policyId);
  const isActivating = currentPolicy?.status === 'Inactive';

  const togglePromise = togglePolicyStatus(policyId).then(() => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.policyId === policyId
          ? { ...p, status: isActivating ? 'Active' : 'Inactive' }
          : p
      )
    );
  });

  toast.promise(togglePromise, {
    pending: `${isActivating ? 'Activating' : 'Deactivating'} policy...`,
    success: `Policy ${isActivating ? 'activated' : 'deactivated'}!`,
    error: 'Failed to update policy status',
  });



};
const policyCount =useMemo(()=>policies.length,[policies]);



  return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="w-64">
        <CollapsibleSidebar />
      </div>
      <section className="container  mx-auto  px-12 py-10">
        <div className="flex items-center gap-x-3 mx-4 ">
          <h2 className="text-lg font-medium text-gray-800">My policies</h2>
          <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full text-center">
            {policyCount} policies
          </span>

          <div className=" w-full flex justify-end mb-4  "><Link href="/add_policy" >
  <button
    type="button"
    className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4
      focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2
      mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  >
    <FontAwesomeIcon icon={faPlus} /> Add policy
  </button></Link>
</div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500">
                        <div className="flex items-center gap-x-3">
                          <input type="checkbox" className="text-blue-500 border-gray-300 rounded" />
                          <span>Policy Number</span>
                        </div>
                      </th>
                      <th className="px-12 py-3.5 text-sm font-normal text-left text-gray-500">
                        <button className="flex items-center gap-x-2">
                          <span>Status</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                          </svg>
                        </button>
                      </th>

                      <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500">Actions</th>

                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-400">Loading...</td>
                      </tr>
                    ) : policyCount === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-gray-400">No policies found.</td>
                      </tr>
                    ) : (
                      policies.map((policy, idx) => (
                        <tr key={policy.policyNumber}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                            <div className="inline-flex items-center gap-x-3">
                              <input type="checkbox" className="text-blue-500 border-gray-300 rounded" />
                              <div className="flex items-center gap-x-2">
                                <div>
                                  <h2 className="font-medium text-gray-800">{policy.policyNumber}</h2>
                                </div>
                               
                              </div>
                            </div>
                          </td>
                          <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap" >
                            <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${policy.status === 'Active'
                                ? 'bg-emerald-100/60'
                                : 'bg-red-100/60'
                              }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${policy.status === 'Active'
                                  ? 'bg-emerald-500'
                                  : 'bg-red-500'
                                }`}></span>
                              <h2 className={`text-sm font-normal ${policy.status === 'Active'
                                  ? 'text-emerald-600'
                                  : 'text-red-600'
                                }`}>{policy.status}</h2>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-6">
                              <PolicyButtons status={policy.status as 'Active' | 'Inactive'} 
                              onDelete={()=>handleDelete(policy.policyId)} onToggle={() => handleToggle(policy.policyId)}
                                policyId={policy.policyId} />
                               </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
<DeletePolicy    onConfirm={() => handleConfirmDelete()}    />
                           

<ToastContainer />

    </div>
  );
}