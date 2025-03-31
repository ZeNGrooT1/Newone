
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, Check, Clock, Search, MessageSquare, XCircle, User, Bus, Calendar } from "lucide-react";

// Mock data for complaints
const complaints = [
  {
    id: 1,
    title: "Bus Delay Issue",
    description: "Bus was delayed by 30 minutes without any notification",
    status: "pending",
    dateCreated: "Today, 10:30 AM",
    category: "Bus Delay",
    busNumber: "KA-01-F-1234",
    busName: "Varada Express",
    student: "John Doe (USN123456)",
    responses: [],
    priority: "medium",
  },
  {
    id: 2,
    title: "Overcrowding in Morning Bus",
    description: "The morning bus to campus is severely overcrowded, creating unsafe conditions.",
    status: "in-review",
    dateCreated: "Yesterday, 5:15 PM",
    category: "Overcrowding",
    busNumber: "KA-01-F-5678",
    busName: "Shalmala Express",
    student: "Jane Smith (USN654321)",
    responses: [
      {
        responder: "Bus Coordinator",
        message: "We're reviewing this issue and will consider adding an additional bus.",
        timestamp: "Today, 9:00 AM"
      }
    ],
    priority: "high",
  },
  {
    id: 3,
    title: "AC Not Working",
    description: "The air conditioning in the Varada Express hasn't been working for three days.",
    status: "resolved",
    dateCreated: "Last week",
    dateResolved: "2 days ago",
    category: "Maintenance",
    busNumber: "KA-01-F-1234",
    busName: "Varada Express",
    student: "Mike Johnson (USN789012)",
    responses: [
      {
        responder: "Bus Coordinator",
        message: "We've scheduled maintenance for this issue.",
        timestamp: "4 days ago"
      },
      {
        responder: "Bus Coordinator",
        message: "The AC has been repaired and is now working properly. Please let us know if you face any further issues.",
        timestamp: "2 days ago"
      }
    ],
    priority: "medium",
  },
  {
    id: 4,
    title: "Driver Behavior Complaint",
    description: "The driver was using mobile phone while driving which is unsafe.",
    status: "resolved",
    dateCreated: "2 weeks ago",
    dateResolved: "1 week ago",
    category: "Driver Behavior",
    busNumber: "KA-01-F-9012",
    busName: "Malaprabha Express",
    student: "Sarah Williams (USN345678)",
    responses: [
      {
        responder: "Bus Coordinator",
        message: "Thank you for bringing this to our attention. We'll investigate the matter.",
        timestamp: "10 days ago"
      },
      {
        responder: "Bus Coordinator",
        message: "We've spoken with the driver and reminded them of safety protocols. Disciplinary action has been taken.",
        timestamp: "1 week ago"
      }
    ],
    priority: "high",
  },
];

