'use client';

import { useState } from "react";
import "@/styles/globals.css";
import Link from "next/link";
import { login } from "@/services/api";
import { useRouter } from 'next/navigation';




export default function LoginPage() {
    const [form, setForm] = useState({ userName: "", password: "" });
    const [message, setMessage] = useState("");
    const [usernameError, setusernameError] = useState("");
    const [passwordError, setpasswordError] = useState("");

   const router = useRouter();

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


        if (!form.password) {
            setpasswordError("Password is required.");
            isValid = false;
        } else {
            setpasswordError("");
        }


        if (!isValid) return;

        try {
            const res = await login(form);

            localStorage.setItem("username", res.username);
            localStorage.setItem("token", res.token);
            
            router.push('/dashboard');

        } catch (error: any) {

            setMessage(error.message || "Invalid username or password.");
        }

    }

    return (



        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-300 p-4">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-cyan-800">Login</h2>
                    {message && <p className="text-sm text-red-600 bg-red-300 mt-3 p-2 rounded-md" >{message}</p>}
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


                                onChange={e => setForm({ ...form, userName: e.target.value })}

                                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter user name"
                            />{usernameError && (
                                <div className="usernameError text-sm text-red-600 mt-2">{usernameError}</div>)}



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


                    </div>

                    <div className="mt-10">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-6 text-center">
                        Create an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}



