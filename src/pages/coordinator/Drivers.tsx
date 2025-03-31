
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Phone, Mail, Bus, Calendar, CheckCircle, AlertCircle, Search, User, Plus, UserCog, Clock, UserPlus } from "lucide-react";

// Mock data for drivers
const drivers = [
  {
    id: 1,
    name: "Dave Driver",
    email: "dave@example.com",
    phone: "9876543210",
    status: "available",
    joinDate: "Jan 15, 2023",
    rating: 4.8,
    busAssigned: "Varada Express",
    busNumber: "KA-01-F-1234",
    schedule: "Morning & Evening",
    recentTrips: 42,
    leaveBalance: 12,
  },
  {
    id: 2,
    name: "Sam Smith",
    email: "sam@example.com",
    phone: "8765432109",
    status: "available",
    joinDate: "Mar 10, 2023",
    rating: 4.5,
    busAssigned: "Shalmala Express",
    busNumber: "KA-01-F-5678",
    schedule: "Morning & Evening",
    recentTrips: 38,
    leaveBalance: 8,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "7654321098",
    status: "on-leave",
    joinDate: "Feb 5, 2023",
    rating: 4.6,
    busAssigned: "Malaprabha Express",
    busNumber: "KA-01-F-9012",
    schedule: "Morning & Evening",
    recentTrips: 29,
    leaveBalance: 3,
    leaveDetails: {
      from: "Oct 15, 2023",
      to: "Oct 20, 2023",
      reason: "Personal emergency"
    }
  },
  {
    id: 4,
    name: "Alan Walker",
    email: "alan@example.com",
    phone: "6543210987",
    status: "available",
    joinDate: "May 20, 2023",
    rating: 4.9,
    busAssigned: null,
    busNumber: null,
    schedule: null,
    recentTrips: 15,
    leaveBalance: 10,
  },
];

// Mock data for leaves
const leaveRequests = [
  {
    id: 101,
    driverId: 2,
    driverName: "Sam Smith",
    from: "Oct 25, 2023",
    to: "Oct 27, 2023",
    days: 3,
    reason: "Family function",
    status: "pending",
    dateRequested: "Oct 10, 2023",
  },
  {
    id: 102,
    driverId: 3,
    driverName: "Mike Johnson",
    from: "Oct 15, 2023",
    to: "Oct 20, 2023",
    days: 6,
    reason: "Personal emergency",
    status: "approved",
    dateRequested: "Oct 5, 2023",
    dateResponded: "Oct 6, 2023",
  },
];

// Mock data for trips
const recentTrips = [
  {
    id: 201,
    driverId: 1,
    driverName: "Dave Driver",
    busName: "Varada Express",
    route: "Campus to Hubli Central",
    date: "Today",
    departureTime: "5:15 PM",
    arrivalTime: "6:00 PM",
    status: "scheduled",
    passengers: 35,
  },
  {
    id: 202,
    driverId: 1,
    driverName: "Dave Driver",
    busName: "Varada Express",
    route: "Hubli Central to Campus",
    date: "Today",
    departureTime: "8:15 AM",
    arrivalTime: "9:00 AM",
    status: "completed",
    passengers: 42,
  },
  {
    id: 203,
    driverId: 2,
    driverName: "Sam Smith",
    busName: "Shalmala Express",
    route: "Campus to Dharwad",
    date: "Today",
    departureTime: "5:30 PM",
    arrivalTime: "6:15 PM",
    status: "scheduled",
    passengers: 38,
  },
];

const CoordinatorDrivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [leaveResponseDialogOpen, setLeaveResponseDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [leaveResponse, setLeaveResponse] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("approved");
  
  const handleViewDriver = (driver: any) => {
    setSelectedDriver(driver);
  };
  
  const handleRegisterDriver = () => {
    toast.success("Driver registration link sent successfully");
    setRegisterDialogOpen(false);
  };
  
  const handleLeaveResponse = (leave: any) => {
    setSelectedLeave(leave);
    setLeaveResponseDialogOpen(true);
  };
  
  const submitLeaveResponse = () => {
    toast.success(`Leave request ${leaveStatus}`);
    setLeaveResponseDialogOpen(false);
    setLeaveResponse("");
    setLeaveStatus("approved");
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'on-leave':
        return <Badge variant="secondary">On Leave</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm) ||
    (driver.busAssigned && driver.busAssigned.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout pageTitle="Driver Management">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">{drivers.length}</p>
              <UserCog className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Available</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">{drivers.filter(d => d.status === 'available').length}</p>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">On Leave</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">{drivers.filter(d => d.status === 'on-leave').length}</p>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold">{leaveRequests.filter(l => l.status === 'pending').length}</p>
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search drivers..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Register Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register New Driver</DialogTitle>
              <DialogDescription>
                Create a registration link for a new driver to join the platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver-email" className="text-right">Email</Label>
                <Input id="driver-email" type="email" placeholder="driver@example.com" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver-phone" className="text-right">Phone</Label>
                <Input id="driver-phone" placeholder="Phone number" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver-note" className="text-right">Note</Label>
                <Textarea id="driver-note" placeholder="Any additional information..." className="col-span-3" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRegisterDriver}>Send Registration Link</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="all">All Drivers</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
          <TabsTrigger value="trips">Recent Trips</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Bus Assigned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Recent Trips</TableHead>
                  <TableHead>Leave Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`/placeholder.svg`} alt={driver.name} />
                          <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-xs text-muted-foreground">Since {driver.joinDate}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="text-xs flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {driver.phone}
                        </div>
                        <div className="text-xs flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {driver.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {driver.busAssigned ? (
                        <>
                          <div>{driver.busAssigned}</div>
                          <div className="text-xs text-muted-foreground">{driver.busNumber}</div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(driver.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{driver.rating}</span>
                        <span className="text-yellow-500 ml-1">★</span>
                      </div>
                    </TableCell>
                    <TableCell>{driver.recentTrips}</TableCell>
                    <TableCell>{driver.leaveBalance} days</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDriver(driver)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>
                Manage driver leave applications and approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaveRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Requested On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <div className="font-medium">{leave.driverName}</div>
                        </TableCell>
                        <TableCell>
                          {leave.from} to {leave.to}
                        </TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>{leave.dateRequested}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          {leave.status === 'pending' ? (
                            <Button 
                              size="sm"
                              onClick={() => handleLeaveResponse(leave)}
                            >
                              Respond
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium">No pending leave requests</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                    There are no leave requests pending approval.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle>Recent & Upcoming Trips</CardTitle>
              <CardDescription>
                View driver trip assignments and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Passengers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>
                        <div className="font-medium">{trip.driverName}</div>
                      </TableCell>
                      <TableCell>{trip.busName}</TableCell>
                      <TableCell>{trip.route}</TableCell>
                      <TableCell>{trip.date}</TableCell>
                      <TableCell>
                        {trip.departureTime} - {trip.arrivalTime}
                      </TableCell>
                      <TableCell>{getStatusBadge(trip.status)}</TableCell>
                      <TableCell>{trip.passengers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Driver Detail Dialog */}
      {selectedDriver && (
        <Dialog open={!!selectedDriver} onOpenChange={(open) => !open && setSelectedDriver(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Driver Profile</DialogTitle>
              <DialogDescription>
                Detailed information and management options for {selectedDriver.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`/placeholder.svg`} alt={selectedDriver.name} />
                    <AvatarFallback className="text-xl">{selectedDriver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-lg font-medium">{selectedDriver.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="font-medium">{selectedDriver.rating}</span>
                    <span className="text-yellow-500 ml-1">★</span>
                  </div>
                  <Badge className="mt-2">{getStatusBadge(selectedDriver.status)}</Badge>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{selectedDriver.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>{selectedDriver.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Joined on {selectedDriver.joinDate}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Bus className="h-4 w-4 mr-2" />
                      Assign Bus
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Schedule
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-amber-600 border-amber-600">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="leaves">Leave History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Bus Assignment</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {selectedDriver.busAssigned ? (
                            <div>
                              <p className="font-medium">{selectedDriver.busAssigned}</p>
                              <p className="text-sm text-muted-foreground">{selectedDriver.busNumber}</p>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Not currently assigned</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {selectedDriver.schedule ? (
                            <p>{selectedDriver.schedule}</p>
                          ) : (
                            <p className="text-muted-foreground">No schedule assigned</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Recent Trips</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="font-medium">{selectedDriver.recentTrips} trips</p>
                          <p className="text-sm text-muted-foreground">In the last 30 days</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Leave Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="font-medium">{selectedDriver.leaveBalance} days</p>
                          <p className="text-sm text-muted-foreground">Remaining for this year</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {selectedDriver.status === 'on-leave' && selectedDriver.leaveDetails && (
                      <Card className="border-amber-200 bg-amber-50">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-amber-500" />
                            Currently On Leave
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">From</p>
                              <p className="font-medium">{selectedDriver.leaveDetails.from}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">To</p>
                              <p className="font-medium">{selectedDriver.leaveDetails.to}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Reason</p>
                              <p className="font-medium">{selectedDriver.leaveDetails.reason}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Schedule & Trips</CardTitle>
                        <CardDescription>
                          View and manage driver's schedule and trips
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                          <h3 className="text-lg font-medium">Schedule Details Coming Soon</h3>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                            We're working on a detailed schedule view for drivers.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="leaves" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Leave History</CardTitle>
                        <CardDescription>
                          Past and pending leave requests
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {leaveRequests.filter(leave => leave.driverId === selectedDriver.id).length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Days</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Requested On</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {leaveRequests
                                .filter(leave => leave.driverId === selectedDriver.id)
                                .map((leave) => (
                                  <TableRow key={leave.id}>
                                    <TableCell>
                                      {leave.from} to {leave.to}
                                    </TableCell>
                                    <TableCell>{leave.days}</TableCell>
                                    <TableCell>{leave.reason}</TableCell>
                                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                                    <TableCell>{leave.dateRequested}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">No leave history found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Leave Response Dialog */}
      <Dialog open={leaveResponseDialogOpen} onOpenChange={setLeaveResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Leave Request</DialogTitle>
            <DialogDescription>
              {selectedLeave && (
                <>Review leave request from {selectedLeave.driverName}</>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedLeave && (
            <div className="py-4">
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">From</Label>
                    <p className="font-medium">{selectedLeave.from}</p>
                  </div>
                  <div>
                    <Label className="text-sm">To</Label>
                    <p className="font-medium">{selectedLeave.to}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Reason</Label>
                  <p className="font-medium">{selectedLeave.reason}</p>
                </div>
                <div>
                  <Label className="text-sm">Total Days</Label>
                  <p className="font-medium">{selectedLeave.days} days</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leave-status" className="text-sm">Your Decision</Label>
                  <RadioGroup 
                    defaultValue="approved" 
                    className="flex flex-col space-y-1 mt-2"
                    value={leaveStatus}
                    onValueChange={setLeaveStatus}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="approved" id="approve" />
                      <Label htmlFor="approve" className="font-normal">Approve Request</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rejected" id="reject" />
                      <Label htmlFor="reject" className="font-normal">Reject Request</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="leave-response" className="text-sm">Response Note (Optional)</Label>
                  <Textarea 
                    id="leave-response" 
                    placeholder="Add any notes or reason for your decision..." 
                    rows={3}
                    value={leaveResponse}
                    onChange={(e) => setLeaveResponse(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaveResponseDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={submitLeaveResponse}
              variant={leaveStatus === "approved" ? "default" : "destructive"}
            >
              {leaveStatus === "approved" ? "Approve" : "Reject"} Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CoordinatorDrivers;
