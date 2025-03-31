
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { 
  BarChart3, 
  Download, 
  FileText, 
  Users, 
  Bus, 
  Calendar as CalendarIcon, 
  Filter, 
  ChevronDown,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp
} from "lucide-react";

// Import required chart components
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from "recharts";

// Mock data for user statistics
const userStatistics = [
  { month: "Jan", students: 1800, drivers: 10, coordinators: 5 },
  { month: "Feb", students: 1900, drivers: 12, coordinators: 5 },
  { month: "Mar", students: 2000, drivers: 12, coordinators: 6 },
  { month: "Apr", students: 2200, drivers: 13, coordinators: 6 },
  { month: "May", students: 2300, drivers: 13, coordinators: 6 },
  { month: "Jun", students: 2100, drivers: 14, coordinators: 7 },
  { month: "Jul", students: 2000, drivers: 14, coordinators: 7 },
  { month: "Aug", students: 2400, drivers: 15, coordinators: 7 },
  { month: "Sep", students: 2500, drivers: 15, coordinators: 7 },
  { month: "Oct", students: 2600, drivers: 15, coordinators: 8 },
  { month: "Nov", students: 2750, drivers: 15, coordinators: 8 },
  { month: "Dec", students: 2840, drivers: 15, coordinators: 8 },
];

// Mock data for bus utilization
const busUtilization = [
  { time: "7-8 AM", hubli: 90, dharwad: 85, cbt: 80 },
  { time: "8-9 AM", hubli: 95, dharwad: 90, cbt: 85 },
  { time: "9-10 AM", hubli: 60, dharwad: 55, cbt: 50 },
  { time: "4-5 PM", hubli: 75, dharwad: 70, cbt: 65 },
  { time: "5-6 PM", hubli: 85, dharwad: 80, cbt: 75 },
  { time: "6-7 PM", hubli: 90, dharwad: 85, cbt: 80 },
];

// Mock data for complaint statistics
const complaintStatistics = [
  { month: "Jan", total: 25, resolved: 22, pending: 3 },
  { month: "Feb", total: 30, resolved: 28, pending: 2 },
  { month: "Mar", total: 22, resolved: 20, pending: 2 },
  { month: "Apr", total: 28, resolved: 25, pending: 3 },
  { month: "May", total: 35, resolved: 30, pending: 5 },
  { month: "Jun", total: 40, resolved: 35, pending: 5 },
];

// Mock data for vote statistics
const voteStatistics = [
  { month: "Jan", requests: 4, approved: 3, rejected: 1 },
  { month: "Feb", requests: 6, approved: 5, rejected: 1 },
  { month: "Mar", requests: 3, approved: 3, rejected: 0 },
  { month: "Apr", requests: 5, approved: 4, rejected: 1 },
  { month: "May", requests: 7, approved: 6, rejected: 1 },
  { month: "Jun", requests: 9, approved: 7, rejected: 2 },
];

// Regional distribution data
const regionalDistribution = [
  { name: "Hubli", value: 1680 },
  { name: "Dharwad", value: 1160 },
];

