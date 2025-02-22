//components/Footer.js

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-2xl font-bold text-white">VeriStream</h2>
                        <p className="mt-2 text-gray-400">
                            Real-Time Misinformation Detection Platform
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                Platform
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link href="/analyze" className="text-base text-gray-300 hover:text-white">Analyze Content</Link></li>
                                <li><Link href="/how-it-works" className="text-base text-gray-300 hover:text-white">How It Works</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                Resources
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li><Link href="/faq" className="text-base text-gray-300 hover:text-white">FAQ</Link></li>
                                <li><Link href="/support" className="text-base text-gray-300 hover:text-white">Support</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}