import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  subtitle?: string;
  color?: 'blue' | 'red' | 'green' | 'purple' | 'yellow' | 'cyan';
  icon?: React.ReactNode;
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  yellow: 'from-yellow-500 to-yellow-600',
  cyan: 'from-cyan-500 to-cyan-600'
};

export function MetricCard({
  label,
  value,
  change,
  trend,
  subtitle,
  color = 'blue',
  icon
}: MetricCardProps) {
  return (
    <Card className={`p-6 bg-gradient-to-br ${colorClasses[color]} text-white relative overflow-hidden`} data-testid={`card-metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white/90">{label}</h3>
          {icon && <div className="text-white/70">{icon}</div>}
        </div>
        
        <div className="mb-2">
          <div className="text-3xl font-bold text-white">{value}</div>
        </div>

        {(change || subtitle) && (
          <div className="flex items-center gap-2 text-sm">
            {change && (
              <div className="flex items-center gap-1">
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{change}</span>
              </div>
            )}
            {subtitle && (
              <span className="text-white/70">{subtitle}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
    </Card>
  );
}
