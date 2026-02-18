import { useEffect, useRef, useState } from "react";
import {
    BarChart3,
    Shield,
    Activity,
    Zap,
    TrendingUp,
    Lock,
    Globe,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PipelineVisualization } from "./PipelineVisualization";
import { LiveMetricsTicker } from "./LiveMetricsTicker";
import { RoleSelector } from "./RoleSelector";

export const LandingPage = () => {
    const [visibleCards, setVisibleCards] = useState<boolean[]>([
        false,
        false,
        false,
        false,
        false,
        false,
    ]);
    const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        featureRefs.current.forEach((ref, index) => {
            if (ref) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setVisibleCards((prev) => {
                                    const newState = [...prev];
                                    newState[index] = true;
                                    return newState;
                                });
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
                );

                observer.observe(ref);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, []);

    const features = [
        {
            icon: <BarChart3 className='h-6 w-6 text-blue-500' />,
            title: "Pipeline Monitoring",
            description:
                "Real-time tracking of ETL pipelines with success rates and performance metrics",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: <Shield className='h-6 w-6 text-green-500' />,
            title: "Data Freshness",
            description:
                "Monitor SLA compliance and ensure your data is always up to date",
            bgColor: "bg-green-500/10",
        },
        {
            icon: <Activity className='h-6 w-6 text-purple-500' />,
            title: "API Observability",
            description:
                "Track API latency, error rates, and throughput across all regions",
            bgColor: "bg-purple-500/10",
        },
        {
            icon: <TrendingUp className='h-6 w-6 text-orange-500' />,
            title: "Performance Analytics",
            description:
                "Deep insights into pipeline performance with historical trends and forecasting",
            bgColor: "bg-orange-500/10",
        },
        {
            icon: <Lock className='h-6 w-6 text-red-500' />,
            title: "Security & Compliance",
            description:
                "Enterprise-grade security with audit logs and compliance reporting",
            bgColor: "bg-red-500/10",
        },
        {
            icon: <Globe className='h-6 w-6 text-cyan-500' />,
            title: "Multi-Region Support",
            description:
                "Deploy and monitor pipelines across multiple cloud regions and providers",
            bgColor: "bg-cyan-500/10",
        },
    ];

    return (
        <PublicLayout>
            <div className='flex flex-col'>
                {/* Hero Section with Pipeline Visualization */}
                <section className='relative overflow-hidden'>
                    {/* Background Gradient */}
                    <div className='absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background' />

                    <div className='relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8'>
                        <div className='text-center mb-8'>
                            {/* Logo Icon */}
                            <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20'>
                                <Activity className='h-8 w-8 text-primary-foreground' />
                            </div>

                            {/* Title */}
                            <h1 className='mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
                                DataOps Analytics
                            </h1>

                            {/* Subtitle */}
                            <p className='mx-auto max-w-2xl text-lg text-muted-foreground mb-8'>
                                Enterprise-grade data pipeline monitoring and
                                analytics platform.
                                <br className='hidden sm:block' />
                                Track pipelines, monitor API performance, and
                                ensure data freshness.
                            </p>
                        </div>

                        {/* Interactive Pipeline Visualization */}
                        <div className='max-w-3xl mx-auto mb-8'>
                            <PipelineVisualization />
                        </div>

                        {/* Scroll Indicator */}
                        <div className='flex justify-center'>
                            <div className='flex flex-col items-center gap-2 text-muted-foreground animate-bounce'>
                                <span className='text-xs'>
                                    Explore the platform
                                </span>
                                <svg
                                    className='h-4 w-4'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M19 14l-7 7m0 0l-7-7m7 7V3'
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Metrics Ticker */}
                <LiveMetricsTicker />

                {/* Role Selector Section */}
                <section className='py-16 sm:py-20 bg-background'>
                    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <RoleSelector />
                    </div>
                </section>

                {/* Features Grid Section */}
                <section className='py-16 sm:py-20 bg-muted/30'>
                    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                        {/* Section Header */}
                        <div className='text-center mb-12'>
                            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4'>
                                <Zap className='h-4 w-4' />
                                <span>Platform Features</span>
                            </div>
                            <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-3'>
                                Everything you need for data operations
                            </h2>
                            <p className='text-muted-foreground max-w-xl mx-auto'>
                                Comprehensive monitoring and analytics tools
                                designed for modern data teams
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                            {features.map((feature, index) => (
                                <div
                                    key={feature.title}
                                    ref={(el) => {
                                        featureRefs.current[index] = el;
                                    }}
                                    className={`group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-500 hover:shadow-md hover:border-primary/20 ${
                                        visibleCards[index]
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div
                                        className={`mb-4 inline-flex rounded-xl ${feature.bgColor} p-3 transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className='mb-2 font-semibold text-card-foreground text-lg'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-sm text-muted-foreground leading-relaxed'>
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Section */}
                <section className='py-16 sm:py-20 bg-background'>
                    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                        <div className='rounded-2xl bg-linear-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 sm:p-12'>
                            <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-4'>
                                Ready to explore?
                            </h2>
                            <p className='text-muted-foreground mb-8 max-w-lg mx-auto'>
                                Dive into the dashboard and experience a modern
                                approach to data pipeline monitoring.
                            </p>
                            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                                <div className='text-sm text-muted-foreground'>
                                    No credentials required • Free to explore •
                                    Instant access
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
};
