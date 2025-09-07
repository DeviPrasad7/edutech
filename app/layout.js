'use client';

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
  SignOutButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/materials', label: 'Materials' },
  { href: '/assignments', label: 'Assignments' },
  { href: '/profile', label: 'Profile' },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-800 to-indigo-900 font-sans text-white flex flex-col">
        <ClerkProvider>
          {/* If user is signed in, show navbar, content, and footer */}
          <SignedIn>
            <header className="bg-gradient-to-r from-cyan-700 via-blue-700 to-indigo-700 shadow-lg">
              <nav className="max-w-7xl mx-auto flex items-center justify-between p-5">
                <Link
                  href="/"
                  className="text-3xl font-extrabold tracking-wide hover:text-yellow-300 transition"
                >
                  EduTech
                </Link>
                <div className="hidden md:flex items-center space-x-6 text-lg">
                  {navItems.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`hover:text-yellow-400 transition font-medium ${
                        pathname === href
                          ? 'text-yellow-400 border-b-2 border-yellow-400'
                          : 'text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                  <UserButton afterSignOutUrl="/sign-in" />
                  <SignOutButton>
                    <button className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      Logout
                    </button>
                  </SignOutButton>
                </div>
                {/* Mobile avatar */}
                <div className="flex md:hidden items-center space-x-4">
                  <UserButton afterSignOutUrl="/sign-in" />
                </div>
              </nav>
            </header>

            <main className="flex-grow max-w-7xl mx-auto p-8">{children}</main>

            <footer className="bg-cyan-800 text-cyan-300 p-4 text-center text-sm">
              &copy; {new Date().getFullYear()} EduTech. All rights reserved.
            </footer>
          </SignedIn>

          {/* If user is signed out, redirect to /sign-in (show standalone login/signup pages) */}
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </ClerkProvider>
      </body>
    </html>
  );
}
