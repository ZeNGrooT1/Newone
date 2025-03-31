
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
import { toast } from "sonner";
import { Search, UserPlus, Filter, Eye, Edit, Trash2, UserCog, MoreHorizontal, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for students
const students = [
  {
    id: 1,
    name: "John Doe",
    usn: "USN123456",
    email: "john@example.com",
    phone: "9876543210",
    region: "Hubli",
    status: "active",
    joinDate: "Jan 15, 2023",
  },
  {
    id: 2,
    name: "Jane Smith",
    usn: "USN654321",
    email: "jane@example.com",
    phone: "8765432109",
    region: "Dharwad",
    status: "active",
    joinDate: "Mar 10, 2023",
  },
  {
    id: 3,
    name: "Mike Johnson",
    usn: "USN789012",
    email: "mike@example.com",
    phone: "7654321098",
    region: "Hubli",
    status: "inactive",
    joinDate: "Feb 5, 2023",
  },
  {
    id: 4,
    name: "Sarah Williams",
    usn: "USN345678",
    email: "sarah@example.com",
    phone: "6543210987",
    region: "Dharwad",
    status: "active",
    joinDate: "May 20, 2023",
  },
];

// Mock data for drivers
const drivers = [
  {
    id: 1,
    name: "Dave Driver",
    email: "dave@example.com",
    phone: "9876543210",
    status: "active",
    joinDate: "Jan 15, 2023",
    busAssigned: "Varada Express",
  },
  {
    id: 2,
    name: "Sam Smith",
    email: "sam@example.com",
    phone: "8765432109",
    status: "active",
    joinDate: "Mar 10, 2023",
    busAssigned: "Shalmala Express",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "7654321098",
    status: "on-leave",
    joinDate: "Feb 5, 2023",
    busAssigned: "Malaprabha Express",
  },
];

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
  },
  {
    id: 2,
    name: "Chris Coordinator",
    email: "chris@example.com",
    phone: "8765432109",
    region: "Dharwad",
    status: "active",
    joinDate: "Feb 15, 2023",
  },
];

