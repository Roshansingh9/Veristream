import {
    ShieldCheckIcon,
    DatabaseIcon,
    ClockIcon
} from 'lucide-react';

export default function FeaturesSection() {
    const features = [
        {
            icon: ShieldCheckIcon,
            title: 'Instant Verification',
            description: 'Detect potential misinformation within seconds of content broadcast.'
        },
        {
            icon: DatabaseIcon,
            title: 'Comprehensive Analysis',
            description: 'Cross-reference multiple fact-checking databases for accurate results.'
        },
        {
            icon: ClockIcon,
            title: 'Real-Time Monitoring',
            description: 'Continuous analysis of live streams and recorded content.'
        }
    ];

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        How VeriStream Protects Information
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        {features.map((feature, index) => (
                            <div key={index} className="relative">
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                                        {feature.title}
                                    </p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
