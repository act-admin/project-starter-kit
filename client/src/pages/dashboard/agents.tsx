import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { JSX } from "react";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AgentsProps {
  persona: string;
}

export default function Agents({ persona }: AgentsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/agents', persona],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/agents?persona=${persona}`);
      if (!res.ok) throw new Error('Failed to fetch agents');
      return res.json();
    },
    enabled: !!persona
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  const filteredAgents = (agentsData as any)?.agents?.filter((agent: any) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="p-8 space-y-8" data-testid="page-agents">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Automation Agents Repository</h1>
        <p className="text-muted-foreground">Explore and manage your automation agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <Activity className="w-8 h-8 mb-2" />
          <div className="text-3xl font-bold mb-1">{(agentsData as any)?.summary?.total || 0}</div>
          <div className="text-sm text-white/80">Total Agents</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CheckCircle2 className="w-8 h-8 mb-2" />
          <div className="text-3xl font-bold mb-1">{(agentsData as any)?.summary?.active || 0}</div>
          <div className="text-sm text-white/80">Active Agents</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <TrendingUp className="w-8 h-8 mb-2" />
          <div className="text-3xl font-bold mb-1">{(agentsData as any)?.summary?.totalUsage?.toLocaleString() || 0}</div>
          <div className="text-sm text-white/80">Total Usage</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <Clock className="w-8 h-8 mb-2" />
          <div className="text-3xl font-bold mb-1">{(agentsData as any)?.summary?.avgAccuracy || 0}%</div>
          <div className="text-sm text-white/80">Avg Accuracy</div>
        </Card>
      </div>

      <div>
        <Input
          type="text"
          placeholder="Search agents by name, category, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
          data-testid="input-search-agents"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent: any) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="p-12 text-center">
          <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No agents found</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </Card>
      )}
    </div>
  );
}