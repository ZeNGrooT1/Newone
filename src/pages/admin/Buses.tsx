
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Search, Filter, Edit, Trash2, Bus, MoreHorizontal, Plus, Settings, Route as RouteIcon, MapPin, User, Clock, Calendar } from "lucide-react";

// Mock data for buses
const buses = [
  {
    id: 1,
    name: "Varada Express",
    number: "KA-01-F-1234",
    capacity: 45,
    status: "active",
    driver: "Dave Driver",
    route: "College Campus ↔ Hubli Central",
    lastMaintenance: "Jan 15, 2023",
    nextMaintenance: "Jul 15, 2023",
  },
  {
    id: 2,
    name: "Shalmala Express",
    number: "KA-01-F-5678",
    capacity: 45,
    status: "active",
    driver: "Sam Smith",
    route: "College Campus ↔ Dharwad",
    lastMaintenance: "Feb 10, 2023",
    nextMaintenance: "Aug 10, 2023",
  },
  {
    id: 3,
    name: "Malaprabha Express",
    number: "KA-01-F-9012",
    capacity: 45,
    status: "maintenance",
    driver: "Mike Johnson",
    route: "College Campus ↔ CBT",
    lastMaintenance: "In progress",
    nextMaintenance: "N/A",
  },
  {
    id: 4,
    name: "Tungabhadra Express",
    number: "KA-01-F-3456",
    capacity: 45,
    status: "active",
    driver: "Alan Walker",
    route: "College Campus ↔ Keshwapur",
    lastMaintenance: "Mar 5, 2023",
    nextMaintenance: "Sep 5, 2023",
  },
  {
    id: 5,
    name: "Krishna Express",
    number: "KA-01-F-7890",
    capacity: 45,
    status: "maintenance",
    driver: "Unassigned",
    route: "College Campus ↔ Vidyanagar",
    lastMaintenance: "In progress",
    nextMaintenance: "N/A",
  },
];

// Mock data for routes
const routes = [
  {
    id: 1,
    name: "Hubli Route",
    description: "From campus to Hubli Central",
    stops: ["College Campus", "Vidyanagar", "Keshwapur", "Hubli Central"],
    busAssigned: "Varada Express",
    distance: "15 km",
    travelTime: "45 min",
  },
  {
    id: 2,
    name: "Dharwad Route",
    description: "From campus to Dharwad Bus Stand",
    stops: ["College Campus", "Toll Naka", "Court Circle", "Dharwad Bus Stand"],
    busAssigned: "Shalmala Express",
    distance: "10 km",
    travelTime: "30 min",
  },
  {
    id: 3,
    name: "CBT Route",
    description: "From campus to CBT",
    stops: ["College Campus", "Unkal Cross", "Gokul Road", "CBT"],
    busAssigned: "Malaprabha Express",
    distance: "18 km",
    travelTime: "50 min",
  },
  {
    id: 4,
    name: "Keshwapur Route",
    description: "From campus to Keshwapur",
    stops: ["College Campus", "Vidyanagar", "Keshwapur"],
    busAssigned: "Tungabhadra Express",
    distance: "12 km",
    travelTime: "35 min",
  },
  {
    id: 5,
    name: "Vidyanagar Route",
    description: "From campus to Vidyanagar",
    stops: ["College Campus", "Vidyanagar"],
    busAssigned: "Krishna Express",
    distance: "8 km",
    travelTime: "20 min",
  },
];

// Mock data for schedules
const schedules = [
  {
    id: 1,
    busName: "Varada Express",
    route: "Hubli Route",
    departureTime: "08:15 AM",
    departureLocation: "College Campus",
    arrivalTime: "09:00 AM",
    arrivalLocation: "Hubli Central",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    type: "Regular",
  },
  {
    id: 2,
    busName: "Varada Express",
    route: "Hubli Route",
    departureTime: "05:15 PM",
    departureLocation: "Hubli Central",
    arrivalTime: "06:00 PM",
    arrivalLocation: "College Campus",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    type: "Regular",
  },
  {
    id: 3,
    busName: "Shalmala Express",
    route: "Dharwad Route",
    departureTime: "08:30 AM",
    departureLocation: "College Campus",
    arrivalTime: "09:15 AM",
    arrivalLocation: "Dharwad Bus Stand",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    type: "Regular",
  },
  {
    id: 4,
    busName: "Shalmala Express",
    route: "Dharwad Route",
    departureTime: "05:30 PM",
    departureLocation: "Dharwad Bus Stand",
    arrivalTime: "06:15 PM",
    arrivalLocation: "College Campus",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    type: "Regular",
  },
];

