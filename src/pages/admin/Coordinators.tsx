
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Search, UserPlus, Filter, Eye, Edit, Trash2, MoreHorizontal, Check, X, Mail, Phone, MapPin, Bus, Calendar } from "lucide-react";

// Mock data for coordinators
const coordinators = [
  {
    id: 1,
    name: "Clara Coordinator",
    email: "clara@example.com",
    phone: "9876543210",
    region: "Hubli",
    status: "active",
    joinDate: "Jan 10, 2023",
    busesManaged: 3,
    performance: "excellent",
  },
  {
    id: 2,
    name: "Chris Coordinator",
    email: "chris@example.com",
    phone: "8765432109",
    region: "Dharwad",
    status: "active",
    joinDate: "Feb 15, 2023",
    busesManaged: 2,
    performance: "good",
  },
  {
    id: 3,
    name: "Corey Coordinator",
    email: "corey@example.com",
    phone: "7654321098",
    region: "Hubli",
    status: "inactive",
    joinDate: "Mar 20, 2023",
    busesManaged: 0,
    performance: "n/a",
  },
];

// Mock data for performance
const performance = [
  {
    coordinatorId: 1,
    month: "May 2023",
    complaintsResolved: 15,
    totalComplaints: 18,
    resolutionRate: "83%",
    averageResolutionTime: "1.2 days",
    voteRequests: 5,
    approvedVotes: 4,
    feedback: 4.7,
  },
  {
    coordinatorId: 1,
    month: "April 2023",
    complaintsResolved: 12,
    totalComplaints: 15,
    resolutionRate: "80%",
    averageResolutionTime: "1.5 days",
    voteRequests: 3,
    approvedVotes: 3,
    feedback: 4.5,
  },
  {
    coordinatorId: 2,
    month: "May 2023",
    complaintsResolved: 10,
    totalComplaints: 14,
    resolutionRate: "71%",
    averageResolutionTime: "2.1 days",
    voteRequests: 4,
    approvedVotes: 3,
    feedback: 4.2,
  },
];

// Mock data for buses managed by coordinators
const managedBuses = [
  {
    coordinatorId: 1,
    busId: 1,
    busName: "Varada Express",
    busNumber: "KA-01-F-1234",
    route: "College Campus ↔ Hubli Central",
    status: "active",
  },
  {
    coordinatorId: 1,
    busId: 2,
    busName: "Shalmala Express",
    busNumber: "KA-01-F-5678",
    route: "College Campus ↔ Dharwad",
    status: "active",
  },
  {
    coordinatorId: 1,
    busId: 3,
    busName: "Malaprabha Express",
    busNumber: "KA-01-F-9012",
    route: "College Campus ↔ CBT",
    status: "maintenance",
  },
  {
    coordinatorId: 2,
    busId: 4,
    busName: "Tungabhadra Express",
    busNumber: "KA-01-F-3456",
    route: "College Campus ↔ Keshwapur",
    status: "active",
  },
  {
    coordinatorId: 2,
    busId: 5,
    busName: "Krishna Express",
    busNumber: "KA-01-F-7890",
    route: "College Campus ↔ Vidyanagar",
    status: "active",
  },
];

