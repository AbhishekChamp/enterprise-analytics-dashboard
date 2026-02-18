import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Database, LineChart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Role {
    id: "engineer" | "analyst";
    title: string;
    icon: React.ReactNode;
    description: string;
    features: string[];
    gradient: string;
    hoverGradient: string;
    route: string;
}

export function RoleSelector() {
    const navigate = useNavigate();
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const roles: Role[] = [
        {
            id: "engineer",
            title: "Data Engineer",
            icon: <Database className='h-8 w-8' />,
            description:
                "Build and maintain robust data pipelines with real-time monitoring and alerting.",
            features: [
                "Pipeline Orchestration",
                "ETL Monitoring",
                "Error Tracking",
                "Performance Optimization",
            ],
            gradient: "from-blue-500/10 to-cyan-500/10",
            hoverGradient: "from-blue-500/20 to-cyan-500/20",
            route: "/pipelines",
        },
        {
            id: "analyst",
            title: "Data Analyst",
            icon: <LineChart className='h-8 w-8' />,
            description:
                "Explore datasets, track freshness metrics, and ensure data quality across the organization.",
            features: [
                "Data Freshness",
                "Quality Metrics",
                "SLA Monitoring",
                "Insights Dashboard",
            ],
            gradient: "from-purple-500/10 to-pink-500/10",
            hoverGradient: "from-purple-500/20 to-pink-500/20",
            route: "/freshness",
        },
    ];

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role.id);

        toast.success(`Welcome, ${role.title}!`, {
            duration: 2000,
        });

        // Store the selected role preference and mark as explored
        localStorage.setItem("userRole", role.id);
        localStorage.setItem("hasExploredApp", "true");

        setTimeout(() => {
            navigate({ to: role.route });
        }, 500);
    };

    return (
        <div className='w-full max-w-4xl mx-auto'>
            {/* Section Header */}
            <div className='text-center mb-8'>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4'>
                    <Sparkles className='h-4 w-4' />
                    <span>Choose Your Path</span>
                </div>
                <h2 className='text-2xl sm:text-3xl font-bold text-foreground mb-2'>
                    How do you work with data?
                </h2>
                <p className='text-muted-foreground'>
                    Select your role to personalize your dashboard experience
                </p>
            </div>

            {/* Role Cards */}
            <div className='grid md:grid-cols-2 gap-6'>
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role)}
                        onMouseEnter={() => setHoveredRole(role.id)}
                        onMouseLeave={() => setHoveredRole(null)}
                        className={`relative group text-left rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
                            selectedRole === role.id
                                ? "border-primary scale-[0.98]"
                                : hoveredRole === role.id
                                  ? "border-primary/50 shadow-lg shadow-primary/10"
                                  : "border-border hover:border-primary/30"
                        }`}
                    >
                        {/* Background Gradient */}
                        <div
                            className={`absolute inset-0 bg-linear-to-br ${
                                hoveredRole === role.id
                                    ? role.hoverGradient
                                    : role.gradient
                            } transition-all duration-300`}
                        />

                        {/* Content */}
                        <div className='relative p-6 sm:p-8'>
                            {/* Icon */}
                            <div
                                className={`inline-flex p-4 rounded-xl bg-background border border-border mb-4 transition-transform duration-300 ${
                                    hoveredRole === role.id ? "scale-110" : ""
                                }`}
                            >
                                <div className='text-primary'>{role.icon}</div>
                            </div>

                            {/* Title */}
                            <h3 className='text-xl font-bold text-foreground mb-2'>
                                {role.title}
                            </h3>

                            {/* Description */}
                            <p className='text-muted-foreground text-sm mb-4 leading-relaxed'>
                                {role.description}
                            </p>

                            {/* Features */}
                            <div className='space-y-2 mb-6'>
                                {role.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center gap-2 text-sm text-foreground/80'
                                    >
                                        <div className='w-1.5 h-1.5 rounded-full bg-primary' />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <div
                                className={`flex items-center gap-2 text-primary font-medium transition-all duration-300 ${
                                    hoveredRole === role.id
                                        ? "translate-x-2"
                                        : ""
                                }`}
                            >
                                <span>Continue as {role.title}</span>
                                <ArrowRight
                                    className={`h-4 w-4 transition-transform duration-300 ${
                                        hoveredRole === role.id
                                            ? "translate-x-1"
                                            : ""
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Decorative Corner */}
                        <div
                            className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/10 to-transparent rounded-bl-full transition-opacity duration-300 ${
                                hoveredRole === role.id
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        />
                    </button>
                ))}
            </div>

            {/* Quick Start Option */}
            <div className='mt-8 text-center'>
                <Button
                    variant='ghost'
                    onClick={() => {
                        toast.success("Welcome to DataOps Analytics!", {
                            duration: 2000,
                        });
                        localStorage.setItem("hasExploredApp", "true");
                        setTimeout(() => navigate({ to: "/pipelines" }), 500);
                    }}
                    className='text-muted-foreground hover:text-foreground'
                >
                    Skip personalization and explore the dashboard
                </Button>
            </div>
        </div>
    );
}
