'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Navbar = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            LeetCode Recommender
          </Link>
          
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                <Link href="/settings" className="text-gray-700 hover:text-blue-600">
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;