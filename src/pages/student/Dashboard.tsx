
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bus, Clock, MapPin, Users, AlertTriangle, Bell, Car, 
  ChevronRight, ExternalLink, ThumbsUp, Shield, User, Calendar,
  Truck, UserCheck, BarChart2, Map, ArrowRight, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast.tsx';
import { Link } from 'react-router-dom';
import { useBuses } from '@/hooks/useBuses';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useVotingTopics } from '@/hooks/useVotingTopics';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { buses, isLoading: busesLoading } = useBuses();
  const { announcements, isLoading: announcementsLoading } = useAnnouncements();
  const { 
    activeVotingTopic, 
    castVote, 
    isLoading: votingLoading 
  } = useVotingTopics();
  
  const [activeEmergency, setActiveEmergency] = useState(false);
  const [stats, setStats] = useState({
    busesUsed: 0,
    issuesReported: 0,
    votesParticipated: 0,
    averageRating: 0
  });
  
  // For demo purposes - in a real app, this would come from a backend
  useEffect(() => {
    setStats({
      busesUsed: 28,
      issuesReported: 3,
      votesParticipated: 7,
      averageRating: 4.2
    });
  }, []);
  
  const handleVote = async () => {
    if (activeVotingTopic && !activeVotingTopic.hasVoted) {
      await castVote(activeVotingTopic.id);
    }
  };
  
  const triggerEmergency = () => {
    setActiveEmergency(true);
    toast.error('Emergency alert sent to bus coordinator! Help is on the way.');
    
    // Auto-cancel emergency after 10 seconds (demo purposes only)
    setTimeout(() => {
      setActiveEmergency(false);
      toast.success('Emergency alert acknowledged by the coordinator.');
    }, 10000);
  };
  
  const cancelEmergency = () => {
    setActiveEmergency(false);
    toast.info('Emergency alert cancelled.');
  };
  
  // Filter for upcoming buses (next few)
  const upcomingBuses = buses.slice(0, 2);
  
  return (
    <DashboardLayout pageTitle="Student Dashboard">
      {/* Emergency Alert Button - Fixed at bottom right */}
      <div className="fixed bottom-8 right-8 z-20">
        {!activeEmergency ? (
          <Button 
            variant="destructive" 
            size="lg" 
            className="rounded-full shadow-xl hover:shadow-md transition-all h-16 w-16 p-0 flex items-center justify-center"
            onClick={triggerEmergency}
          >
            <Bell className="h-6 w-6" />
            <span className="sr-only">Emergency</span>
          </Button>
        ) : (
          <div className="relative animate-pulse">
            <Button 
              variant="destructive" 
              size="lg" 
              className="rounded-full shadow-xl hover:shadow-md transition-all h-16 w-16 p-0 animate-pulse flex items-center justify-center"
              onClick={cancelEmergency}
            >
              <div className="h-4 w-4 rounded-full bg-white animate-ping absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <Bell className="h-6 w-6" />
              <span className="sr-only">Cancel Emergency</span>
            </Button>
            <div className="text-white text-xs mt-2 bg-destructive/90 px-2 py-1 rounded-md whitespace-nowrap text-center shadow-lg">
              Click to cancel
            </div>
          </div>
        )}
      </div>
      
      {/* Welcome Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="border-0 overflow-hidden shadow-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
          <div className="absolute right-0 top-0 opacity-10">
            <Bus className="h-40 w-40 -mt-10 -mr-10 transform rotate-12" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h2>
                <p className="text-blue-100 max-w-md">
                  Track bus schedules, participate in voting for additional routes, and report any issues through your personalized dashboard.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/student/buses">
                    <Button size="sm" variant="secondary" className="gap-1 bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm">
                      <Bus className="h-4 w-4" />
                      View Buses
                    </Button>
                  </Link>
                  <Link to="/student/complaints">
                    <Button size="sm" variant="secondary" className="gap-1 bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm">
                      <AlertTriangle className="h-4 w-4" />
                      Report Issue
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 items-start">
                <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1.5 text-sm shadow-sm">
                  <User className="h-3.5 w-3.5 mr-1 inline" />
                  {user?.usn || 'Student ID'}
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1.5 text-sm shadow-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1 inline" />
                  {user?.region || 'Not specified'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
      
      {/* Usage Stats */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Buses Used</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.busesUsed}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Bus className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <span className="text-green-500 font-medium flex items-center">
                  <ArrowRight className="h-3 w-3 mr-0.5 rotate-45" />
                  +5 this month
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issues Reported</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.issuesReported}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <span className="text-green-500 font-medium flex items-center">
                  <CheckCircle className="h-3 w-3 mr-0.5" />
                  All resolved
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Votes Participated</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.votesParticipated}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <span className="text-blue-500 font-medium flex items-center">
                  <ArrowRight className="h-3 w-3 mr-0.5 rotate-45" />
                  2 successful
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.averageRating}/5</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                  <BarChart2 className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <div className="flex">
                  {[1, 2, 3, 4].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <svg className="w-3 h-3 text-yellow-400 half-star" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="halfGradient">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="#D1D5DB" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
      
      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Important Announcements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2"
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden border">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Announcements
                  </CardTitle>
                </div>
                <Badge variant="outline" className="gap-1 bg-amber-50 text-amber-600 border-amber-200">
                  <Bell className="h-3 w-3" />
                  <span>{announcements.length}</span>
                </Badge>
              </div>
              <CardDescription>
                Latest updates from the transportation department
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcementsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-muted-foreground text-center py-8 rounded-lg bg-muted/20">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No announcements at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement, index) => (
                    <motion.div
                      key={announcement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-colors border border-amber-100/60 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-amber-800">
                            {announcement.title}
                          </h3>
                          {announcement.important && (
                            <Badge variant="destructive" className="text-xs">Important</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground bg-white px-2 py-0.5 rounded-full shadow-sm">
                          {announcement.date.toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-amber-800/80">{announcement.content}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Bus Voting Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow overflow-hidden border">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">
                    Active Voting
                  </CardTitle>
                </div>
                <Link to="/student/voting">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Vote for additional buses when needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {votingLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : !activeVotingTopic ? (
                <div className="text-center py-8 rounded-lg bg-blue-50/50 border border-blue-100/60">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <p className="text-muted-foreground mb-4">No active voting requests at this time</p>
                  <Link to="/student/voting">
                    <Button variant="outline" className="w-full shadow-sm">
                      Start New Request
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg space-y-4 shadow-sm border border-blue-100/60">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-medium text-blue-700">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{activeVotingTopic.destination}</span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-700 bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">
                        <Clock className="h-3 w-3" />
                        <span>{activeVotingTopic.time}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Votes: {activeVotingTopic.votes}/{activeVotingTopic.requiredVotes}</span>
                        <span className="text-xs text-blue-700 font-medium">
                          {Math.round((activeVotingTopic.votes / activeVotingTopic.requiredVotes) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(activeVotingTopic.votes / activeVotingTopic.requiredVotes) * 100} 
                        className="h-2 bg-blue-100"
                      />
                    </div>
                    
                    <Button
                      onClick={handleVote}
                      className="w-full gap-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
                      disabled={activeVotingTopic.hasVoted || activeVotingTopic.votes >= activeVotingTopic.requiredVotes}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {activeVotingTopic.hasVoted 
                        ? 'You Voted!'
                        : activeVotingTopic.votes >= activeVotingTopic.requiredVotes 
                          ? 'Threshold Reached!' 
                          : 'Cast Your Vote'
                      }
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground text-center px-2 py-1 bg-blue-50 rounded-full">
                    <p>Each vote counts towards reaching the threshold!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Upcoming Buses */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming Buses
          </h2>
          <Link to="/student/buses">
            <Button variant="outline" size="sm" className="gap-1 hover:bg-blue-50 shadow-sm">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {busesLoading ? (
            <div className="col-span-2 flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : upcomingBuses.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <Bus className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>No upcoming buses scheduled at this time</p>
            </div>
          ) : (
            upcomingBuses.map((bus) => (
              <Card 
                key={bus.id} 
                className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-600" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-1 text-blue-800">
                        {bus.name}
                        <span className="text-xs text-muted-foreground ml-1">({bus.number})</span>
                      </h3>
                      {bus.driver && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Car className="h-3 w-3" />
                          <span>{bus.driver.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          bus.status === 'on-time' ? 'outline' : 
                          bus.status === 'delayed' ? 'secondary' : 'destructive'
                        }
                        className={`capitalize ${
                          bus.status === 'on-time' ? 'bg-green-50 text-green-600 border-green-200' : 
                          bus.status === 'delayed' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                          'bg-red-50 text-red-600 border-red-200'
                        }`}
                      >
                        {bus.status === 'on-time' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {bus.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded-md shadow-sm">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{bus.departureTime || '4:30 PM'}</span>
                    </div>
                    <div className="text-sm bg-blue-50 px-2 py-1 rounded-md shadow-sm">
                      <span className="font-medium text-blue-600">{bus.seats} seats</span>
                    </div>
                  </div>
                  
                  <div className="text-sm mb-4 bg-gray-50 p-3 rounded-lg shadow-sm">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{bus.route || 'Campus → Hubli Central → Railway Station'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="w-full gap-1 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                      <Map className="h-3.5 w-3.5" />
                      Route Details
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 hover:bg-blue-50 shadow-sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </motion.section>
      
      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/student/complaints">
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border-amber-100 hover:border-amber-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
              <CardContent className="p-4 flex flex-col h-full">
                <div className="mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-amber-700">Report Issue</h3>
                  <p className="text-xs text-muted-foreground mt-1">File complaints or suggestions</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/student/buses">
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border-blue-100 hover:border-blue-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              <CardContent className="p-4 flex flex-col h-full">
                <div className="mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
                  <Bus className="h-5 w-5 text-blue-500" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-blue-700">Bus Schedule</h3>
                  <p className="text-xs text-muted-foreground mt-1">View all routes and timings</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/student/voting">
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border-indigo-100 hover:border-indigo-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
              <CardContent className="p-4 flex flex-col h-full">
                <div className="mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-sm">
                  <Users className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-indigo-700">Bus Voting</h3>
                  <p className="text-xs text-muted-foreground mt-1">Request additional buses</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/student/profile">
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border-green-100 hover:border-green-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
              <CardContent className="p-4 flex flex-col h-full">
                <div className="mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-green-500" />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium text-green-700">My Profile</h3>
                  <p className="text-xs text-muted-foreground mt-1">Update personal information</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.section>
    </DashboardLayout>
  );
};

export default StudentDashboard;
