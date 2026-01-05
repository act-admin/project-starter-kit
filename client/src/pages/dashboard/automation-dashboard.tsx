import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartWidget } from "@/components/dashboard/ChartWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Zap,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface AutomationDashboardProps {
  persona: string;
}

export default function AutomationDashboard({
  persona,
}: AutomationDashboardProps) {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics", persona],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/metrics?persona=${persona}`);
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
    enabled: !!persona,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/dashboard/analytics", persona],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/analytics?persona=${persona}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: !!persona,
  });

  const { data: automationServices, isLoading: automationServicesLoading } =
    useQuery({
      queryKey: ["/api/dashboard/automation-services", persona],
      queryFn: async () => {
        const personaParam = persona || 'generic';
        const res = await fetch(
          `/api/dashboard/automation-services?persona=${personaParam}`,
        );
        if (!res.ok) throw new Error("Failed to fetch automation services");
        return res.json();
      },
      enabled: true,
      refetchInterval: 5000,
    });

  const cardColors = ["blue", "red", "green", "purple"] as const;
  const cardIconComponents = [BarChart3, TrendingUp, Clock, Users];

  if (metricsLoading || analyticsLoading || automationServicesLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  // Get automation services data
  const services = (automationServices as any)?.services || [];
  const serviceTotals = (automationServices as any)?.totals || {};

  return (
    <div className="p-8 space-y-8" data-testid="page-automation-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Automation Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your automation performance and key metrics
          </p>
        </div>
        {services.length > 0 && (
          <div className="flex gap-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Total Time Saved
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {serviceTotals.totalTimeSavedHours || 0}h
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                Total Cost Saved
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                ${serviceTotals.totalCostSaved || 0}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Automation Overview Section - All Personas */}
      {services.length > 0 && (
        <div className="space-y-6">
          {/* <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Automation Overview</h2>
              <p className="text-sm text-muted-foreground">Finance & Accounting automation services breakdown</p>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service: any, index: number) => {
              const solidColors = [
                { 
                  bg: "bg-blue-500", 
                  lightBg: "bg-blue-50 dark:bg-blue-950/20",
                  text: "text-blue-600 dark:text-blue-400"
                },
                { 
                  bg: "bg-purple-500", 
                  lightBg: "bg-purple-50 dark:bg-purple-950/20",
                  text: "text-purple-600 dark:text-purple-400"
                },
                { 
                  bg: "bg-amber-500", 
                  lightBg: "bg-amber-50 dark:bg-amber-950/20",
                  text: "text-amber-600 dark:text-amber-500"
                },
                { 
                  bg: "bg-green-500", 
                  lightBg: "bg-green-50 dark:bg-green-950/20",
                  text: "text-green-600 dark:text-green-400"
                },
              ];
              const color = solidColors[index % 4];

              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-900 border border-border/40 rounded-lg p-5 hover:shadow-md transition-all duration-200"
                  data-testid={`service-card-${service.id}`}
                >
                  {/* Header with Icon and Accuracy */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-lg ${color.bg} flex items-center justify-center shadow-sm`}>
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <div className={`${color.lightBg} px-3 py-1.5 rounded-md`}>
                      <span className={`text-sm font-bold ${color.text}`}>
                        {service.accuracy?.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Service Name and Description */}
                  <h3
                    className="text-base font-bold text-foreground mb-1.5"
                    data-testid={`text-service-name-${index}`}
                  >
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Queries Processed
                      </div>
                      <div
                        className="text-lg font-bold text-foreground"
                        data-testid={`text-queries-${index}`}
                      >
                        {service.queriesProcessed}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Time Saved
                      </div>
                      <div
                        className="text-lg font-bold text-blue-600 dark:text-blue-400"
                        data-testid={`text-timesaved-${index}`}
                      >
                        {service.timeSavedHours}h
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Cost Saved
                      </div>
                      <div
                        className="text-lg font-bold text-green-600 dark:text-green-400"
                        data-testid={`text-costsaved-${index}`}
                      >
                        ${service.costSaved}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        Avg Response
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {service.avgResponseTime}s
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Division Performance Insights - Metronic Progress Card Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {(() => {
              // Group services by division
              const divisionGroups = services.reduce(
                (acc: any, service: any) => {
                  const div = service.division || "General Services";
                  if (!acc[div]) {
                    acc[div] = {
                      name: div,
                      services: [],
                      totalQueries: 0,
                      avgDelta: 0,
                    };
                  }
                  acc[div].services.push(service);
                  acc[div].totalQueries += service.queriesProcessed || 0;
                  acc[div].avgDelta += service.delta || 0;
                  return acc;
                },
                {},
              );

              // Calculate average delta for each division
              Object.values(divisionGroups).forEach((group: any) => {
                group.avgDelta = Math.round(
                  group.avgDelta / group.services.length,
                );
              });

              // Define colors for divisions - Metronic progress style
              const divisionConfigs: any = {
                "Invoice Processing": {
                  bg: "bg-teal-50 dark:bg-teal-950/10",
                  accentText: "text-teal-600 dark:text-teal-400",
                  accentBg: "bg-teal-500",
                  progressBg: "bg-white/40 dark:bg-white/10",
                  label: "total invoices",
                  subtitle: "AR + AP",
                },
                "Financial Reporting": {
                  bg: "bg-amber-50 dark:bg-amber-950/10",
                  accentText: "text-amber-600 dark:text-amber-500",
                  accentBg: "bg-amber-500",
                  progressBg: "bg-white/40 dark:bg-white/10",
                  label: "journal entries",
                  subtitle: "General",
                },
                "Compliance Review": {
                  bg: "bg-blue-50 dark:bg-blue-950/10",
                  accentText: "text-blue-600 dark:text-blue-400",
                  accentBg: "bg-blue-500",
                  progressBg: "bg-white/40 dark:bg-white/10",
                  label: "checks completed",
                  subtitle: "Quality",
                },
              };

              return Object.values(divisionGroups).map((group: any) => {
                const config =
                  divisionConfigs[group.name] ||
                  divisionConfigs["Invoice Processing"];
                const deltaSign = group.avgDelta >= 0 ? "+" : "-";
                const progress = Math.min(Math.abs(group.avgDelta) + 50, 100); // Convert delta to progress percentage

                return (
                  <div
                    key={group.name}
                    className={`${config.bg} rounded-lg p-6 flex flex-col gap-4`}
                  >
                    {/* Title */}
                    <div
                      className={`text-sm font-semibold ${config.accentText}`}
                    >
                      {group.name}
                    </div>

                    {/* Percentage and Label */}
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-bold ${config.accentText}`}
                      >
                        {deltaSign}
                        {Math.abs(group.avgDelta)}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {config.subtitle}
                      </span>
                    </div>

                    {/* Metric Value */}
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-bold ${config.accentText}`}
                      >
                        {group.totalQueries}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {config.label}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className={`h-2 ${config.progressBg} rounded-full overflow-hidden`}
                    >
                      <div
                        className={`h-full ${config.accentBg} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(metrics as any)?.metrics?.map((metric: any, index: number) => {
          const IconComponent =
            cardIconComponents[index % cardIconComponents.length];
          return (
            <MetricCard
              key={index}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
              subtitle={metric.subtitle}
              color={cardColors[index % cardColors.length]}
              icon={<IconComponent className="w-6 h-6" />}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWidget
          title="Monthly Performance"
          subtitle="Performance trends over the last 6 months"
          data={(analytics as any)?.charts || []}
          dataKey="statistics"
          xAxisKey="month"
          type="bar"
          color="#3b82f6"
        />

        <ChartWidget
          title="Automation Growth"
          subtitle="Growth in automation usage"
          data={(analytics as any)?.charts || []}
          dataKey="transactions"
          xAxisKey="month"
          type="line"
          color="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed
          title="Recent Activities"
          subtitle={
            (analytics as any)?.summary
              ? `${(analytics as any).summary.totalRecords} total records`
              : undefined
          }
          activities={(analytics as any)?.activities || []}
        />

        <ChartWidget
          title="User Engagement"
          subtitle="Active users and engagement metrics"
          data={(analytics as any)?.charts || []}
          dataKey="customers"
          xAxisKey="month"
          type="bar"
          color="#10b981"
        />
      </div>
    </div>
  );
}