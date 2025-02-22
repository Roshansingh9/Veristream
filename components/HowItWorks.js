//components/HowItWorks.js
import { ArrowRightIcon } from 'lucide-react';

export default function HowItWorksSection() {
    const steps = [
        {
            number: '01',
            title: 'Upload Content',
            description: 'Upload your video or provide a live stream link.'
        },
        {
            number: '02',
            title: 'AI Analysis',
            description: 'Our AI processes the content and checks for potential misinformation.'
        },
        {
            number: '03',
            title: 'Instant Results',
            description: 'Receive a comprehensive report with verification status.'
        }
    ];

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
                        Workflow
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        How VeriStream Works
                    </p>
                </div>

                <div className="mt-10 flex flex-col md:flex-row justify-between items-center">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center max-w-xs">
                            <div className="text-6xl font-bold text-blue-100 mb-4">{step.number}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-gray-500">{step.description}</p>
                            {index < steps.length - 1 && (
                                <ArrowRightIcon className="mt-4 text-blue-500" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}