"use client"

import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"; // Updated icon imports

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-{#1f2937} shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            VeriStream
                        </Link>
                    </div>
                    <div className="hidden sm:flex space-x-8">
                        <Link href="/" className="text-white-900 hover:text-blue-600 px-3 py-2 font-medium">
                            Home
                        </Link>
                        <Link href="/how-it-works" className="text-white-900 hover:text-blue-600 px-3 py-2 font-medium">
                            How It Works
                        </Link>
                        <Link href="/analyze" className="text-white-900 hover:text-blue-600 px-3 py-2 font-medium">
                            Analyze Content
                        </Link>
                    </div>
                    <div className="sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500"
                            aria-label="Menu"
                        >
                            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200">
                    <Link href="/" className="block text-gray-900 hover:text-blue-600 px-3 py-2 font-medium">
                        Home
                    </Link>
                    <Link href="/how-it-works" className="block text-gray-900 hover:text-blue-600 px-3 py-2 font-medium">
                        How It Works
                    </Link>
                    <Link href="/analyze" className="block text-gray-900 hover:text-blue-600 px-3 py-2 font-medium">
                        Analyze Content
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;