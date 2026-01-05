import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, Clock, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  provider: 'AWS' | 'Azure' | 'NVIDIA' | 'Anthropic' | 'GCP' | 'OpenAI';
  type: 'document' | 'video' | 'voice' | 'image' | 'nlp' | 'data';
  accuracy: number;
  latency: string;
}

interface Agent {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'active' | 'beta' | 'inactive';
  usage: number;
  accuracy: number;
  timeSaved: string;
  models?: AIModel[];
}

interface AgentCardProps {
  agent: Agent;
}

const statusConfig = {
  active: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  beta: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
  inactive: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Activity }
};

const providerConfig = {
  AWS: { color: 'bg-orange-100 text-orange-700 border-orange-200' },
  Azure: { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  NVIDIA: { color: 'bg-green-100 text-green-700 border-green-200' },
  Anthropic: { color: 'bg-purple-100 text-purple-700 border-purple-200' },
  GCP: { color: 'bg-red-100 text-red-700 border-red-200' },
  OpenAI: { color: 'bg-teal-100 text-teal-700 border-teal-200' }
};

const typeConfig = {
  document: 'Document',
  video: 'Video',
  voice: 'Voice',
  image: 'Image',
  nlp: 'NLP',
  data: 'Data'
};

export function AgentCard({ agent }: AgentCardProps) {
  const [showModels, setShowModels] = useState(true);
  const statusInfo = statusConfig[agent.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow" data-testid={`card-agent-${agent.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{agent.name}</h3>
            <p className="text-xs text-muted-foreground">{agent.category}</p>
          </div>
        </div>
        <Badge className={statusInfo.color} variant="outline">
          <StatusIcon className="w-3 h-3 mr-1" />
          {agent.status}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6">{agent.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Usage</div>
          <div className="text-lg font-semibold text-foreground">{agent.usage.toLocaleString()}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
          <div className="text-lg font-semibold text-green-600">{agent.accuracy}%</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Time Saved</div>
          <div className="text-xs font-semibold text-blue-600">{agent.timeSaved}</div>
        </div>
      </div>

      {agent.models && agent.models.length > 0 && (
        <div className="border-t pt-4">
          <button
            onClick={() => setShowModels(!showModels)}
            className="flex items-center justify-between w-full mb-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
            data-testid={`button-toggle-models-${agent.id}`}
          >
            <span>Pre-built AI Models ({agent.models.length})</span>
            {showModels ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showModels && (
            <div className="space-y-3" data-testid={`section-models-${agent.id}`}>
              {agent.models.map((model) => (
                <div
                  key={model.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  data-testid={`model-${model.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{model.name}</h4>
                      <div className="flex gap-2">
                        <Badge className={providerConfig[model.provider].color} variant="outline">
                          {model.provider}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                          {typeConfig[model.type]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Accuracy:</span>{' '}
                      <span className="font-semibold text-green-600">{model.accuracy}%</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Latency:</span>{' '}
                      <span className="font-semibold text-blue-600">{model.latency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
