'use client';
import React from 'react';
import CollapsibleSidebar from "@/components/sidebar";
import { getAuthenticatedRole } from "@/utils/authenticate";

const users = [
  {
    UserId: 1,
    Username: 'adminuser',
    FullName: 'Admin User',
    Email: 'admin@example.com',
    Password: '********',
    CreatedAt: '2025-08-26 10:00:00',
    role: "admin",
  },
  {
    UserId: 2,
    Username: 'john_doe',
    FullName: 'John Doe',
    Email: 'john@example.com',
    Password: '********',
    CreatedAt: '2025-08-25 09:30:00',
    role: "user",
  },
];

const policies = [
  {
    Id: 101,
    UserId: 1,
    PolicyNumber: 'POL123456',
    Status: 'Active',
  },
  {
    Id: 102,
    UserId: 2,
    PolicyNumber: 'POL654321',
    Status: 'Pending',
  },
];

function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700">Unauthorized access</p>
    </div>
  );
}

export default function AdminPanelPage() {

const role = getAuthenticatedRole();
  if (role !== "admin") {
    return <Error404 />;
  }


  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-32 flex-shrink-0">
        <CollapsibleSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-2 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8 text-blue-700">Admin Panel</h1>

        <div className="mb-12 w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 border">UserId</th>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">FullName</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Password</th>
                  <th className="px-4 py-2 border">CreatedAt</th>
                  <th className="px-4 py-2 border">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.UserId} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border">{user.UserId}</td>
                    <td className="px-4 py-2 border">{user.Username}</td>
                    <td className="px-4 py-2 border">{user.FullName}</td>
                    <td className="px-4 py-2 border">{user.Email}</td>
                    <td className="px-4 py-2 border">{user.Password}</td>
                    <td className="px-4 py-2 border">{user.CreatedAt}</td>
                    <td className="px-4 py-2 border">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Policy Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-4 py-2 border">Id</th>
                  <th className="px-4 py-2 border">UserId</th>
                  <th className="px-4 py-2 border">PolicyNumber</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map(policy => (
                  <tr key={policy.Id} className="hover:bg-blue-50">
                    <td className="px-4 py-2 border">{policy.Id}</td>
                    <td className="px-4 py-2 border">{policy.UserId}</td>
                    <td className="px-4 py-2 border">{policy.PolicyNumber}</td>
                    <td className="px-4 py-2 border">{policy.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}