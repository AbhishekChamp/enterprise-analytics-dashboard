import { useEffect, useState } from "react";

interface PipelineNode {
    id: string;
    x: number;
    y: number;
    label: string;
    status: "success" | "processing" | "idle";
}

interface DataFlow {
    id: string;
    from: string;
    to: string;
    progress: number;
}

export function PipelineVisualization() {
    const [mounted, setMounted] = useState(false);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    useEffect(() => {
        // Schedule state update to avoid synchronous setState warning
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    const nodes: PipelineNode[] = [
        {
            id: "ingest",
            x: 10,
            y: 50,
            label: "Data Ingestion",
            status: "success",
        },
        {
            id: "transform",
            x: 35,
            y: 50,
            label: "Transform",
            status: "processing",
        },
        { id: "validate", x: 60, y: 50, label: "Validate", status: "idle" },
        { id: "load", x: 85, y: 50, label: "Data Load", status: "idle" },
    ];

    const flows: DataFlow[] = [
        { id: "f1", from: "ingest", to: "transform", progress: 100 },
        { id: "f2", from: "transform", to: "validate", progress: 65 },
        { id: "f3", from: "validate", to: "load", progress: 0 },
    ];

    const getNodeMetrics = (nodeId: string) => {
        const metrics: Record<
            string,
            { throughput: string; latency: string; records: string }
        > = {
            ingest: {
                throughput: "12.5 MB/s",
                latency: "45ms",
                records: "2.4M",
            },
            transform: {
                throughput: "8.2 MB/s",
                latency: "120ms",
                records: "1.8M",
            },
            validate: { throughput: "0 MB/s", latency: "--", records: "0" },
            load: { throughput: "0 MB/s", latency: "--", records: "0" },
        };
        return metrics[nodeId];
    };

    const getNodeColor = (status: string) => {
        switch (status) {
            case "success":
                return "stroke-green-500 fill-green-500/20";
            case "processing":
                return "stroke-blue-500 fill-blue-500/20";
            default:
                return "stroke-muted-foreground fill-muted/20";
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case "success":
                return "bg-green-500";
            case "processing":
                return "bg-blue-500 animate-pulse";
            default:
                return "bg-muted-foreground";
        }
    };

    return (
        <div className='relative w-full h-75 sm:h-87.5 bg-linear-to-b from-background to-muted/30 rounded-2xl border border-border overflow-hidden'>
            {/* Background Grid */}
            <div className='absolute inset-0 opacity-[0.03]'>
                <svg width='100%' height='100%'>
                    <defs>
                        <pattern
                            id='grid'
                            width='40'
                            height='40'
                            patternUnits='userSpaceOnUse'
                        >
                            <path
                                d='M 40 0 L 0 0 0 40'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='1'
                            />
                        </pattern>
                    </defs>
                    <rect width='100%' height='100%' fill='url(#grid)' />
                </svg>
            </div>

            {/* SVG Pipeline */}
            <svg
                className='absolute inset-0 w-full h-full'
                viewBox='0 0 100 100'
                preserveAspectRatio='xMidYMid meet'
            >
                {/* Connection Lines */}
                {flows.map((flow, index) => {
                    const fromNode = nodes.find((n) => n.id === flow.from);
                    const toNode = nodes.find((n) => n.id === flow.to);
                    if (!fromNode || !toNode) return null;

                    return (
                        <g key={flow.id}>
                            {/* Background line */}
                            <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                className='stroke-muted-foreground/20'
                                strokeWidth='0.5'
                                strokeDasharray='2 1'
                            />
                            {/* Animated flow line */}
                            {mounted && (
                                <line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    className='stroke-primary'
                                    strokeWidth='0.5'
                                    strokeDasharray='4 4'
                                    style={{
                                        animation: `dash 2s linear infinite`,
                                        animationDelay: `${index * 0.5}s`,
                                        opacity: flow.progress > 0 ? 1 : 0.3,
                                    }}
                                />
                            )}
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node, index) => (
                    <g
                        key={node.id}
                        className='cursor-pointer transition-all duration-300'
                        style={{
                            transform: mounted ? "scale(1)" : "scale(0)",
                            transitionDelay: `${index * 150}ms`,
                        }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                    >
                        {/* Node Circle */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r='6'
                            className={`transition-all duration-300 ${getNodeColor(node.status)} ${
                                hoveredNode === node.id ? "r-8" : ""
                            }`}
                            strokeWidth='0.5'
                        />
                        {/* Inner pulse for processing nodes */}
                        {node.status === "processing" && mounted && (
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r='4'
                                className='fill-blue-500/30'
                                style={{
                                    animation: "pulse 2s ease-in-out infinite",
                                }}
                            />
                        )}
                        {/* Label */}
                        <text
                            x={node.x}
                            y={node.y + 12}
                            textAnchor='middle'
                            className='fill-foreground text-[2px] font-medium'
                        >
                            {node.label}
                        </text>
                    </g>
                ))}

                {/* Definitions for animations */}
                <defs>
                    <style>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -16;
              }
            }
          `}</style>
                </defs>
            </svg>

            {/* Hover Tooltip */}
            {hoveredNode && (
                <div
                    className='absolute bg-card border border-border rounded-lg p-3 shadow-lg z-10 transition-all duration-200'
                    style={{
                        left:
                            hoveredNode === "ingest"
                                ? "5%"
                                : hoveredNode === "load"
                                  ? "75%"
                                  : "35%",
                        top: "60%",
                    }}
                >
                    <div className='flex items-center gap-2 mb-2'>
                        <div
                            className={`w-2 h-2 rounded-full ${getStatusDot(nodes.find((n) => n.id === hoveredNode)?.status || "idle")}`}
                        />
                        <span className='font-semibold text-sm'>
                            {nodes.find((n) => n.id === hoveredNode)?.label}
                        </span>
                    </div>
                    <div className='space-y-1 text-xs text-muted-foreground'>
                        <div className='flex justify-between gap-4'>
                            <span>Throughput:</span>
                            <span className='text-foreground font-medium'>
                                {getNodeMetrics(hoveredNode).throughput}
                            </span>
                        </div>
                        <div className='flex justify-between gap-4'>
                            <span>Latency:</span>
                            <span className='text-foreground font-medium'>
                                {getNodeMetrics(hoveredNode).latency}
                            </span>
                        </div>
                        <div className='flex justify-between gap-4'>
                            <span>Records:</span>
                            <span className='text-foreground font-medium'>
                                {getNodeMetrics(hoveredNode).records}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Stats */}
            <div className='absolute bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground'>
                <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500' />
                    <span>Active</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-blue-500 animate-pulse' />
                    <span>Processing</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-muted-foreground' />
                    <span>Idle</span>
                </div>
            </div>
        </div>
    );
}
