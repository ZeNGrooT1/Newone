
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "./DashboardSidebar";
import { Bell, ChevronDown, User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Update document title
    document.title = `${pageTitle} | Campus Bus Assistant`;
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  }, [pageTitle]);
  
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  if (!user) {
    return null; // or redirect
  }

  const handleLogout = () => {
    logout();
    toast.default("You have been logged out successfully");
  };
  
  // Get first letter of name or email for the avatar
  const getInitial = () => {
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };
  
  // Get user region with a default value
  const userRegion = user.region || 'Campus';
  
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {sidebarOpen && <DashboardSidebar userRole={user.role as 'student' | 'driver' | 'coordinator' | 'admin'} />}
      
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navigation bar */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative hover:bg-muted/50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-9 pl-3 pr-2 hover:bg-muted/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {getInitial()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="font-medium text-sm leading-tight">{user.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground leading-tight">{userRegion}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-2 shadow-lg rounded-xl">
                <div className="flex items-center gap-3 p-2 mb-1 bg-primary/5 rounded-md">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-medium text-lg">
                    {getInitial()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span>
                      {user.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)} • {userRegion}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link to={`/${user.role}/profile`}>
                  <DropdownMenuItem className="cursor-pointer rounded-md p-2 focus:bg-muted hover:bg-muted">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <Link to={`/${user.role}/settings`}>
                  <DropdownMenuItem className="cursor-pointer rounded-md p-2 focus:bg-muted hover:bg-muted">
                    <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                    Settings
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-500 focus:text-red-500 rounded-md p-2 focus:bg-red-50 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="animate-fade-in max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground bg-white">
          <div className="flex justify-center items-center gap-1">
            <p>© {new Date().getFullYear()} Campus Bus Assistant. All rights reserved.</p>
            <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
