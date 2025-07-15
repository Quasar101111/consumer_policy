'use client';

import { useState } from 'react';
import CollapsibleSidebar from "@/components/sidebar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { changePassword } from '@/services/api';
import { useRouter } from 'next/navigation';


export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmpasswordError] = useState('');


  const router  = useRouter();


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let isValid = true;
    setPasswordError('');
    setConfirmpasswordError('');
    setStatus('');

    // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!currentPassword) {
      setCurrentPasswordError(" Current Password is required.");
      isValid = false;}

    if (!newPassword) {
      setPasswordError("Password is required.");
      isValid = false;}
    // } else if (!passwordRegex.test(newPassword)) {
    //   setPasswordError(
    //     "Password must be at least 8 characters, include alphabet, number, and special character."
    //   );
    //   isValid = false;
    // }

    if (!confirmPassword) {
      setConfirmpasswordError("Confirm password is required.");
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmpasswordError("Passwords do not match.");
      isValid = false;
    }

    if (!isValid) return;
    const username = localStorage.getItem("username");
    if (!username) {
      setStatus("User not found.");

      return;
    }
      console.log(username);
    const result = await changePassword(username, currentPassword, newPassword);

   
  if (result.success) {
  setSuccess(true);
  setStatus(result.message);
  setCurrentPassword('');
  setNewPassword('');
  setConfirmPassword('');

  setTimeout(() => {
    router.push('/dashboard');
  }, 3000);
} else {
  setSuccess(false);
  setStatus(result.message);
}
}
  

  return (
   <div className="flex min-h-screen bg-gray-100">
  
  <div className="w-64">
    <CollapsibleSidebar />
  </div>

  <div className="flex flex-1 items-center justify-center px-12 py-10">
    <div className="relative w-full max-w-sm sm:max-w-md px-4">


     
      <div
        className={`bg-white p-10 rounded-lg shadow-lg w-full transition-all duration-500 ${
          success ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>
        {status && (
          <div className="text-sm text-red-600 text-center mb-4">{status}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
       
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full  px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             
            /> {currentPasswordError && (
              <div className="text-xs text-red-600 mt-1">{currentPasswordError}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
             
            />
            {passwordError && (
              <div className="text-xs text-red-600 mt-1">{passwordError}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              
            />
            {confirmpasswordError && (
              <div className="text-xs text-red-600 mt-1">{confirmpasswordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
          >
            Change Password
          </button>
        </form>
      </div>

      {success && (
        <div className="absolute inset-0 flex flex-col items-center justify-center animate-slide-up bg-white p-8 rounded-lg shadow-lg">
          <FontAwesomeIcon icon={faLock} className="text-4xl text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-green-600 text-center">
            Password changed successfully!
          </h3>
        </div>
      )}
    </div>
  </div>
</div>


  );
}