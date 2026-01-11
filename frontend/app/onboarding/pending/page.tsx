"use client";

import React from 'react';

const PendingApprovalPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="bg-white p-8 rounded-xl shadow max-w-md text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-100 p-4">
            <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">You're submitted — approval pending</h2>
        <p className="text-sm text-gray-600">Thanks for registering as a vendor. Your application is under review. We'll notify you via the email you provided when your account is ready!</p>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