const AdminCoordinators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addCoordinatorDialogOpen, setAddCoordinatorDialogOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddCoordinator = () => {
    toast.success("Coordinator added successfully");
    setAddCoordinatorDialogOpen(false);
  };
  
  const handleViewCoordinator = (coordinator: any) => {
    setSelectedCoordinator(coordinator);
    setDetailsDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPerformanceBadge = (performance: string) => {
    switch(performance) {
      case 'excellent':
        return <Badge className="bg-green-500">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500">Good</Badge>;
      case 'average':
        return <Badge variant="outline">Average</Badge>;
      case 'poor':
        return <Badge variant="destructive">Poor</Badge>;
      case 'n/a':
        return <Badge variant="outline">N/A</Badge>;
      default:
        return <Badge variant="outline">{performance}</Badge>;
    }
  };
  
  // Filter data based on search term
  const filteredCoordinators = coordinators.filter(coordinator => 
    coordinator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.region.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter buses for selected coordinator
  const getCoordinatorBuses = (coordinatorId: number) => {
    return managedBuses.filter(bus => bus.coordinatorId === coordinatorId);
  };
  
  // Filter performance for selected coordinator
  const getCoordinatorPerformance = (coordinatorId: number) => {
    return performance.filter(record => record.coordinatorId === coordinatorId);
  };

  return (
    <DashboardLayout pageTitle="Coordinator Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Coordinator Management</CardTitle>
            <CardDescription>
              Manage bus coordinators and their regional assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search coordinators..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <Dialog open={addCoordinatorDialogOpen} onOpenChange={setAddCoordinatorDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Coordinator
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Coordinator</DialogTitle>
                    <DialogDescription>
                      Create a new bus coordinator account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coordinator-name" className="text-right">Full Name</Label>
                      <Input id="coordinator-name" placeholder="Full name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coordinator-email" className="text-right">Email</Label>
                      <Input id="coordinator-email" type="email" placeholder="Email address" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coordinator-phone" className="text-right">Phone</Label>
                      <Input id="coordinator-phone" placeholder="Phone number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coordinator-region" className="text-right">Region</Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hubli">Hubli</SelectItem>
                          <SelectItem value="dharwad">Dharwad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="coordinator-password" className="text-right">Password</Label>
                      <Input id="coordinator-password" type="password" placeholder="Set a password" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddCoordinatorDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddCoordinator}>Add Coordinator</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Total Coordinators</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{coordinators.length}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Active</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{coordinators.filter(c => c.status === 'active').length}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Buses Managed</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{managedBuses.length}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coordinators</CardTitle>
            <CardDescription>
              All bus coordinators in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Buses Managed</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoordinators.map((coordinator) => (
                    <TableRow key={coordinator.id}>
                      <TableCell className="font-medium">{coordinator.name}</TableCell>
                      <TableCell>{coordinator.email}</TableCell>
                      <TableCell>{coordinator.phone}</TableCell>
                      <TableCell>{coordinator.region}</TableCell>
                      <TableCell>{coordinator.busesManaged}</TableCell>
                      <TableCell>{getPerformanceBadge(coordinator.performance)}</TableCell>
                      <TableCell>{getStatusBadge(coordinator.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewCoordinator(coordinator)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bus className="h-4 w-4 mr-2" />
                              Assign Buses
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Coordinator Details Dialog */}
        {selectedCoordinator && (
          <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Coordinator Details</DialogTitle>
                <DialogDescription>
                  Detailed information for {selectedCoordinator.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={`/placeholder.svg`} alt={selectedCoordinator.name} />
                      <AvatarFallback className="text-xl">{selectedCoordinator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{selectedCoordinator.name}</h2>
                    <div className="mt-1 flex gap-2">
                      {getStatusBadge(selectedCoordinator.status)}
                      {getPerformanceBadge(selectedCoordinator.performance)}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{selectedCoordinator.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{selectedCoordinator.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Region: {selectedCoordinator.region}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>Joined: {selectedCoordinator.joinDate}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <h3 className="text-sm font-semibold">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bus className="h-4 w-4 mr-2" />
                        Assign Buses
                      </Button>
                    </div>
                    {selectedCoordinator.status === 'active' ? (
                      <Button variant="outline" size="sm" className="w-full text-destructive border-destructive">
                        <X className="h-4 w-4 mr-2" />
                        Deactivate
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full text-green-600 border-green-600">
                        <Check className="h-4 w-4 mr-2" />
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="buses">Managed Buses</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Performance Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Buses Managed</p>
                              <p className="text-lg font-semibold">{selectedCoordinator.busesManaged}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Region</p>
                              <p className="text-lg font-semibold">{selectedCoordinator.region}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Complaint Resolution</p>
                              <p className="text-lg font-semibold">
                                {performance.find(p => p.coordinatorId === selectedCoordinator.id)?.resolutionRate || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Average Resolution Time</p>
                              <p className="text-lg font-semibold">
                                {performance.find(p => p.coordinatorId === selectedCoordinator.id)?.averageResolutionTime || "N/A"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedCoordinator.id === 1 ? (
                              <>
                                <div className="border-l-2 border-primary pl-4 py-2">
                                  <p className="text-sm font-medium">Resolved a complaint</p>
                                  <p className="text-xs text-muted-foreground">Today at 2:30 PM</p>
                                </div>
                                <div className="border-l-2 border-primary pl-4 py-2">
                                  <p className="text-sm font-medium">Approved a bus voting request</p>
                                  <p className="text-xs text-muted-foreground">Today at 11:15 AM</p>
                                </div>
                                <div className="border-l-2 border-primary pl-4 py-2">
                                  <p className="text-sm font-medium">Updated a bus schedule</p>
                                  <p className="text-xs text-muted-foreground">Yesterday at 4:00 PM</p>
                                </div>
                              </>
                            ) : (
                              <p className="text-center py-4 text-muted-foreground">No recent activity</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="buses" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Buses Managed by {selectedCoordinator.name}</CardTitle>
                          <CardDescription>All buses assigned to this coordinator</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {getCoordinatorBuses(selectedCoordinator.id).length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Bus Name</TableHead>
                                  <TableHead>Number</TableHead>
                                  <TableHead>Route</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getCoordinatorBuses(selectedCoordinator.id).map((bus) => (
                                  <TableRow key={bus.busId}>
                                    <TableCell className="font-medium">{bus.busName}</TableCell>
                                    <TableCell>{bus.busNumber}</TableCell>
                                    <TableCell>{bus.route}</TableCell>
                                    <TableCell>{getStatusBadge(bus.status)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              No buses assigned to this coordinator
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="performance" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                          <CardDescription>Historical performance data</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {getCoordinatorPerformance(selectedCoordinator.id).length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Month</TableHead>
                                  <TableHead>Complaints Resolved</TableHead>
                                  <TableHead>Resolution Rate</TableHead>
                                  <TableHead>Avg. Resolution Time</TableHead>
                                  <TableHead>Vote Requests</TableHead>
                                  <TableHead>Feedback</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {getCoordinatorPerformance(selectedCoordinator.id).map((record, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium">{record.month}</TableCell>
                                    <TableCell>{record.complaintsResolved}/{record.totalComplaints}</TableCell>
                                    <TableCell>{record.resolutionRate}</TableCell>
                                    <TableCell>{record.averageResolutionTime}</TableCell>
                                    <TableCell>{record.approvedVotes}/{record.voteRequests}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center">
                                        <span>{record.feedback}</span>
                                        <span className="text-yellow-500 ml-1">★</span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-center py-6 text-muted-foreground">
                              No performance data available
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
      </div>
    </DashboardLayout>
  );
};

export default AdminCoordinators;
