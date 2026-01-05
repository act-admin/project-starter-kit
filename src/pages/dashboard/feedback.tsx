import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { FeedbackCard } from "@/components/dashboard/FeedbackCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeedbackProps {
  persona: string;
}

export default function Feedback({ persona }: FeedbackProps) {
  const [feedbackText, setFeedbackText] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const { toast } = useToast();

  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/feedback', persona],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/feedback?persona=${persona}`);
      if (!res.ok) throw new Error('Failed to fetch feedback');
      return res.json();
    },
    enabled: !!persona
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! We'll review it shortly.",
    });
    setFeedbackText("");
    setRequestTitle("");
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-64" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8" data-testid="page-feedback">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Feedback & Requests</h1>
        <p className="text-muted-foreground">Share your feedback or request new automation features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8" />
            <div className="text-3xl font-bold">{(feedbackData as any)?.stats?.total || 0}</div>
          </div>
          <div className="text-sm text-white/80">Total Feedback</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8" />
            <div className="text-3xl font-bold">{(feedbackData as any)?.stats?.approved || 0}</div>
          </div>
          <div className="text-sm text-white/80">Approved</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Send className="w-8 h-8" />
            <div className="text-3xl font-bold">{(feedbackData as any)?.stats?.pending || 0}</div>
          </div>
          <div className="text-sm text-white/80">In Review</div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Submit New Feedback or Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="request-title">Title</Label>
            <Input
              id="request-title"
              value={requestTitle}
              onChange={(e) => setRequestTitle(e.target.value)}
              placeholder="Brief title for your feedback or request"
              className="mt-1"
              data-testid="input-request-title"
            />
          </div>

          <div>
            <Label htmlFor="feedback-text">Description</Label>
            <textarea
              id="feedback-text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Describe your feedback or automation request in detail..."
              className="w-full mt-1 p-3 border border-input rounded-md min-h-[150px] bg-background text-foreground"
              data-testid="input-feedback-text"
            />
          </div>

          <Button type="submit" className="w-full" data-testid="button-submit-feedback">
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Feedback & Requests</h2>
        <div className="space-y-4">
          {(feedbackData as any)?.feedback?.map((item: any) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      </div>
    </div>
  );
}