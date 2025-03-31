
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context providers
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./hooks/use-toast.tsx";

// Public pages
import LandingPage from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginSelection from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import DriverLogin from "./pages/DriverLogin";
import CoordinatorLogin from "./pages/CoordinatorLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentRegister from "./pages/StudentRegister";

// Protected pages - Student
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import StudentBuses from "./pages/student/Buses";
import StudentVoting from "./pages/student/Voting";
import StudentComplaints from "./pages/student/Complaints";

// Protected pages - Driver
import DriverDashboard from "./pages/driver/Dashboard";
import DriverProfile from "./pages/driver/Profile";
import DriverSchedule from "./pages/driver/Schedule";
import DriverAlerts from "./pages/driver/Alerts";

// Protected pages - Coordinator
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorManageBuses from "./pages/coordinator/ManageBuses";
import CoordinatorVoting from "./pages/coordinator/Voting";
import CoordinatorComplaints from "./pages/coordinator/Complaints";
import CoordinatorDrivers from "./pages/coordinator/Drivers";

// Protected pages - Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminBuses from "./pages/admin/Buses";
import AdminCoordinators from "./pages/admin/Coordinators";
import AdminReports from "./pages/admin/Reports";

// Route protection components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginSelection />} />
              <Route path="/login/student" element={<StudentLogin />} />
              <Route path="/login/driver" element={<DriverLogin />} />
              <Route path="/login/coordinator" element={<CoordinatorLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/register/student" element={<StudentRegister />} />
              
              {/* Protected Student routes */}
              <Route path="/student" element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute role="student">
                  <StudentProfile />
                </ProtectedRoute>
              } />
              <Route path="/student/buses" element={
                <ProtectedRoute role="student">
                  <StudentBuses />
                </ProtectedRoute>
              } />
              <Route path="/student/voting" element={
                <ProtectedRoute role="student">
                  <StudentVoting />
                </ProtectedRoute>
              } />
              <Route path="/student/complaints" element={
                <ProtectedRoute role="student">
                  <StudentComplaints />
                </ProtectedRoute>
              } />
              
              {/* Protected Driver routes */}
              <Route path="/driver" element={
                <ProtectedRoute role="driver">
                  <DriverDashboard />
                </ProtectedRoute>
              } />
              <Route path="/driver/profile" element={
                <ProtectedRoute role="driver">
                  <DriverProfile />
                </ProtectedRoute>
              } />
              <Route path="/driver/schedule" element={
                <ProtectedRoute role="driver">
                  <DriverSchedule />
                </ProtectedRoute>
              } />
              <Route path="/driver/alerts" element={
                <ProtectedRoute role="driver">
                  <DriverAlerts />
                </ProtectedRoute>
              } />
              
              {/* Protected Coordinator routes */}
              <Route path="/coordinator" element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/coordinator/buses" element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorManageBuses />
                </ProtectedRoute>
              } />
              <Route path="/coordinator/voting" element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorVoting />
                </ProtectedRoute>
              } />
              <Route path="/coordinator/complaints" element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorComplaints />
                </ProtectedRoute>
              } />
              <Route path="/coordinator/drivers" element={
                <ProtectedRoute role="coordinator">
                  <CoordinatorDrivers />
                </ProtectedRoute>
              } />
              
              {/* Protected Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute role="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/buses" element={
                <ProtectedRoute role="admin">
                  <AdminBuses />
                </ProtectedRoute>
              } />
              <Route path="/admin/coordinators" element={
                <ProtectedRoute role="admin">
                  <AdminCoordinators />
                </ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute role="admin">
                  <AdminReports />
                </ProtectedRoute>
              } />
              
              {/* Catch all - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
