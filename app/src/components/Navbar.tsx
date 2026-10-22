'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="glass-elevated sticky top-0 z-50 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center gap-2 min-h-16">
          <Link 
            href="/" 
            className="min-w-0 text-sm sm:text-xl font-bold text-accent-blue hover:text-primary-400 transition-all duration-200 font-code tracking-tight"
          >
            &lt;/Problem Recommender&gt;
          </Link>

          <button
            type="button"
            className="md:hidden min-h-11 min-w-11 rounded border border-border text-text"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(open => !open)}
          >
            ☰
          </button>
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  href="/" 
                  className="text-textSecondary hover:text-accent-cyan transition-all duration-200 font-medium relative group"
                >
                  Home
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  href="/profile" 
                  className="text-textSecondary hover:text-accent-cyan transition-all duration-200 font-medium relative group"
                >
                  Profile
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  href="/settings" 
                  className="text-textSecondary hover:text-accent-cyan transition-all duration-200 font-medium relative group"
                >
                  Settings
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <Link 
                  href="/about" 
                  className="text-textSecondary hover:text-accent-cyan transition-all duration-200 font-medium relative group"
                >
                  About
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-textSecondary hover:text-accent-red transition-all duration-200 font-medium px-4 py-2 rounded-lg hover:bg-accent-red/10 border border-transparent hover:border-accent-red/30"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        {menuOpen && (
          <div id="mobile-navigation" className="md:hidden flex flex-col gap-1 pb-3" onClick={() => setMenuOpen(false)}>
            {user ? (
              <>
                <Link href="/" className="px-3 py-3 text-textSecondary">Home</Link>
                <Link href="/profile" className="px-3 py-3 text-textSecondary">Profile</Link>
                <Link href="/settings" className="px-3 py-3 text-textSecondary">Settings</Link>
                <Link href="/about" className="px-3 py-3 text-textSecondary">About</Link>
                <button onClick={handleSignOut} className="px-3 py-3 text-left text-textSecondary">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-3 text-textSecondary">Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
