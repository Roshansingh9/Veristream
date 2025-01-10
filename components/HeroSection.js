"use client"

import { useRouter } from 'next/navigation'
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';



export default function HeroSection() {




    const router = useRouter();

    const handleAnalyzeClick = () => {
        console.log("Attempting to navigate to /analyze");
        router.push('/analyze');
    }

    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Real-Time Misinformation</span>{' '}
                                <span className="block text-blue-600 xl:inline">Detection Platform</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Instantly verify and flag potential misinformation in live broadcasts and recorded content.
                            </p>

                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <button
                                        onClick={handleAnalyzeClick}
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                    >
                                        Analyze Content
                                    </button>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link href="/how-it-works" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                        Learn More
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center">
                                    <CheckIcon className="h-6 w-6 text-green-500 mr-2" />
                                    <span className="text-gray-600">AI-Powered Verification</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    <CheckIcon className="h-6 w-6 text-green-500 mr-2" />
                                    <span className="text-gray-600">Real-Time Analysis</span>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Illustration */}
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                {/* <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                    src="/api/placeholder/800/600"
                    alt="VeriStream Platform Illustration"
                /> */}
            </div>
        </div>
    );
}