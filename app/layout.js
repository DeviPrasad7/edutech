// layout.js
'use client';

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import { motion, AnimatePresence } from 'framer-motion'; // NEW
import { useModalStore } from './stores/useModalStore'; // NEW
import ChatWidget from './components/ChatWidget'; // NEW
import { IoCloseSharp as CloseIcon, IoChatbubbleEllipsesSharp as ChatIcon } from 'react-icons/io5';
import './globals.css';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/materials', label: 'Materials' },
  { href: '/assignments', label: 'Assignments' },
  { href: '/profile', label: 'Profile' },
];
// const ChatIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
//     </svg>
// );

// A dedicated NavLink component to clean up the mapping logic
function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'text-lime-400 bg-slate-700'
          : 'text-gray-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

export default function RootLayout({ children }) {
  const { isChatOpen, toggleChat } = useModalStore(); // NEW
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 font-sans text-gray-100 flex flex-col">
        {/* The Toaster component will render all our notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: '',
            style: {
              background: '#2c3e50', // A darker background
              color: '#ecf0f1',       // A lighter text color
            },
          }}
        />
        <ClerkProvider>
          <SignedIn>
            <header className="bg-slate-900 border-b border-gray-800 shadow-lg sticky top-0 z-40">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <Link
                      href="/"
                      className="text-2xl font-extrabold tracking-wide text-indigo-400"
                    >
                      EduSphere
                    </Link>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navItems.map(({ href, label }) => (
                          <NavLink key={href} href={href}>{label}</NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <UserButton afterSignOutUrl="/sign-in" />
                  </div>
                  {/* Mobile menu button */}
                  <div className="-mr-2 flex md:hidden">
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      type="button"
                      className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
                      aria-controls="mobile-menu"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Open main menu</span>
                      {/* Icon for menu open/close */}
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        {isMobileMenuOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </nav>

              {/* Mobile menu, show/hide based on menu state. */}
              {isMobileMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map(({ href, label }) => (
                      <NavLink key={href} href={href}>{label}</NavLink>
                    ))}
                  </div>
                   <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-5">
                       <UserButton afterSignOutUrl="/sign-in" />
                       <span className="ml-3 text-base font-medium text-white">Your Profile</span>
                    </div>
                  </div>
                </div>
              )}
            </header>

            <main className="flex-grow">{children}</main>

            <footer className="bg-slate-900 text-gray-500 p-6 text-center text-sm border-t border-gray-800">
              &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
            </footer>
          </SignedIn>

          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        <div className="fixed bottom-6 right-6 z-50">
           {/* The Chat Window */}
           <AnimatePresence>
             {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="mb-4"
                >
                    <ChatWidget />
                </motion.div>
             )}
           </AnimatePresence>

           {/* The Floating Action Button (FAB) to toggle the chat */}
           <motion.button
              onClick={toggleChat}
              className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-300"
              aria-label="Toggle chat"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
           >
              {isChatOpen ? <CloseIcon /> : <ChatIcon />}
           </motion.button>
        </div>
        </ClerkProvider>
      </body>
    </html>
  );
}