const CoordinatorComplaints = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [complaintsList, setComplaintsList] = useState(complaints);
  
  const handleViewComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
  };
  
  const handleOpenResponseDialog = (complaint: any) => {
    setSelectedComplaint(complaint);
    setResponseDialogOpen(true);
  };
  
  const handleSubmitResponse = () => {
    if (!responseText.trim()) return;
    
    // In a real app, you would make an API call to submit the response
    const updatedComplaint = {
      ...selectedComplaint,
      responses: [
        ...selectedComplaint.responses,
        {
          responder: "Bus Coordinator",
          message: responseText,
          timestamp: "Just now"
        }
      ],
      status: selectedComplaint.status === "pending" ? "in-review" : selectedComplaint.status
    };
    
    setComplaintsList(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === selectedComplaint.id ? updatedComplaint : complaint
      )
    );
    
    toast.success("Response sent successfully");
    setResponseText("");
    setResponseDialogOpen(false);
  };
  
  const handleUpdateStatus = (complaintId: number, newStatus: string) => {
    setComplaintsList(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              status: newStatus, 
              dateResolved: newStatus === "resolved" ? "Just now" : undefined 
            } 
          : complaint
      )
    );
    
    toast.success(`Complaint status updated to ${newStatus}`);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'in-review':
        return <Badge variant="secondary" className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> In Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 flex items-center gap-1"><Check className="h-3 w-3" /> Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const filteredComplaints = complaintsList.filter(complaint => 
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.student.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const pendingComplaints = filteredComplaints.filter(complaint => complaint.status === "pending" || complaint.status === "in-review");
  const resolvedComplaints = filteredComplaints.filter(complaint => complaint.status === "resolved");

  return (
    <DashboardLayout pageTitle="Complaint Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Complaint Management
            </CardTitle>
            <CardDescription>
              Review and respond to complaints submitted by students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search complaints..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Total Complaints</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{complaintsList.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Pending</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{complaintsList.filter(c => c.status === "pending").length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">In Review</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{complaintsList.filter(c => c.status === "in-review").length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Resolved</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-3xl font-bold">{complaintsList.filter(c => c.status === "resolved").length}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="pending">Pending Complaints</TabsTrigger>
            <TabsTrigger value="resolved">Resolved Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending & In Review Complaints</CardTitle>
                <CardDescription>
                  Complaints requiring your attention and action
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingComplaints.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Bus</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.title}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell>{complaint.busName}</TableCell>
                          <TableCell>{complaint.student.split(" ")[0]}</TableCell>
                          <TableCell>{complaint.dateCreated}</TableCell>
                          <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewComplaint(complaint)}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleOpenResponseDialog(complaint)}
                              >
                                Respond
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-3">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">No pending complaints</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                      All complaints have been addressed. Great job!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resolved">
            <Card>
              <CardHeader>
                <CardTitle>Resolved Complaints</CardTitle>
                <CardDescription>
                  Previously addressed and resolved complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resolvedComplaints.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Bus</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Date Resolved</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resolvedComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell className="font-medium">{complaint.title}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell>{complaint.busName}</TableCell>
                          <TableCell>{complaint.student.split(" ")[0]}</TableCell>
                          <TableCell>{complaint.dateCreated}</TableCell>
                          <TableCell>{complaint.dateResolved}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewComplaint(complaint)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <div className="rounded-full bg-muted p-3 mx-auto w-fit mb-3">
                      <XCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No resolved complaints</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                      There are no resolved complaints matching your search criteria.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Complaint Detail Dialog */}
        {selectedComplaint && (
          <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {selectedComplaint.title}
                  <span className="ml-2">{getStatusBadge(selectedComplaint.status)}</span>
                </DialogTitle>
                <DialogDescription>
                  Complaint #{selectedComplaint.id} • Submitted {selectedComplaint.dateCreated}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Complaint Details</h3>
                  <div className="bg-muted p-3 rounded-md text-sm mb-4">
                    {selectedComplaint.description}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Student</p>
                        <p className="text-sm text-muted-foreground">{selectedComplaint.student}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Bus className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Bus</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedComplaint.busName} ({selectedComplaint.busNumber})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Category & Priority</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {selectedComplaint.category} • {getPriorityBadge(selectedComplaint.priority)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-sm text-muted-foreground">
                          Created: {selectedComplaint.dateCreated}
                          {selectedComplaint.dateResolved && (<>
                            <br/>Resolved: {selectedComplaint.dateResolved}
                          </>)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Responses & Communication</h3>
                  {selectedComplaint.responses.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {selectedComplaint.responses.map((response: any, idx: number) => (
                        <div key={idx} className="bg-primary/5 p-3 rounded-md text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{response.responder}</span>
                            <span className="text-xs text-muted-foreground">{response.timestamp}</span>
                          </div>
                          <p>{response.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted p-3 rounded-md text-sm mb-4">
                      No responses yet.
                    </div>
                  )}
                  
                  {selectedComplaint.status !== "resolved" && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Actions</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenResponseDialog(selectedComplaint)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Add Response
                        </Button>
                        
                        {selectedComplaint.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              handleUpdateStatus(selectedComplaint.id, "in-review");
                              setSelectedComplaint({...selectedComplaint, status: "in-review"});
                            }}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Mark as In Review
                          </Button>
                        )}
                        
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => {
                            handleUpdateStatus(selectedComplaint.id, "resolved");
                            setSelectedComplaint({...selectedComplaint, status: "resolved", dateResolved: "Just now"});
                          }}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Response Dialog */}
        <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Complaint</DialogTitle>
              <DialogDescription>
                Add a response to complaint #{selectedComplaint?.id}: {selectedComplaint?.title}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="response-message">Your Response</Label>
                <Textarea 
                  id="response-message" 
                  placeholder="Enter your response to the student..." 
                  rows={5}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-status">Update Status</Label>
                <Select defaultValue={selectedComplaint?.status || "pending"}>
                  <SelectTrigger id="update-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitResponse} disabled={!responseText.trim()}>Send Response</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CoordinatorComplaints;
