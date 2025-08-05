'use client'
import { useSession } from "next-auth/react";

import  {store} from "@/redux/store";
import { Provider } from 'react-redux'

 
import { SessionProvider } from 'next-auth/react'

//  const { data: session, status } = useSession();

export default function Providers({ children }: { children: React.ReactNode }) {
    
  return (
     <Provider store={store}>
  <SessionProvider>{children}</SessionProvider> </Provider>)
}