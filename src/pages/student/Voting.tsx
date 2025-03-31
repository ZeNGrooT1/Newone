
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Clock, Users, CheckCircle2, MapPin, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRealVotingTopics } from "@/hooks/useRealVotingTopics";
import { formatDistanceToNow, isFuture } from "date-fns";
import { RequestBusDialog } from "@/components/RequestBusDialog";

const StudentVoting = () => {
  const { user } = useAuth();
  const { 
    votingTopics, 
    pastVotingTopics, 
    castVote, 
    requestNewBus,
    isLoading,
    isSubmitting
  } = useRealVotingTopics();
  
  const userRegion = user?.region || "Hubli";
  
  const getVoteWeight = (voteRegion: string) => {
    // If user's region matches the vote's region, weight is 1.0, otherwise 0.5
    return voteRegion === userRegion ? 1.0 : 0.5;
  };
  
  const getTimeRemaining = (endDate: Date) => {
    if (isFuture(endDate)) {
      return formatDistanceToNow(endDate, { addSuffix: true });
    }
    return "Expired";
  };
  
  const getTimeSince = (createdAt: Date) => {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  };

  return (
    <DashboardLayout pageTitle="Bus Voting">
      <div className="mb-6">
        <Card className="border-t-4 border-t-primary overflow-hidden shadow-md transition-all hover:shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Vote className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">Bus Voting System</h2>
                <p className="text-muted-foreground">
                  Vote for additional buses when you need them. Once enough votes are received, a request
                  is sent to the coordinator for bus allocation.
                </p>
                <div className="flex items-center mt-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  <span>Your region: <span className="text-primary">{userRegion}</span></span>
                  <Badge variant="outline" className="ml-2 px-2 py-0">
                    {userRegion === "Hubli" ? "1.0× for Hubli, 0.5× for Dharwad votes" : "1.0× for Dharwad, 0.5× for Hubli votes"}
                  </Badge>
                </div>
              </div>
              <RequestBusDialog onSubmit={requestNewBus} isSubmitting={isSubmitting} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="active" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Active Votes
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Past Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 animate-fade-in">
          {isLoading ? (
            <Card className="border border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading voting topics...</p>
              </CardContent>
            </Card>
          ) : votingTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {votingTopics.map((vote) => (
                <Card 
                  key={vote.id} 
                  className={`overflow-hidden transition-all hover:shadow-md ${vote.hasVoted ? "border-primary/30" : ""}`}
                >
                  <CardHeader className="pb-2 relative">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{vote.title}</CardTitle>
                        <CardDescription>{vote.description}</CardDescription>
                      </div>
                      <Badge 
                        variant={vote.region === userRegion ? "default" : "outline"}
                        className={`${vote.region === userRegion ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        {vote.region}
                      </Badge>
                    </div>
                    {vote.region === userRegion && (
                      <div className="absolute -right-8 -top-8 bg-primary/10 rotate-45 w-24 h-24"></div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Progress: {vote.votes.toFixed(1)}/{vote.requiredVotes} votes</span>
                          <span>{Math.round((vote.votes / vote.requiredVotes) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(vote.votes / vote.requiredVotes) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Created {getTimeSince(vote.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>Expires {getTimeRemaining(vote.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/20 pt-3">
                    {vote.hasVoted ? (
                      <Button disabled className="w-full" variant="outline">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        You've Voted ({getVoteWeight(vote.region)} points)
                      </Button>
                    ) : (
                      <Button 
                        className="w-full relative overflow-hidden group" 
                        onClick={() => castVote(vote.id)}
                        disabled={isSubmitting}
                      >
                        <span className="relative z-10">
                          {isSubmitting ? 'Processing...' : `Vote Now (${getVoteWeight(vote.region)} points)`}
                        </span>
                        <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <Vote className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No active voting requests</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                  There are no active bus voting requests at the moment.
                  You can create a new request for additional buses.
                </p>
                <RequestBusDialog 
                  onSubmit={requestNewBus}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="animate-fade-in">
          {isLoading ? (
            <Card className="border border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading past voting topics...</p>
              </CardContent>
            </Card>
          ) : pastVotingTopics.length > 0 ? (
            <div className="space-y-4">
              {pastVotingTopics.map((vote) => (
                <Card key={vote.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{vote.title}</CardTitle>
                        <CardDescription>{vote.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={vote.region === userRegion ? "default" : "outline"}
                          className={`${vote.region === userRegion ? "bg-primary text-primary-foreground" : ""}`}
                        >
                          {vote.region}
                        </Badge>
                        <Badge 
                          variant={vote.status === "approved" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {vote.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Final Votes: {vote.votes}/{vote.requiredVotes}</span>
                          <span>{Math.round((vote.votes / vote.requiredVotes) * 100)}%</span>
                        </div>
                        <Progress 
                          value={100} 
                          className={`h-2 ${vote.status === "approved" ? "bg-primary" : "bg-muted-foreground"}`} 
                        />
                      </div>
                      
                      {vote.status === "rejected" && vote.rejectionReason && (
                        <div className="p-3 bg-destructive/10 rounded-md text-sm flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
                          <div>
                            <strong>Reason for rejection:</strong> {vote.rejectionReason}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">{vote.region}</Badge>
                        </div>
                        <div>Completed {getTimeSince(vote.createdAt)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-dashed bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <Vote className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No past voting requests</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                  There are no past bus voting requests at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StudentVoting;
