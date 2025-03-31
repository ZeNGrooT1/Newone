
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Bus, 
  Loader2, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  UserCheck, 
  Vote, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Import required chart components
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Mock data
const userStats = {
  total: 2840,
  active: 2650,
  new: 120,
  growth: 4.2
};

const busStats = {
  total: 15,
  active: 12,
  maintenance: 3,
  utilization: 82
};

const complaintStats = {
  total: 48,
  pending: 12,
  resolved: 36,
  satisfaction: 92
};

// Monthly users data
const monthlyUsersData = [
  { name: "Jan", students: 1800, drivers: 10, coordinators: 5 },
  { name: "Feb", students: 1900, drivers: 12, coordinators: 5 },
  { name: "Mar", students: 2000, drivers: 12, coordinators: 6 },
  { name: "Apr", students: 2200, drivers: 13, coordinators: 6 },
  { name: "May", students: 2300, drivers: 13, coordinators: 6 },
  { name: "Jun", students: 2100, drivers: 14, coordinators: 7 },
  { name: "Jul", students: 2000, drivers: 14, coordinators: 7 },
  { name: "Aug", students: 2400, drivers: 15, coordinators: 7 },
  { name: "Sep", students: 2500, drivers: 15, coordinators: 7 },
  { name: "Oct", students: 2600, drivers: 15, coordinators: 8 },
  { name: "Nov", students: 2750, drivers: 15, coordinators: 8 },
  { name: "Dec", students: 2840, drivers: 15, coordinators: 8 },
];

// Bus utilization data
const busUtilizationData = [
  { name: "Morning (7-9 AM)", usage: 92 },
  { name: "Day (9 AM-4 PM)", usage: 45 },
  { name: "Evening (4-6 PM)", usage: 88 },
  { name: "Night (6-8 PM)", usage: 65 },
];

// Regional distribution data
const regionData = [
  { name: "Hubli", value: 1680 },
  { name: "Dharwad", value: 1160 },
];

// Recent activity data
const recentActivity = [
  {
    id: 1,
    action: "New Student Registration",
    details: "John Doe (USN123456) registered to the platform",
    time: "10 minutes ago",
    type: "user"
  },
  {
    id: 2,
    action: "Bus Maintenance Completed",
    details: "Varada Express (KA-01-F-1234) is back in service",
    time: "1 hour ago",
    type: "bus"
  },
  {
    id: 3,
    action: "Complaint Resolved",
    details: "Bus delay issue reported by Jane Smith has been resolved",
    time: "2 hours ago",
    type: "complaint"
  },
  {
    id: 4,
    action: "New Bus Added",
    details: "New bus 'Tungabhadra Express' added to the fleet",
    time: "Yesterday",
    type: "bus"
  },
  {
    id: 5,
    action: "Coordinator Assigned",
    details: "Clara Coordinator assigned to Hubli region",
    time: "2 days ago",
    type: "user"
  },
];

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminDashboard = () => {
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'bus':
        return <Bus className="h-4 w-4 text-green-500" />;
      case 'complaint':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 mr-1">{userStats.growth}%</span> 
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bus Fleet</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{busStats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{busStats.active} active</span>
              <span className="mx-1">•</span>
              <span>{busStats.maintenance} in maintenance</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaintStats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-amber-500 mr-1">{complaintStats.pending} pending</span>
              <span className="mx-1">•</span>
              <span className="text-green-500">{complaintStats.resolved} resolved</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="buses">Buses</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user statistics</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyUsersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="students" stroke="#8884d8" name="Students" />
                      <Line type="monotone" dataKey="drivers" stroke="#82ca9d" name="Drivers" />
                      <Line type="monotone" dataKey="coordinators" stroke="#ffc658" name="Coordinators" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Students by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Bus Utilization</CardTitle>
                <CardDescription>Usage during different time periods</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={busUtilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#8884d8" name="Utilization (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentActivity.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="relative mr-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {getActivityIcon(activity.type)}
                        </div>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.details}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,820</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+120</span> 
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+2</span> 
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Coordinators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+1</span> 
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>No change</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 mt-4 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Daily active users statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyUsersData.slice(-7)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="students" stroke="#8884d8" name="Students" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>New User Registrations</CardTitle>
                <CardDescription>Last 10 user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4 rounded-full bg-primary/10 p-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Student {i} (USN1234{i})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Registered {i} day{i !== 1 ? 's' : ''} ago
                        </p>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Users
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="buses">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Buses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+1</span> 
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Active Buses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">-1</span> 
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Routes Covered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>No change</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Average Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+3%</span> 
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 mt-4 md:grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bus Utilization by Time</CardTitle>
                <CardDescription>Average passenger capacity usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={busUtilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#8884d8" name="Utilization (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bus Status</CardTitle>
                <CardDescription>Current status of the fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {name: "Varada Express", status: "active", lastMaintenance: "2 months ago"},
                    {name: "Shalmala Express", status: "active", lastMaintenance: "1 month ago"},
                    {name: "Malaprabha Express", status: "maintenance", lastMaintenance: "In progress"},
                    {name: "Tungabhadra Express", status: "active", lastMaintenance: "3 months ago"},
                    {name: "Krishna Express", status: "maintenance", lastMaintenance: "In progress"}
                  ].map((bus, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4 rounded-full p-2 bg-primary/10">
                        <Bus className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {bus.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last Maintenance: {bus.lastMaintenance}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bus.status === 'active' ? 'Active' : 'Maintenance'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Buses
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminDashboard;
