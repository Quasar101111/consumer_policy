
import { encode } from "punycode";
import { json } from "stream/consumers";
import {authFetch1} from "./authFetchServer";
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
export async function totalPremium(userName: string){
    const encodedUsername = encodeURIComponent(userName);
    const response = await authFetch1(`${policyUrl}/totalpremium/${encodedUsername}`);
    
    if(!response.ok){
        return 0;
    }

    return await response.json();
}



export async function viewPolicyNumbers(userName:string){
    const encodedUsername = encodeURIComponent(userName);
    const response = await authFetch1(`${policyUrl}/viewpolicyno/${encodedUsername}`);
    if (!response.ok) {
        throw new Error(`Error fetching policy numbers: ${response.statusText}`);
    }        
        

    return await response.json();
}  