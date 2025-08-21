//app/regiswithYup.tsx


'use client';

import { useState } from "react";
import "@/styles/globals.css";
import{checkUsernameAvailability,register} from "@/services/api";
import Link from "next/link";

import {useForm} from  "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {userValues,userSchema} from "@/utils/userValidations"

export default function RegisterPage() {
    const [message, setMessage] = useState("");
    const [usernameError, setusernameError] = useState("");
    const [usernameSuccess, setusernameSuccess] = useState("");
  
    const { register:formRegister,
        handleSubmit,formState:{errors},watch
     }= useForm<userValues>({resolver:yupResolver(userSchema),
     mode: "onChange",
    //  revalidateMode:"onChange",
});
    console.log("inputval",formRegister);
    console.log(errors);
     const userNamevalue = watch("userName");
    const checkUserName = async (userNamevalue: string) => {
       if(errors.userName){
        setusernameSuccess("");
        return;

       }
        try {
            
            const res = await checkUsernameAvailability(userNamevalue);
            if (res === "available") {
        setusernameSuccess("Username is available.");
        setusernameError("");
    } else if (res === "taken") {
        setusernameError("Username is already taken.");
        setusernameSuccess("");
    } else {
        setusernameError("Error checking username.");
        setusernameSuccess("");
    }
        } catch {
            setusernameError("Error checking username.");
             setusernameSuccess("");
        }
    };

    const onSubmit = async(data:userValues)=>{

    if (usernameError) {
    setMessage("Please choose another username before submitting.");
    return;
  }

      console.log(data);
  const payload = {
    FullName: data.userName,      
    UserName: data.userName,      
    Email: data.email,
    Password: data.password,
  };
       try {
     await register(payload); 
  
  } catch (err: any) {
    setMessage(err.message || "Registration failed.");
  }

    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-300 p-4">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-blue-800">Login</h2>
                    {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">

                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                User Name
                            </label>
                            <input
                                id="userName"
                                
                                type="userName"
                                {...formRegister("userName")}

                                onKeyUp={e => checkUserName(e.currentTarget.value)}
                                
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter user name"
                            />{usernameError && (
                                <div className="usernameError text-sm text-red-600 mt-2">{usernameError}</div>)}

                                  {usernameSuccess && (
                                <div className="usernameSuccess text-sm text-green-600 mt-2">{usernameSuccess}</div>)}
                               {errors.userName && (
                                <div className="passwordError text-sm text-red-600 mt-2">{errors.userName.message}</div>)}

                       
                        </div>
                      

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Id
                            </label>
                            <input
                                id="email"
                                
                                type="text"
                                {...formRegister("email")}
                               
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter email"
                            />{errors.email && (
                                <div className="emailError text-sm text-red-600 mt-2">{errors.email.message}</div>)}

                                
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                
                                type="password"
                               {...formRegister("password")}
                                
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                            />
                            {errors.password && (
                                <div className="passwordError text-sm text-red-600 mt-2">{errors.password.message}</div>)}

                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                               
                                type="password"
                               {...formRegister("confirmPassword")}
                              
                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter confirm password"
                            />{errors.confirmPassword && (
                                <div className="confirmpasswordError text-sm text-red-600 mt-2">{errors.confirmPassword.message}</div>)}
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Create an account
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-6 text-center">
                        Already have an account?{' '}
                        <Link href="/" className="text-blue-600 hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}


