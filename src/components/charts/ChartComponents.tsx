'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Chart color palette
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  indigo: '#6366f1',
  pink: '#ec4899',
  teal: '#14b8a6',
  gray: '#6b7280'
};

export const CHART_GRADIENTS = {
  blue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  green: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  purple: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  orange: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  red: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
};

// Loading skeleton for charts
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="w-32 h-5 bg-gray-200 rounded"></div>
      <div className="w-20 h-8 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-4" style={{ height }}>
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-4/5 h-4 bg-gray-200 rounded"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Enhanced Line Chart with gradients and animations
export interface LineChartProps {
  data: Array<{ label: string; value: number; date?: string }>;
  title: string;
  subtitle?: string;
  height?: number;
  showGrid?: boolean;
  showPoints?: boolean;
  gradient?: boolean;
  color?: string;
  formatValue?: (value: number) => string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  showGrid = true,
  showPoints = true,
  gradient = true,
  color = CHART_COLORS.primary,
  formatValue = (value) => value.toString(),
  trend,
  trendValue
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  const padding = range * 0.1;

  // Generate SVG path for the line
  const generatePath = () => {
    const pathData = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((maxValue + padding - point.value) / (range + 2 * padding)) * 100;
      return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
    }).join(' ');
    return pathData;
  };

  // Generate area path for gradient fill
  const generateAreaPath = () => {
    if (!gradient) return '';
    const pathData = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((maxValue + padding - point.value) / (range + 2 * padding)) * 100;
      return `${x}% ${y}%`;
    }).join(', ');
    return `polygon(${pathData}, 100% 100%, 0% 100%)`;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {trend && trendValue !== undefined && (
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' :
            trend === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> :
             trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
            <span>{Math.abs(trendValue).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{formatValue(maxValue + padding)}</span>
          <span>{formatValue((maxValue + minValue) / 2)}</span>
          <span>{formatValue(minValue - padding)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative overflow-hidden rounded-lg">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {showGrid && [0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={`${ratio * 100}%`}
                x2="100%"
                y2={`${ratio * 100}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            ))}

            {/* Area fill */}
            {gradient && (
              <path
                d={generatePath() + ' L 100% 100% L 0% 100% Z'}
                fill={`url(#gradient-${title.replace(/\s+/g, '-')})`}
              />
            )}

            {/* Main line */}
            <path
              d={generatePath()}
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />

            {/* Data points */}
            {showPoints && data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = ((maxValue + padding - point.value) / (range + 2 * padding)) * 100;
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill="white"
                    stroke={color}
                    strokeWidth="3"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                    }}
                  />
                  {/* Hover area */}
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                  >
                    <title>{`${point.label}: ${formatValue(point.value)}`}</title>
                  </circle>
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="ml-12 mt-4 flex justify-between text-xs text-gray-500">
          {data.map((point, index) => (
            <span key={index} className="truncate max-w-16">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Bar Chart with animations and patterns
export interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string; target?: number }>;
  title: string;
  subtitle?: string;
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  showTargets?: boolean;
  formatValue?: (value: number) => string;
  maxValue?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  horizontal = false,
  showValues = true,
  showTargets = false,
  formatValue = (value) => value.toString(),
  maxValue
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxVal = maxValue || Math.max(...data.map(d => Math.max(d.value, d.target || 0)));
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.purple,
    CHART_COLORS.indigo,
    CHART_COLORS.pink,
    CHART_COLORS.teal
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        {horizontal ? (
          // Horizontal Bar Chart
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-700 text-right truncate">
                  {item.label}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    {/* Target line */}
                    {showTargets && item.target && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-gray-600 z-10"
                        style={{
                          left: `${(item.target / maxVal) * 100}%`
                        }}
                      >
                        <div className="absolute -top-1 -left-2 w-4 h-2 bg-gray-600 rounded-sm"></div>
                      </div>
                    )}
                    {/* Progress bar */}
                    <div
                      className="h-6 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(item.value / maxVal) * 100}%`,
                        background: item.color || colors[index % colors.length]
                      }}
                    />
                  </div>
                  {showValues && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-white">
                      {formatValue(item.value)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vertical Bar Chart
          <div className="flex items-end justify-between h-full space-x-2">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex flex-col items-end justify-end h-full">
                  {/* Target line */}
                  {showTargets && item.target && (
                    <div
                      className="absolute w-full border-t-2 border-gray-600 border-dashed z-10"
                      style={{
                        bottom: `${(item.target / maxVal) * 100}%`
                      }}
                    />
                  )}
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg transition-all duration-1000 ease-out relative"
                    style={{
                      height: `${(item.value / maxVal) * 100}%`,
                      background: item.color || colors[index % colors.length],
                      minHeight: '4px'
                    }}
                  >
                    {showValues && item.value > 0 && (
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                        {formatValue(item.value)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center truncate w-full">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Donut Chart Component
export interface DonutChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  subtitle?: string;
  centerText?: string;
  centerValue?: string;
  size?: number;
  strokeWidth?: number;
  showLegend?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  subtitle,
  centerText,
  centerValue,
  size = 200,
  strokeWidth = 20,
  showLegend = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = 0;
  const colors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.purple,
    CHART_COLORS.indigo,
    CHART_COLORS.pink,
    CHART_COLORS.teal
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center justify-center space-x-8">
        {/* Chart */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />
            
            {/* Data segments */}
            {data.map((item, index) => {
              const percentage = item.value / total;
              const strokeDasharray = `${percentage * circumference} ${circumference}`;
              const strokeDashoffset = -currentAngle * circumference;
              
              currentAngle += percentage;
              
              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color || colors[index % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && (
              <div className="text-2xl font-bold text-gray-900">{centerValue}</div>
            )}
            {centerText && (
              <div className="text-sm text-gray-600 mt-1">{centerText}</div>
            )}
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color || colors[index % colors.length] }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-600">
                    {item.value} ({((item.value / total) * 100).toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};