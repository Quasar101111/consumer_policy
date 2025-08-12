

import { encode } from "punycode";
import { json } from "stream/consumers";
import {authFetch,authFetch1} from "./authFetch";
import { signIn } from "next-auth/react";

// };

const baseUrl = 'https://localhost:7225/api/User';
const policyUrl = 'https://localhost:7225/api/Policy';
// const policyUrl = process.env.DATA_SOURCE_POLICY_URL ;
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error(`Backend error ${response.status}:`, errorBody);
    throw new Error(errorBody.message || 'Something went wrong. Please try again later.');
  }
  return ;
}


export async function checkUsernameAvailability(userName: string) {
//  const apiUrl = getUserApiUrl();
  const encodedUsername = encodeURIComponent(userName);
  const response = await fetch(`${baseUrl}/check-username/${encodedUsername}`);
  console.log(response);
   if (response.ok) {
      return "available";
    }
    if (response.status === 409) {
      return "taken";
    }
      return handleResponse(response);


}

export async function register(userData: any) {
  const response = await fetch(`${baseUrl}/register`,
     {method :'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(userData) } );
     if (!response.ok) {
      const errorMessage = await response.text(); 
      throw new Error(errorMessage || "Registration failed.");
     }
     return await response.json();
  
  
  }

export async function login(userData: { username: string; password: string }) {
  const response = await signIn("credentials", {
    redirect: false,
    username: userData.username,
    password: userData.password,
     callbackUrl: '/',

  });


  if (!response || !response.ok) {
    throw new Error("Login failed.");
  }

  return response;
}

export async function totalPremium(userName: string){
    const encodedUsername = encodeURIComponent(userName);
    const response = await authFetch(`${policyUrl}/totalpremium/${encodedUsername}`);
    
    if(!response.ok){
        return 0;
    }

    return await response.json();
}



export async function viewPolicyNumbers(userName:string){
    const encodedUsername = encodeURIComponent(userName);
    const response = await authFetch(`${policyUrl}/viewpolicyno/${encodedUsername}`);
    if (!response.ok) {
        throw new Error(`Error fetching policy numbers: ${response.statusText}`);
    }        
        

    return await response.json();
}  

export async function changePassword(userName: string, currentPassword: string, newPassword: string) {
  try {
    const response = await fetch(`${baseUrl}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Username: userName,
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to change password. Please try again later.',
      };
    }

    return {
      success: true,
      message: data.message || 'Password changed successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
}

export async function policyNumbersWithStatus(userName: string) {
  const encodedUsername = encodeURIComponent(userName);
  const response = await fetch(`${policyUrl}/policynostatus/${encodedUsername}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching policy numbers with status: ${response.statusText}`);
  }
  
  return await response.json();
} 

export async function togglePolicyStatus(policyId: number){
  const response = await fetch(`${policyUrl}/togglestatus?id=${policyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Error toggling policy status: ${response.statusText}`);
  }

  return await response.json();
}

export async function deletePolicy(policyId: number) {
  const response = await fetch(`${policyUrl}/deletepolicy/${policyId}`, {
    method: 'DELETE',
   
  })
  console.log(response);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to delete policy. Please try again later.');
  }
  return await response.json();
}

export async function findPolicy(policyData: { policyNumber: string; chassisNumber: string }) {
  const response = await fetch(`${policyUrl}/findpolicy/${policyData.policyNumber}/${policyData.chassisNumber}`, {
    method: 'GET',
  });

  const data= await response.json();
  if (!response.ok || data.message) {
    const errorBody = await response.json().catch(() => ({}));
   
    throw new Error(data.message || 'Failed to find policy. Please try again later.');
    
  }else{
     return await data; 
  }
 
}

export async function addPolicy( policyNumber: string, username: string ) {
   const encodedUsername = encodeURIComponent(username);
  const response = await fetch(`${policyUrl}/addpolicy/${policyNumber}/${encodedUsername}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
   
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || 'Failed to add policy. Please try again later.');
  }

  return await response.json();
}


export async function policyDetails(policyNumber: string) {
 const response = await fetch(`${policyUrl}/policydetails/${policyNumber}`, {
    method: 'GET',});
    if(!response.ok){
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message);
    }
    return response.json();

}