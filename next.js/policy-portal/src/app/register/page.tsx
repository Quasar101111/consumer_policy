'use client';

import { useState } from "react";
import "@/styles/globals.css";
import{checkUsernameAvailability,register} from "@/services/api";
import Link from "next/link";


export default function RegisterPage() {
    const [form, setForm] = useState({ userName: "", email: "", password: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [usernameError, setusernameError] = useState("");
    const [usernameSuccess, setusernameSuccess] = useState("");
    const [emailError, setemailError] = useState("");
    const [passwordError, setpasswordError] = useState("");
    const [confirmpasswordError, setconfirmpasswordError] = useState("");



    const checkUserName = async (username: string) => {

        const userRegex = /^[^\s]{3,16}$/;
        if (!userRegex.test(form.userName)) {
            setusernameError(" include atleast 3 characters and should not contain whitespace");
            setusernameSuccess("");
            return;
        }
        
        

       
        try {
            
              const res = await checkUsernameAvailability(form.userName);
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let isValid = true;


        if (!form.userName.trim()) {
            setusernameError("Username is required.");
            isValid = false;
        }
        else {
            setusernameError("");
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!form.email.trim()) {
            setemailError("Email is required.");
            isValid = false;
        } else if (!emailRegex.test(form.email)) {
            setemailError("Invalid email format.");
            isValid = false;
        } else {
            setemailError("");
        }


        const passwordRegex =
            /^(?=.*[a-z,A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!form.password) {
            setpasswordError("Password is required.");
            isValid = false;
        } else if (!passwordRegex.test(form.password)) {
            setpasswordError(
                "Password must be at least 8 characters, include alphabet, number, and special character."
            );
            isValid = false;
        } else {
            setpasswordError("");
        }

        if (!form.confirmPassword) {
            setconfirmpasswordError("Confirm password is required.");
            isValid = false;
        } else if (form.password !== form.confirmPassword) {
            setconfirmpasswordError("Passwords do not match.");
            isValid = false;
        } else {
            setconfirmpasswordError("");
        }
        if (!isValid) return;
        const result = await register(form);

        // const res = await fetch("/api/register", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(form),
        // });
        if (result.ok) setMessage("Registration successful!");
        else setMessage("Registration failed.");
    }

    return (



        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-300 p-4">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-blue-800">Login</h2>
                    {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">

                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                                User Name
                            </label>
                            <input
                                id="userName"
                                name="userName"
                                type="userName"
                                value={form.userName}

                                onKeyUp={e => checkUserName(e.currentTarget.value)}
                                onChange={e => setForm({ ...form, userName: e.target.value })}

                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter user name"
                            />{usernameError && (
                                <div className="usernameError text-sm text-red-600 mt-2">{usernameError}</div>)}

                                  {usernameSuccess && (
                                <div className="usernameSuccess text-sm text-green-600 mt-2">{usernameSuccess}</div>)}
                       
                        </div>
                      

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Id
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}

                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter email"
                            />{emailError && (
                                <div className="emailError text-sm text-red-600 mt-2">{emailError}</div>)}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}

                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                            />
                            {passwordError && (
                                <div className="passwordError text-sm text-red-600 mt-2">{passwordError}</div>)}

                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}

                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter confirm password"
                            />{confirmpasswordError && (
                                <div className="confirmpasswordError text-sm text-red-600 mt-2">{confirmpasswordError}</div>)}
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


