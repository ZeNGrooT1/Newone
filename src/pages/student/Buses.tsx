
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bus, Clock, MapPin, User, Calendar, AlertCircle, Map, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for buses
const buses = [
  {
    id: 1,
    name: "Varada Express",
    number: "KA-01-F-1234",
    route: "College Campus ↔ Hubli Central",
    driver: "Dave Driver",
    capacity: 45,
    currentOccupancy: 32,
    departureTime: "08:15 AM",
    arrivalTime: "09:00 AM",
    nextDeparture: "05:15 PM",
    stops: ["College Campus", "Vidyanagar", "Keshwapur", "Hubli Central"],
    status: "on-time",
  },
  {
    id: 2,
    name: "Shalmala Express",
    number: "KA-01-F-5678",
    route: "College Campus ↔ Dharwad",
    driver: "Sam Smith",
    capacity: 45,
    currentOccupancy: 38,
    departureTime: "08:30 AM",
    arrivalTime: "09:15 AM",
    nextDeparture: "05:30 PM",
    stops: ["College Campus", "Toll Naka", "Court Circle", "Dharwad Bus Stand"],
    status: "delayed",
  },
  {
    id: 3,
    name: "Malaprabha Express",
    number: "KA-01-F-9012",
    route: "College Campus ↔ CBT",
    driver: "Mike Johnson",
    capacity: 45,
    currentOccupancy: 25,
    departureTime: "08:45 AM",
    arrivalTime: "09:30 AM",
    nextDeparture: "05:45 PM",
    stops: ["College Campus", "Unkal Cross", "Gokul Road", "CBT"],
    status: "on-time",
  },
];

// Schedule data
const scheduleData = {
  morning: [
    { time: "07:30 AM", route: "Dharwad to Campus", buses: ["Shalmala Express"] },
    { time: "08:00 AM", route: "Hubli to Campus", buses: ["Varada Express"] },
    { time: "08:15 AM", route: "CBT to Campus", buses: ["Malaprabha Express"] },
  ],
  evening: [
    { time: "04:30 PM", route: "Campus to Dharwad", buses: ["Shalmala Express"] },
    { time: "05:00 PM", route: "Campus to Hubli", buses: ["Varada Express"] },
    { time: "05:15 PM", route: "Campus to CBT", buses: ["Malaprabha Express"] },
  ],
};

const StudentBuses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBus, setSelectedBus] = useState<number | null>(null);
  
  const filteredBuses = buses.filter(bus => 
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.stops.some(stop => stop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = (busId: number) => {
    setSelectedBus(selectedBus === busId ? null : busId);
  };

  return (
    <DashboardLayout pageTitle="Buses & Routes">
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Bus className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">Campus Bus Services</h2>
                <p className="text-muted-foreground">
                  Find information about available buses, schedules, and routes to help you commute between campus and city.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="buses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="buses">Available Buses</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="map">Route Map</TabsTrigger>
          </TabsList>

          <TabsContent value="buses" className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search buses or routes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredBuses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBuses.map((bus) => (
                  <Card key={bus.id} className={`overflow-hidden transition-all duration-200 ${selectedBus === bus.id ? 'ring-2 ring-primary' : 'hover:shadow-lg'}`}>
                    <CardHeader className="bg-primary/5 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center text-lg">
                            <Bus className="h-5 w-5 mr-2 text-primary" />
                            {bus.name}
                          </CardTitle>
                          <CardDescription className="font-mono">{bus.number}</CardDescription>
                        </div>
                        <Badge variant={bus.status === "on-time" ? "outline" : "destructive"} className="capitalize">
                          {bus.status === "on-time" ? "On Time" : "Delayed"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Route</p>
                            <p className="text-sm text-muted-foreground">{bus.route}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Timings</p>
                            <p className="text-sm text-muted-foreground">
                              Departs: {bus.departureTime} • Arrives: {bus.arrivalTime}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <User className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Driver</p>
                            <p className="text-sm text-muted-foreground">{bus.driver}</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full flex items-center justify-center"
                            onClick={() => handleViewDetails(bus.id)}
                          >
                            {selectedBus === bus.id ? "Hide Details" : "View Details"}
                            <ArrowRight className={`ml-1 h-3.5 w-3.5 transition-transform ${selectedBus === bus.id ? 'rotate-90' : ''}`} />
                          </Button>
                        </div>

                        {selectedBus === bus.id && (
                          <div className="mt-3 pt-3 border-t animate-in fade-in duration-200">
                            <h4 className="text-sm font-medium mb-2">Bus Stops</h4>
                            <div className="space-y-2">
                              {bus.stops.map((stop, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="relative">
                                    <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                                    {index < bus.stops.length - 1 && (
                                      <div className="absolute top-2.5 left-1 -ml-px h-full w-0.5 bg-primary/20"></div>
                                    )}
                                  </div>
                                  <span className="ml-3 text-sm">
                                    {stop}
                                    {index === 0 && " (Departure)"}
                                    {index === bus.stops.length - 1 && " (Arrival)"}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Capacity</p>
                                <p className="font-medium">{bus.currentOccupancy}/{bus.capacity} seats</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Next Departure</p>
                                <p className="font-medium">{bus.nextDeparture}</p>
                              </div>
                            </div>
                            
                            <Button variant="default" size="sm" className="mt-3 w-full">
                              Track Live Location
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-3 mb-3">
                    <Bus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No buses found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search to find what you're looking for.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm text-muted-foreground">
                    Bus schedules may change during holidays and exam periods. Check announcements for the latest updates.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Morning Schedule
                  </CardTitle>
                  <CardDescription>Campus-bound buses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Bus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleData.morning.map((item, index) => (
                        <TableRow key={`morning-${index}`}>
                          <TableCell className="font-medium">{item.time}</TableCell>
                          <TableCell>{item.route}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {item.buses.map(bus => (
                                <Badge key={bus} variant="outline" className="text-xs">
                                  {bus}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Evening Schedule
                  </CardTitle>
                  <CardDescription>Return journey buses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Bus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleData.evening.map((item, index) => (
                        <TableRow key={`evening-${index}`}>
                          <TableCell className="font-medium">{item.time}</TableCell>
                          <TableCell>{item.route}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {item.buses.map(bus => (
                                <Badge key={bus} variant="outline" className="text-xs">
                                  {bus}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Route Maps</CardTitle>
                <CardDescription>
                  Interactive maps showing bus routes and stops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] bg-muted rounded-md flex flex-col items-center justify-center p-6">
                  <div className="bg-primary/10 p-4 rounded-full mb-6">
                    <Map className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Interactive Maps Coming Soon</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto text-center mb-6">
                    We're working on implementing interactive Google Maps for all bus routes,
                    with real-time tracking and ETA features.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                    {buses.map(bus => (
                      <Button key={bus.id} variant="outline" className="bg-white">
                        <Bus className="mr-2 h-4 w-4" />
                        {bus.name} Route
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentBuses;
