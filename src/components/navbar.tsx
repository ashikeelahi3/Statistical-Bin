"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Dark mode state and logic
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userPref, setUserPref] = useState<boolean>(false);

  // On mount, check for saved preference or system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
        setUserPref(true);
      } else {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mql.matches ? 'dark' : 'light');
        setUserPref(false);
      }
    }
  }, []);

  // Listen for system changes only if no user preference
  useEffect(() => {
    if (typeof window !== 'undefined' && !userPref) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mql.addEventListener('change', updateTheme);
      return () => mql.removeEventListener('change', updateTheme);
    }
  }, [userPref]);

  // Effect to update the root class on theme change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Toggle handler
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setUserPref(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Practical', path: '/practical' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[var(--background)] text-[var(--text-primary)] shadow-sm border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-[var(--accent)]">Statistical Bin</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' 
                        : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] hover:text-[var(--accent)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <SignedOut>
              <SignInButton>
                <button className="px-3 py-1.5 text-sm font-medium border border-[var(--accent)] text-[var(--accent)] rounded-md hover:bg-[var(--card-bg)] hover:text-[var(--accent)]">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-3 py-1.5 text-sm font-medium bg-[var(--accent)] text-[var(--accent-foreground)] rounded-md hover:bg-blue-700">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            {/* Dark mode toggle button */}
            <button
              className="ml-2 bg-[var(--card-bg)] text-[var(--text-primary)] px-3 py-2 rounded shadow hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors border border-[var(--border-color)]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={handleThemeToggle}
            >
              {theme === 'dark' ? (
                <span className="flex items-center"><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>Light</span>
              ) : (
                <span className="flex items-center"><svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>Dark</span>
              )}
            </button>
            
            <div className="flex items-center sm:hidden ml-3">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent)]"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' 
                    : 'hover:bg-[var(--card-bg)] text-[var(--text-primary)] hover:text-[var(--accent)]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}