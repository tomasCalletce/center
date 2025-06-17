"use client";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Edit, Plus, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface ChallengeListProps {
  onCreateNew: () => void;
  onEditChallenge: (challengeId: string) => void;
}

export const ChallengeList = ({ onCreateNew, onEditChallenge }: ChallengeListProps) => {
  const { data: challenges, isLoading, refetch } = api.challenge.all.useQuery({
    limit: 50,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        <div className="text-gray-500">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Challenge Management</h1>
          <p className="text-gray-600">Manage your challenges from here</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Challenge
        </Button>
      </div>

      {!challenges || challenges.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No challenges found</p>
            <Button onClick={onCreateNew} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Create Your First Challenge
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {challenge.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {challenge.price_pool} {challenge.price_pool_currency}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {challenge.deadline_at ? format(new Date(challenge.deadline_at), "MMM dd, yyyy") : "No deadline"}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={challenge.deadline_at && new Date(challenge.deadline_at) > new Date() ? "default" : "secondary"}
                  >
                    {challenge.deadline_at && new Date(challenge.deadline_at) > new Date() ? "Active" : "Ended"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditChallenge(challenge.id)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 