// Available report types
const reportTypes = [
  { id: "user", name: "User Statistics Report", description: "User growth and activity statistics" },
  { id: "bus", name: "Bus Utilization Report", description: "Bus fleet usage and occupancy rates" },
  { id: "complaint", name: "Complaint Analysis Report", description: "Complaint trends and resolution statistics" },
  { id: "vote", name: "Vote Request Report", description: "Bus voting requests and approval statistics" },
  { id: "financial", name: "Financial Summary Report", description: "Cost and expense analysis for the fleet" },
];

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminReports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("user");
  
  const handleDownloadReport = () => {
    toast.success("Report download started");
  };

  return (
    <DashboardLayout pageTitle="Reports & Analytics">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports & Analytics</CardTitle>
            <CardDescription>
              Generate and download reports for system performance and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="user" onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(report => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <Select defaultValue="last3months">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastmonth">Last Month</SelectItem>
                      <SelectItem value="last3months">Last 3 Months</SelectItem>
                      <SelectItem value="last6months">Last 6 Months</SelectItem>
                      <SelectItem value="lastyear">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button className="w-full" onClick={handleDownloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Available Reports</h3>
                <div className="space-y-3">
                  {reportTypes.map(report => (
                    <div key={report.id} className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Total Users</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">2,840</div>
                  <div className="text-xs text-muted-foreground">+4.2% from last month</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Bus Utilization</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">82%</div>
                  <div className="text-xs text-muted-foreground">+3% from last month</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Complaints</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">48</div>
                  <div className="text-xs text-muted-foreground">35 resolved, 13 pending</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Vote Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">9</div>
                  <div className="text-xs text-muted-foreground">7 approved, 2 pending</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-xl mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="buses">Buses</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="voting">Voting</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Statistics</CardTitle>
                    <CardDescription>Monthly user growth and distribution</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
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
              <CardFooter>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Regional Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={regionalDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {regionalDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">User Growth Rate</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <span className="text-green-500 font-medium mr-1">+4.2%</span> 
                              <span>month-over-month</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Active Users</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <span className="text-blue-500 font-medium mr-1">92%</span> 
                              <span>of total users</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-amber-500" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">New Registrations</p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <span className="text-amber-500 font-medium mr-1">120</span> 
                              <span>in the last month</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="buses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bus Utilization</CardTitle>
                    <CardDescription>Hourly bus utilization by route</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={busUtilization} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis label={{ value: "Utilization (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hubli" name="Hubli Route" fill="#8884d8" />
                      <Bar dataKey="dharwad" name="Dharwad Route" fill="#82ca9d" />
                      <Bar dataKey="cbt" name="CBT Route" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Average Utilization</TableHead>
                      <TableHead>Peak Hours</TableHead>
                      <TableHead>Off-Peak Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Hubli Route</TableCell>
                      <TableCell>82%</TableCell>
                      <TableCell>8-9 AM, 5-6 PM</TableCell>
                      <TableCell>10 AM - 3 PM</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Dharwad Route</TableCell>
                      <TableCell>78%</TableCell>
                      <TableCell>8-9 AM, 5-6 PM</TableCell>
                      <TableCell>10 AM - 3 PM</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">CBT Route</TableCell>
                      <TableCell>73%</TableCell>
                      <TableCell>8-9 AM, 5-6 PM</TableCell>
                      <TableCell>10 AM - 3 PM</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Complaint Statistics</CardTitle>
                    <CardDescription>Monthly complaint trends and resolution rates</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complaintStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="total" name="Total Complaints" fill="#8884d8" />
                      <Bar dataKey="resolved" name="Resolved" fill="#82ca9d" />
                      <Bar dataKey="pending" name="Pending" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Resolution Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">88%</div>
                      <div className="text-xs text-muted-foreground">+2% from last month</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Avg. Resolution Time</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">1.5 days</div>
                      <div className="text-xs text-muted-foreground">-0.3 days from last month</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">Top Complaint Type</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-lg font-bold">Bus Delays</div>
                      <div className="text-xs text-muted-foreground">42% of all complaints</div>
                    </CardContent>
                  </Card>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="voting">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Voting Statistics</CardTitle>
                    <CardDescription>Monthly vote requests and approval rates</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={voteStatistics} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="requests" name="Total Requests" fill="#8884d8" />
                      <Bar dataKey="approved" name="Approved" fill="#82ca9d" />
                      <Bar dataKey="rejected" name="Rejected" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Total Requests</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Rejected</TableHead>
                      <TableHead>Approval Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voteStatistics.map((stat) => (
                      <TableRow key={stat.month}>
                        <TableCell className="font-medium">{stat.month}</TableCell>
                        <TableCell>{stat.requests}</TableCell>
                        <TableCell>{stat.approved}</TableCell>
                        <TableCell>{stat.rejected}</TableCell>
                        <TableCell>{Math.round((stat.approved / stat.requests) * 100)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
            <CardDescription>
              Previously generated reports available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">User Statistics Report - May 2023</TableCell>
                  <TableCell>User Statistics</TableCell>
                  <TableCell>May 2023</TableCell>
                  <TableCell>Jun 1, 2023</TableCell>
                  <TableCell>1.2 MB</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bus Utilization Report - Q2 2023</TableCell>
                  <TableCell>Bus Utilization</TableCell>
                  <TableCell>Apr-Jun 2023</TableCell>
                  <TableCell>Jul 2, 2023</TableCell>
                  <TableCell>2.4 MB</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Complaint Analysis - First Half 2023</TableCell>
                  <TableCell>Complaint Analysis</TableCell>
                  <TableCell>Jan-Jun 2023</TableCell>
                  <TableCell>Jul 5, 2023</TableCell>
                  <TableCell>1.8 MB</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
