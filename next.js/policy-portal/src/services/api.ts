
// export const getUserApiUrl= ()=>{
//     return process.env.NEXT_PUBLIC_DATA_SOURCE_USER_URL;

import { encode } from "punycode";
import { json } from "stream/consumers";

// };

const baseUrl = 'https://localhost:7225/api/User';
const policyUrl = 'https://localhost:7225/api/Policy';

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

export async function login(userData: any){
    const response= await fetch(`${baseUrl}/login`,
        {method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify(userData), } )
    
    
     if (!response.ok) {
      const errorMessage = await response.text(); 
      throw new Error(errorMessage || "Login failed.");
      return "Login failed.";
    }
    return await response.json();

}

export async function totalPremium(userName: string){
    const encodedUsername = encodeURIComponent(userName);
    const response = await fetch(`${policyUrl}/totalpremium/${encodedUsername}`);
    if(!response.ok){
        return 0;
    }
    return await response.json();
}



export async function viewPolicyNumbers(userName:string){
    const encodedUsername = encodeURIComponent(userName);
    const response = await fetch(`${policyUrl}/viewpolicyno/${encodedUsername}`);
    if (!response.ok) {
        throw new Error(`Error fetching policy numbers: ${response.statusText}`);
        return [];
        
    }
    return await response.json();
}  