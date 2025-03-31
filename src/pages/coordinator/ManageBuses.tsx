
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bus, Edit2, MapPin, Route, Clock, Trash2, Plus, Users } from "lucide-react";
import { toast } from "sonner";

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
  },
  {
    id: 2,
    name: "Shalmala Express",
    number: "KA-01-F-5678",
    capacity: 45,
    status: "active",
    driver: "Sam Smith",
    route: "College Campus ↔ Dharwad",
  },
  {
    id: 3,
    name: "Malaprabha Express",
    number: "KA-01-F-9012",
    capacity: 45,
    status: "maintenance",
    driver: "Mike Johnson",
    route: "College Campus ↔ CBT",
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
  },
  {
    id: 2,
    name: "Dharwad Route",
    description: "From campus to Dharwad Bus Stand",
    stops: ["College Campus", "Toll Naka", "Court Circle", "Dharwad Bus Stand"],
    busAssigned: "Shalmala Express",
  },
  {
    id: 3,
    name: "CBT Route",
    description: "From campus to CBT",
    stops: ["College Campus", "Unkal Cross", "Gokul Road", "CBT"],
    busAssigned: "Malaprabha Express",
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
];

// Mock data for drivers
const drivers = [
  { id: 1, name: "Dave Driver", contact: "9876543210", status: "available" },
  { id: 2, name: "Sam Smith", contact: "8765432109", status: "available" },
  { id: 3, name: "Mike Johnson", contact: "7654321098", status: "on-leave" },
  { id: 4, name: "Alan Walker", contact: "6543210987", status: "available" },
];

const CoordinatorManageBuses = () => {
  const [busDialogOpen, setBusDialogOpen] = useState(false);
  const [routeDialogOpen, setRouteDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  
  const handleAddBus = () => {
    toast.success("Bus added successfully");
    setBusDialogOpen(false);
  };
  
  const handleAddRoute = () => {
    toast.success("Route added successfully");
    setRouteDialogOpen(false);
  };
  
  const handleAddSchedule = () => {
    toast.success("Schedule added successfully");
    setScheduleDialogOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'on-leave':
        return <Badge variant="outline">On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout pageTitle="Manage Buses">
      <Tabs defaultValue="buses" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-6">
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="buses">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Bus Management</h2>
            <Dialog open={busDialogOpen} onOpenChange={setBusDialogOpen}>
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
                    Enter the details of the new bus to add it to the fleet.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bus-name" className="text-right">Name</Label>
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
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id.toString()}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setBusDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddBus}>Add Bus</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell className="font-medium">{bus.name}</TableCell>
                    <TableCell>{bus.number}</TableCell>
                    <TableCell>{bus.capacity}</TableCell>
                    <TableCell>{bus.driver}</TableCell>
                    <TableCell>{bus.route}</TableCell>
                    <TableCell>{getStatusBadge(bus.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="routes">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Route Management</h2>
            <Dialog open={routeDialogOpen} onOpenChange={setRouteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Route</DialogTitle>
                  <DialogDescription>
                    Define a new bus route with stops and details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="route-name" className="text-right">Name</Label>
                    <Input id="route-name" placeholder="e.g. Hubli Route" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="route-description" className="text-right">Description</Label>
                    <Input id="route-description" placeholder="Brief description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="route-stops" className="text-right">Stops</Label>
                    <Textarea 
                      id="route-stops" 
                      placeholder="Enter stops (one per line)" 
                      className="col-span-3"
                    />
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
                            {bus.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRouteDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRoute}>Add Route</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {routes.map((route) => (
              <Card key={route.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Route className="h-5 w-5 text-primary mr-2" />
                    {route.name}
                  </CardTitle>
                  <CardDescription>{route.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Bus Assigned</Label>
                      <p className="text-sm font-medium mt-1">{route.busAssigned}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Stops</Label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {route.stops.map((stop, index) => (
                          <div key={index} className="flex items-center text-xs">
                            <Badge variant="outline" className="font-normal">
                              {stop}
                            </Badge>
                            {index < route.stops.length - 1 && (
                              <span className="mx-1">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedules">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Schedule Management</h2>
            <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Schedule</DialogTitle>
                  <DialogDescription>
                    Create a new bus schedule for regular or special trips.
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
                    <Label htmlFor="departure-time" className="text-right">Departure</Label>
                    <Input id="departure-time" type="time" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="arrival-time" className="text-right">Arrival</Label>
                    <Input id="arrival-time" type="time" className="col-span-3" />
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
                  <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddSchedule}>Add Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
                {schedules.map((schedule) => (
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="drivers">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Driver Assignment</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Driver
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{driver.name}</CardTitle>
                    {getStatusBadge(driver.status)}
                  </div>
                  <CardDescription>ID: {driver.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Contact Number</Label>
                      <p className="text-sm font-medium mt-1">{driver.contact}</p>
                    </div>
                    <div>
                      <Label className="text-sm">Current Assignment</Label>
                      <p className="text-sm font-medium mt-1">
                        {driver.status === 'available' 
                          ? buses.find(bus => bus.driver === driver.name)?.name || 'Not Assigned'
                          : 'On Leave'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Bus className="h-4 w-4 mr-2" />
                    Assign Bus
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CoordinatorManageBuses;