// Mock data for admins
const admins = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@campusbus.com",
    phone: "9876543210",
    status: "active",
    joinDate: "Jan 1, 2023",
    role: "Super Admin",
  },
  {
    id: 2,
    name: "System Admin",
    email: "system@campusbus.com",
    phone: "8765432109",
    status: "active",
    joinDate: "Jan 1, 2023",
    role: "Admin",
  },
];

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("students");
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleAddUser = () => {
    toast.success("User added successfully");
    setAddUserDialogOpen(false);
  };
  
  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setUserDetailsDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'on-leave':
        return <Badge variant="secondary">On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Filter data based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.region.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (driver.busAssigned && driver.busAssigned.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredCoordinators = coordinators.filter(coordinator => 
    coordinator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coordinator.region.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout pageTitle="User Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage all users of the Campus Bus Assistant platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-1 items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new user to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-role" className="text-right">Role</Label>
                      <Select defaultValue="student">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="coordinator">Coordinator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-name" className="text-right">Name</Label>
                      <Input id="user-name" placeholder="Full name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-email" className="text-right">Email</Label>
                      <Input id="user-email" type="email" placeholder="Email address" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-phone" className="text-right">Phone</Label>
                      <Input id="user-phone" placeholder="Phone number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-usn" className="text-right">USN/ID</Label>
                      <Input id="user-usn" placeholder="Unique ID number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="user-region" className="text-right">Region</Label>
                      <Select defaultValue="hubli">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hubli">Hubli</SelectItem>
                          <SelectItem value="dharwad">Dharwad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddUser}>Add User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Card className="shadow-sm" onClick={() => setSelectedTab("students")}>
                <CardHeader className={`p-4 pb-2 ${selectedTab === "students" ? "border-b-2 border-primary" : ""}`}>
                  <CardTitle className="text-base">Students</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">{students.length}</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm" onClick={() => setSelectedTab("drivers")}>
                <CardHeader className={`p-4 pb-2 ${selectedTab === "drivers" ? "border-b-2 border-primary" : ""}`}>
                  <CardTitle className="text-base">Drivers</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">{drivers.length}</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm" onClick={() => setSelectedTab("coordinators")}>
                <CardHeader className={`p-4 pb-2 ${selectedTab === "coordinators" ? "border-b-2 border-primary" : ""}`}>
                  <CardTitle className="text-base">Coordinators</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">{coordinators.length}</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm" onClick={() => setSelectedTab("admins")}>
                <CardHeader className={`p-4 pb-2 ${selectedTab === "admins" ? "border-b-2 border-primary" : ""}`}>
                  <CardTitle className="text-base">Admins</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-2xl font-bold">{admins.length}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md mb-6">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="coordinators">Coordinators</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  Manage student accounts and access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>USN</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.usn}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phone}</TableCell>
                          <TableCell>{student.region}</TableCell>
                          <TableCell>{getStatusBadge(student.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewUser(student)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
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

          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>Drivers</CardTitle>
                <CardDescription>
                  Manage driver accounts and assignments
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
                        <TableHead>Bus Assigned</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrivers.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell className="font-medium">{driver.name}</TableCell>
                          <TableCell>{driver.email}</TableCell>
                          <TableCell>{driver.phone}</TableCell>
                          <TableCell>{driver.busAssigned || "Not assigned"}</TableCell>
                          <TableCell>{getStatusBadge(driver.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewUser(driver)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
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

          <TabsContent value="coordinators">
            <Card>
              <CardHeader>
                <CardTitle>Coordinators</CardTitle>
                <CardDescription>
                  Manage coordinator accounts and regional assignments
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
                                <DropdownMenuItem onClick={() => handleViewUser(coordinator)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
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

          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle>Administrators</CardTitle>
                <CardDescription>
                  Manage administrator accounts and permissions
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
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdmins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.phone}</TableCell>
                          <TableCell>{admin.role}</TableCell>
                          <TableCell>{getStatusBadge(admin.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewUser(admin)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
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

        {/* User Details Dialog */}
        {selectedUser && (
          <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Detailed information for {selectedUser.name}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={`/placeholder.svg`} alt={selectedUser.name} />
                    <AvatarFallback className="text-xl">{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                </div>
                
                <div className="grid gap-4">
                  {selectedUser.usn && (
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium text-muted-foreground text-right">USN</p>
                      <p className="col-span-2">{selectedUser.usn}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 items-center gap-4">
                    <p className="text-sm font-medium text-muted-foreground text-right">Email</p>
                    <p className="col-span-2">{selectedUser.email}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 items-center gap-4">
                    <p className="text-sm font-medium text-muted-foreground text-right">Phone</p>
                    <p className="col-span-2">{selectedUser.phone}</p>
                  </div>
                  
                  {selectedUser.region && (
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium text-muted-foreground text-right">Region</p>
                      <p className="col-span-2">{selectedUser.region}</p>
                    </div>
                  )}
                  
                  {selectedUser.busAssigned && (
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium text-muted-foreground text-right">Bus Assigned</p>
                      <p className="col-span-2">{selectedUser.busAssigned}</p>
                    </div>
                  )}
                  
                  {selectedUser.role && (
                    <div className="grid grid-cols-3 items-center gap-4">
                      <p className="text-sm font-medium text-muted-foreground text-right">Role</p>
                      <p className="col-span-2">{selectedUser.role}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 items-center gap-4">
                    <p className="text-sm font-medium text-muted-foreground text-right">Joined On</p>
                    <p className="col-span-2">{selectedUser.joinDate}</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <div>
                  {selectedUser.status === 'active' ? (
                    <Button variant="outline" size="sm" className="text-destructive border-destructive">
                      <X className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                      <Check className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
