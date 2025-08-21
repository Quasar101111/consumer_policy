'use client';

import { useEffect } from 'react';
import {FallbackProps} from 'react-error-boundary';
const ErrorFallback:React.FC<FallbackProps>=({error, resetErrorBoundary})=>{
    

  useEffect(()=>{
      console.log("error",error);
    },[error]);
 
  return(
        <div role = "alert" className="p-4 bg-red-100 text-red-800 rounded">
          <p>Something went wrong.</p>
          <pre>{error.message} </pre>
          <button onClick={resetErrorBoundary}>Try Again</button>
        </div>
    );

   
}



export default  ErrorFallback;