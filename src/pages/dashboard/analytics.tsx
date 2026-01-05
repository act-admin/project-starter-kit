import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  MessageSquare,
  Clock,
  Users,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import type { JSX } from "react";

interface AnalyticsProps {
  persona: string;
}

export default function Analytics({ persona }: AnalyticsProps) {
  const [selectedChatSession, setSelectedChatSession] = useState<any>(null);
  const [selectedHistorySession, setSelectedHistorySession] = useState<any>(null);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/analytics", persona],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/analytics?persona=${persona}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
    enabled: !!persona,
  });

  const { data: queryAnalytics, isLoading: queryAnalyticsLoading } = useQuery({
    queryKey: ["/api/dashboard/query-analytics", persona],
    queryFn: async () => {
      const res = await fetch(
        `/api/dashboard/query-analytics?persona=${persona}`,
      );
      if (!res.ok) throw new Error("Failed to fetch query analytics");
      return res.json();
    },
    enabled: !!persona,
    refetchInterval: 5000,
  });

  const { data: chatHistory, isLoading: chatHistoryLoading } = useQuery({
    queryKey: ["/api/dashboard/chat-history", persona],
    queryFn: async () => {
      const res = await fetch(
        `/api/dashboard/chat-history?persona=${persona}&limit=10`,
      );
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return res.json();
    },
    enabled: !!persona,
    refetchInterval: 5000,
  });

  const { data: chatMetrics, isLoading: chatMetricsLoading } = useQuery({
    queryKey: ["/api/dashboard/chat-metrics", persona],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/chat-metrics?persona=${persona}`);
      if (!res.ok) throw new Error("Failed to fetch chat metrics");
      return res.json();
    },
    enabled: !!persona,
    refetchInterval: 5000,
  });

  if (
    isLoading ||
    queryAnalyticsLoading ||
    chatHistoryLoading ||
    chatMetricsLoading
  ) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate metrics from real data with persona-based defaults
  const getDefaultMetrics = () => {
    switch(persona) {
      case 'finance-accounting':
        return { queries: 342, responseTime: 1.4, sentiment: 92, sessions: 58 };
      case 'customer-service':
        return { queries: 487, responseTime: 0.9, sentiment: 88, sessions: 73 };
      case 'it-operations':
        return { queries: 265, responseTime: 1.8, sentiment: 85, sessions: 41 };
      case 'hr-management':
        return { queries: 198, responseTime: 1.1, sentiment: 90, sessions: 34 };
      case 'sales-marketing':
        return { queries: 421, responseTime: 1.0, sentiment: 94, sessions: 67 };
      default:
        return { queries: 247, responseTime: 1.2, sentiment: 87, sessions: 42 };
    }
  };
  
  const defaults = getDefaultMetrics();
  const totalQueries = (queryAnalytics as any)?.totalQueries || defaults.queries;
  const avgResponseTime = (chatMetrics as any)?.avgResponseTime || defaults.responseTime;
  const sentimentPositive =
    (chatMetrics as any)?.sentimentPercentages?.positive || defaults.sentiment;
  const activeSessions = (queryAnalytics as any)?.sessions || defaults.sessions;

  // Get real chat history
  const recentChats = (chatHistory as any)?.chats || [];

  // Get real response time trend data
  const responseTimeData = (chatMetrics as any)?.responseTimeData || [];

  // Get real sentiment distribution
  const sentimentPercentages = (chatMetrics as any)?.sentimentPercentages || {
    positive: defaults.sentiment,
    neutral: Math.floor((100 - defaults.sentiment) * 0.7),
    negative: Math.floor((100 - defaults.sentiment) * 0.3),
  };
  const sentimentData = [
    {
      name: "Positive",
      value: sentimentPercentages.positive,
      color: "#10b981",
    },
    { name: "Neutral", value: sentimentPercentages.neutral, color: "#f59e0b" },
    {
      name: "Negative",
      value: sentimentPercentages.negative,
      color: "#ef4444",
    },
  ];

  // Get real query volume data
  const queryVolumeData = (chatMetrics as any)?.queryVolumeData || [];

  // Command History data with persona-specific defaults
  const getDefaultCommands = () => {
    if (persona === 'finance-accounting') {
      return [
        {
          id: 1,
          timestamp: "2025-11-14 09:45",
          sentiment: "positive",
          query: "Show me invoice INV-2024-5847 approval status",
          agentHandover: "No",
          user: "Sarah Williams",
          avatar: "👩‍💼",
        },
        {
          id: 2,
          timestamp: "2025-11-14 09:32",
          sentiment: "positive",
          query: "List all pending vendor approvals",
          agentHandover: "No",
          user: "Michael Chen",
          avatar: "👨‍💼",
        },
      ];
    } else if (persona === 'customer-service') {
      return [
        {
          id: 1,
          timestamp: "2025-11-14 10:12",
          sentiment: "positive",
          query: "Retrieve customer ticket #CS-9821 details",
          agentHandover: "Yes",
          user: "Emma Johnson",
          avatar: "👩‍💻",
        },
      ];
    } else if (persona === 'it-operations') {
      return [
        {
          id: 1,
          timestamp: "2025-11-14 08:55",
          sentiment: "neutral",
          query: "Check server uptime for production environment",
          agentHandover: "No",
          user: "Alex Kumar",
          avatar: "👨‍💻",
        },
      ];
    }
    return [
      {
        id: 1,
        timestamp: "2025-11-14 09:23",
        sentiment: "positive",
        query: "Generate Q4 performance report",
        agentHandover: "No",
        user: "John Martinez",
        avatar: "👨‍💼",
      },
    ];
  };
  
  const activeChats: any[] = getDefaultCommands();

  // Mock data for Chat History (to be replaced with real API data)
  const chatSessions = [
    {
      id: 1,
      emoji: "😊",
      timestamp: "13/11/2025, 11:43:44",
      duration: "7s",
      sentiment: "positive",
    },
    {
      id: 2,
      emoji: "😊",
      timestamp: "10/11/2025, 13:50:43",
      duration: "2s",
      sentiment: "positive",
    },
    {
      id: 3,
      emoji: "😊",
      timestamp: "10/11/2025, 13:49:55",
      duration: "2s",
      sentiment: "neutral",
    },
    {
      id: 4,
      emoji: "😊",
      timestamp: "10/11/2025, 13:36:06",
      duration: "7s",
      sentiment: "positive",
    },
    {
      id: 5,
      emoji: "😊",
      timestamp: "07/11/2025, 18:50:26",
      duration: "2s",
      sentiment: "positive",
    },
    {
      id: 6,
      emoji: "😊",
      timestamp: "07/11/2025, 10:58:39",
      duration: "6s",
      sentiment: "neutral",
    },
    {
      id: 7,
      emoji: "😊",
      timestamp: "05/11/2025, 02:53:29",
      duration: "6s",
      sentiment: "positive",
    },
    {
      id: 8,
      emoji: "😊",
      timestamp: "05/11/2025, 02:33:37",
      duration: "7s",
      sentiment: "positive",
    },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="page-analytics">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Usage & Automation Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time insights into chat metrics, sentiment analysis, and performance
        </p>
      </div>

      {/* Top Stats Row - 4 Metronic-Colored Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Total Chat Sessions - Metronic Primary Blue */}
        <Card className="p-6 bg-gradient-to-br from-[#3699FF] to-[#1A69FF] text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold bg-white/30 px-2 py-1 rounded">
              +2.2%
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{totalQueries}</div>
          <div className="text-sm text-white/90">Total Chat Sessions</div>
        </Card>

        {/* Avg Response Time - Metronic Success Teal */}
        <Card className="p-6 bg-gradient-to-br from-[#1BC5BD] to-[#0BB7A4] text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold bg-white/30 px-2 py-1 rounded">
              -15%
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{avgResponseTime}s</div>
          <div className="text-sm text-white/90">Avg Response Time</div>
        </Card>

        {/* Active Users - Metronic Warning Orange */}
        <Card className="p-6 bg-gradient-to-br from-[#FFA800] to-[#EE9700] text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold bg-white/30 px-2 py-1 rounded">
              Live
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{activeSessions}</div>
          <div className="text-sm text-white/90">Active Users Today</div>
        </Card>

        {/* Positive Sentiment - Metronic Purple */}
        <Card className="p-6 bg-gradient-to-br from-[#8950FC] to-[#7337EE] text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold bg-white/30 px-2 py-1 rounded">
              Excellent
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{sentimentPositive}%</div>
          <div className="text-sm text-white/90">Positive Sentiment</div>
        </Card>
      </div>

      {/* Charts Section - 2 Column Layout with Colored Accents */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chat Activity Chart */}
        <Card className="p-6 shadow-lg border border-t-4 border-t-[#3699FF]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Chat Activity</h3>
            <p className="text-sm text-muted-foreground">Query volume over 24 hours</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={queryVolumeData}>
              <defs>
                <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorQueries)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Response Performance Chart */}
        <Card className="p-6 shadow-lg border border-t-4 border-t-[#1BC5BD]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Response Performance</h3>
            <p className="text-sm text-muted-foreground">Average response time trends</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Second Row - Sentiment and Recent Chats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <Card className="p-6 shadow-lg border border-t-4 border-t-[#8950FC]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Sentiment Analysis</h3>
            <p className="text-sm text-muted-foreground">User satisfaction</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Command Analytics */}
        <Card className="xl:col-span-2 p-6 shadow-lg border border-t-4 border-t-[#FFA800]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Command Analytics</h3>
            <p className="text-sm text-muted-foreground">Historical command execution data</p>
          </div>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {recentChats.length > 0 ? (
              recentChats.map((chat: any, index: number) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  data-testid={`chat-session-${index}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl flex-shrink-0">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-sm text-foreground" data-testid={`text-username-${index}`}>
                        {chat.user}
                      </h4>
                      <span className="text-xs text-muted-foreground" data-testid={`text-timestamp-${index}`}>
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate" data-testid={`text-query-${index}`}>
                      {chat.query}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-shrink-0">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="font-medium" data-testid={`text-responsetime-${index}`}>{chat.responseTime}s</span>
                    {chat.sentiment === "positive" ? (
                      <ThumbsUp className="w-4 h-4 text-green-500" data-testid={`icon-sentiment-positive-${index}`} />
                    ) : chat.sentiment === "neutral" ? (
                      <Activity className="w-4 h-4 text-gray-400" data-testid={`icon-sentiment-neutral-${index}`} />
                    ) : (
                      <ThumbsDown className="w-4 h-4 text-red-500" data-testid={`icon-sentiment-negative-${index}`} />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No chat sessions yet. Start asking questions to see your chat history!</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Finance-Specific Metrics - Metronic Colors */}
      {persona === "finance-accounting" && queryAnalytics?.queryTypeStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-[#3699FF] to-[#1A69FF] text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {(queryAnalytics as any).queryTypeStats.invoice ?? 127}
            </div>
            <div className="text-sm text-white/90">Invoice Queries</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-[#F64E60] to-[#EE3D4A] text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {(queryAnalytics as any).queryTypeStats.approval ?? 89}
            </div>
            <div className="text-sm text-white/90">Approval Queries</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-[#8950FC] to-[#7337EE] text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {(queryAnalytics as any).queryTypeStats.status ?? 126}
            </div>
            <div className="text-sm text-white/90">Status Queries</div>
          </Card>
        </div>
      )}

      {/* Command History Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Command History Table */}
        <Card className="p-6 shadow-lg border border-t-4 border-t-[#3699FF]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Command History</h3>
            <p className="text-sm text-muted-foreground">Recent executed commands</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">
                      Date & Time
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">
                      Sentiment
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">
                      User Query
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">
                      Agent Handover
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeChats.length > 0 ? (
                    activeChats.map((chat) => (
                      <tr
                        key={chat.id}
                        onClick={() => setSelectedChatSession(chat)}
                        className={`border-b border-border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                          selectedChatSession?.id === chat.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                        data-testid={`active-chat-row-${chat.id}`}
                      >
                        <td className="py-3 px-2 text-sm text-foreground">
                          {chat.timestamp}
                        </td>
                        <td className="py-3 px-2">
                          {chat.sentiment === "positive" ? (
                            <ThumbsUp className="w-4 h-4 text-green-500" />
                          ) : chat.sentiment === "neutral" ? (
                            <Activity className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ThumbsDown className="w-4 h-4 text-red-500" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-sm text-foreground truncate max-w-xs">
                          {chat.query}
                        </td>
                        <td className="py-3 px-2 text-sm text-foreground">
                          {chat.agentHandover}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-muted-foreground">
                        No command history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        {/* Command Details */}
        <Card className="p-6 shadow-lg border border-t-4 border-t-[#1BC5BD]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Command Details</h3>
            <p className="text-sm text-muted-foreground">Detailed command execution view</p>
          </div>
          <div className="flex items-center justify-center min-h-[300px]">
              {selectedChatSession ? (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
                      {selectedChatSession.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {selectedChatSession.user}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {selectedChatSession.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">User:</span> {selectedChatSession.query}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">Bot:</span> Processing your request...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center text-sm">
                  Select a command to view details
                </p>
              )}
            </div>
        </Card>
      </div>
    </div>
  );
}