// Mock data for maintenance
const maintenance = [
  {
    id: 1,
    busName: "Malaprabha Express",
    busNumber: "KA-01-F-9012",
    type: "Periodic Service",
    startDate: "Jun 10, 2023",
    expectedEndDate: "Jun 15, 2023",
    status: "in-progress",
    description: "Routine maintenance and oil change",
    cost: "₹8,500",
  },
  {
    id: 2,
    busName: "Krishna Express",
    busNumber: "KA-01-F-7890",
    type: "Repair",
    startDate: "Jun 8, 2023",
    expectedEndDate: "Jun 20, 2023",
    status: "in-progress",
    description: "AC repair and brake system overhaul",
    cost: "₹25,000",
  },
  {
    id: 3,
    busName: "Varada Express",
    busNumber: "KA-01-F-1234",
    type: "Periodic Service",
    startDate: "Jan 10, 2023",
    expectedEndDate: "Jan 15, 2023",
    status: "completed",
    description: "Routine maintenance and oil change",
    cost: "₹7,800",
  },
];

const AdminBuses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addBusDialogOpen, setAddBusDialogOpen] = useState(false);
  const [addRouteDialogOpen, setAddRouteDialogOpen] = useState(false);
  const [addScheduleDialogOpen, setAddScheduleDialogOpen] = useState(false);
  const [addMaintenanceDialogOpen, setAddMaintenanceDialogOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddBus = () => {
    toast.success("Bus added successfully");
    setAddBusDialogOpen(false);
  };
  
  const handleAddRoute = () => {
    toast.success("Route added successfully");
    setAddRouteDialogOpen(false);
  };
  
  const handleAddSchedule = () => {
    toast.success("Schedule added successfully");
    setAddScheduleDialogOpen(false);
  };
  
  const handleAddMaintenance = () => {
    toast.success("Maintenance record added successfully");
    setAddMaintenanceDialogOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter data based on search term
  const filteredBuses = buses.filter(bus => 
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.busAssigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.stops.some(stop => stop.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredSchedules = schedules.filter(schedule => 
    schedule.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.departureLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.arrivalLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMaintenance = maintenance.filter(record => 
    record.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="Bus Fleet Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bus Fleet Management</CardTitle>
            <CardDescription>
              Manage your bus fleet, routes, schedules, and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search buses, routes..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Dialog open={addBusDialogOpen} onOpenChange={setAddBusDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bus
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Bus</DialogTitle>
                      <DialogDescription>
                        Add a new bus to your fleet
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bus-name" className="text-right">Bus Name</Label>
                        <Input id="bus-name" placeholder="e.g. Varada Express" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bus-number" className="text-right">Number</Label>
                        <Input id="bus-number" placeholder="e.g. KA-01-F-1234" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bus-capacity" className="text-right">Capacity</Label>
                        <Input id="bus-capacity" type="number" defaultValue="45" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bus-driver" className="text-right">Driver</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Assign driver" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dave">Dave Driver</SelectItem>
                            <SelectItem value="sam">Sam Smith</SelectItem>
                            <SelectItem value="mike">Mike Johnson</SelectItem>
                            <SelectItem value="alan">Alan Walker</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bus-route" className="text-right">Route</Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Assign route" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hubli">Hubli Route</SelectItem>
                            <SelectItem value="dharwad">Dharwad Route</SelectItem>
                            <SelectItem value="cbt">CBT Route</SelectItem>
                            <SelectItem value="keshwapur">Keshwapur Route</SelectItem>
                            <SelectItem value="vidyanagar">Vidyanagar Route</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddBusDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddBus}>Add Bus</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Management Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setAddRouteDialogOpen(true)}>
                      <RouteIcon className="h-4 w-4 mr-2" />
                      Add Route
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAddScheduleDialogOpen(true)}>
                      <Clock className="h-4 w-4 mr-2" />
                      Add Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAddMaintenanceDialogOpen(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Add Maintenance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Total Buses</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{buses.length}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Active</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{buses.filter(bus => bus.status === 'active').length}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{buses.filter(bus => bus.status === 'maintenance').length}</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Routes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{routes.length}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="buses" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-6">
            <TabsTrigger value="buses">Buses</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="buses">
            <Card>
              <CardHeader>
                <CardTitle>Bus Fleet</CardTitle>
                <CardDescription>
                  Manage your bus fleet and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Last Maintenance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBuses.map((bus) => (
                        <TableRow key={bus.id}>
                          <TableCell className="font-medium">{bus.name}</TableCell>
                          <TableCell>{bus.number}</TableCell>
                          <TableCell>{bus.capacity}</TableCell>
                          <TableCell>{bus.driver}</TableCell>
                          <TableCell>{bus.route}</TableCell>
                          <TableCell>{bus.lastMaintenance}</TableCell>
                          <TableCell>{getStatusBadge(bus.status)}</TableCell>
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
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <User className="h-4 w-4 mr-2" />
                                  Assign Driver
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Maintenance
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
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Routes</CardTitle>
                <CardDescription>
                  Manage bus routes and stops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Stops</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Travel Time</TableHead>
                        <TableHead>Bus Assigned</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoutes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell className="font-medium">{route.name}</TableCell>
                          <TableCell>{route.description}</TableCell>
                          <TableCell>
                            {route.stops.map((stop, index) => (
                              <span key={index}>
                                {stop}
                                {index < route.stops.length - 1 ? " → " : ""}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell>{route.distance}</TableCell>
                          <TableCell>{route.travelTime}</TableCell>
                          <TableCell>{route.busAssigned}</TableCell>
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
                                <DropdownMenuItem>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  View on Map
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bus className="h-4 w-4 mr-2" />
                                  Assign Bus
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
          </TabsContent>

          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle>Schedules</CardTitle>
                <CardDescription>
                  Manage bus schedules and timings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bus</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                          <TableCell className="font-medium">{schedule.busName}</TableCell>
                          <TableCell>{schedule.route}</TableCell>
                          <TableCell>
                            {schedule.departureTime}<br />
                            <span className="text-xs text-muted-foreground">{schedule.departureLocation}</span>
                          </TableCell>
                          <TableCell>
                            {schedule.arrivalTime}<br />
                            <span className="text-xs text-muted-foreground">{schedule.arrivalLocation}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {schedule.days.map((day, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {day.substring(0, 3)}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{schedule.type}</TableCell>
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
                                <DropdownMenuItem>
                                  <Clock className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
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
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Records</CardTitle>
                <CardDescription>
                  Track bus maintenance and service history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bus</TableHead>
                        <TableHead>Number</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Expected End</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaintenance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.busName}</TableCell>
                          <TableCell>{record.busNumber}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell>{record.startDate}</TableCell>
                          <TableCell>{record.expectedEndDate}</TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                          <TableCell>{record.cost}</TableCell>
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
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Mark as Completed
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
          </TabsContent>
        </Tabs>

        {/* Add Route Dialog */}
        <Dialog open={addRouteDialogOpen} onOpenChange={setAddRouteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Route</DialogTitle>
              <DialogDescription>
                Create a new bus route with stops and details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route-name" className="text-right">Route Name</Label>
                <Input id="route-name" placeholder="e.g. Hubli Route" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route-description" className="text-right">Description</Label>
                <Input id="route-description" placeholder="Brief description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route-stops" className="text-right">Stops</Label>
                <Input id="route-stops" placeholder="Enter stops separated by commas" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route-distance" className="text-right">Distance</Label>
                <Input id="route-distance" placeholder="e.g. 15 km" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route-time" className="text-right">Travel Time</Label>
                <Input id="route-time" placeholder="e.g. 45 min" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route-bus" className="text-right">Assign Bus</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map(bus => (
                      <SelectItem key={bus.id} value={bus.id.toString()}>
                        {bus.name} ({bus.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddRouteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddRoute}>Add Route</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Schedule Dialog */}
        <Dialog open={addScheduleDialogOpen} onOpenChange={setAddScheduleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
              <DialogDescription>
                Create a new bus schedule
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-bus" className="text-right">Bus</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map(bus => (
                      <SelectItem key={bus.id} value={bus.id.toString()}>
                        {bus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-route" className="text-right">Route</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => (
                      <SelectItem key={route.id} value={route.id.toString()}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departure-time" className="text-right">Departure Time</Label>
                <Input id="departure-time" type="time" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arrival-time" className="text-right">Arrival Time</Label>
                <Input id="arrival-time" type="time" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-departure" className="text-right">Departure From</Label>
                <Input id="schedule-departure" placeholder="e.g. College Campus" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-arrival" className="text-right">Arrival At</Label>
                <Input id="schedule-arrival" placeholder="e.g. Hubli Central" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Days</Label>
                <div className="flex flex-wrap gap-2 col-span-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <Badge key={day} variant="outline" className="cursor-pointer">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddScheduleDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSchedule}>Add Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Maintenance Dialog */}
        <Dialog open={addMaintenanceDialogOpen} onOpenChange={setAddMaintenanceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Maintenance Record</DialogTitle>
              <DialogDescription>
                Log a new maintenance activity for a bus
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-bus" className="text-right">Bus</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select bus" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map(bus => (
                      <SelectItem key={bus.id} value={bus.id.toString()}>
                        {bus.name} ({bus.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="periodic">Periodic Service</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-start" className="text-right">Start Date</Label>
                <Input id="maintenance-start" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-end" className="text-right">Expected End</Label>
                <Input id="maintenance-end" type="date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-cost" className="text-right">Estimated Cost</Label>
                <Input id="maintenance-cost" placeholder="e.g. ₹10,000" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-description" className="text-right">Description</Label>
                <Input id="maintenance-description" placeholder="Describe the maintenance work" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddMaintenanceDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddMaintenance}>Add Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminBuses;
