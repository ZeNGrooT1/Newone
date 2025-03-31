
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bus, 
  Users, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Percent, 
  Vote, 
  AlertTriangle 
} from "lucide-react";

// Import required chart components
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";

// Mock data
const busUsageData = [
  { name: "Varada Express", value: 42 },
  { name: "Shalmala Express", value: 38 },
  { name: "Malaprabha Express", value: 25 },
];

const monthlyRidesData = [
  { name: "Jan", rides: 320 },
  { name: "Feb", rides: 340 },
  { name: "Mar", rides: 360 },
  { name: "Apr", rides: 280 },
  { name: "May", rides: 250 },
  { name: "Jun", rides: 310 },
  { name: "Jul", rides: 350 },
  { name: "Aug", rides: 380 },
  { name: "Sep", rides: 400 },
  { name: "Oct", rides: 420 },
  { name: "Nov", rides: 450 },
  { name: "Dec", rides: 380 },
];

const weekdayRidesData = [
  { name: "Mon", hubli: 150, dharwad: 130 },
  { name: "Tue", hubli: 145, dharwad: 125 },
  { name: "Wed", hubli: 140, dharwad: 128 },
  { name: "Thu", hubli: 135, dharwad: 120 },
  { name: "Fri", hubli: 160, dharwad: 140 },
  { name: "Sat", hubli: 80, dharwad: 60 },
  { name: "Sun", hubli: 40, dharwad: 30 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CoordinatorDashboard = () => {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Rides</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              2 votes, 2 complaints
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Rides</CardTitle>
                <CardDescription>Number of student rides per month</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRidesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="rides" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Bus Usage</CardTitle>
                <CardDescription>Current occupancy by bus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={busUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {busUsageData.map((entry, index) => (
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Vote Requests</CardTitle>
                  <CardDescription>Student voting for additional buses</CardDescription>
                </div>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Additional Bus to Dharwad</p>
                      <p className="text-sm text-muted-foreground">18/25 votes • 5 hours left</p>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Weekend Bus to CBT</p>
                      <p className="text-sm text-muted-foreground">12/25 votes • 2 days left</p>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: "48%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>Latest student complaints</CardDescription>
                </div>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Bus Delay Issue</p>
                      <p className="text-sm text-muted-foreground">Submitted today at 10:30 AM</p>
                      <p className="text-xs inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold">
                        Pending
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Overcrowding in Morning Bus</p>
                      <p className="text-sm text-muted-foreground">Submitted yesterday at 5:15 PM</p>
                      <p className="text-xs inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 font-semibold">
                        In Review
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Bus departure times</CardDescription>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Hubli Central to Campus</p>
                      <p className="text-sm text-muted-foreground">Varada Express • 8:15 AM</p>
                      <p className="text-xs text-green-600">Completed</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Campus to Hubli Central</p>
                      <p className="text-sm text-muted-foreground">Varada Express • 5:15 PM</p>
                      <p className="text-xs text-blue-600">Scheduled</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Campus to Dharwad</p>
                      <p className="text-sm text-muted-foreground">Shalmala Express • 5:30 PM</p>
                      <p className="text-xs text-blue-600">Scheduled</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Usage Patterns</CardTitle>
                <CardDescription>Comparing Hubli and Dharwad routes</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weekdayRidesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hubli" name="Hubli Route" fill="#8884d8" />
                      <Bar dataKey="dharwad" name="Dharwad Route" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Ridership Growth</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <span className="text-green-500 font-medium mr-1">+12.5%</span> 
                        compared to last semester
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Bus className="h-4 w-4 mr-2 text-blue-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Bus Utilization</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <span className="text-blue-500 font-medium mr-1">85%</span> 
                        average occupancy
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 mr-2 text-amber-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Vote Success Rate</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <span className="text-amber-500 font-medium mr-1">78%</span> 
                        of votes reach target
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Annual Reports</CardTitle>
              <CardDescription>Download comprehensive reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium">2023 Yearly Usage Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete analysis of bus usage, patterns, and recommendations.
                  </p>
                  <button className="mt-2 text-sm text-primary font-medium">
                    Download PDF
                  </button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium">2023 Student Feedback Summary</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Analysis of complaints, voting patterns, and student satisfaction.
                  </p>
                  <button className="mt-2 text-sm text-primary font-medium">
                    Download PDF
                  </button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium">Q1 2024 Forecast</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Projected usage and recommendations for upcoming semester.
                  </p>
                  <button className="mt-2 text-sm text-primary font-medium">
                    Download PDF
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default CoordinatorDashboard;
