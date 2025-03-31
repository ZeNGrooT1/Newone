
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast.tsx";
import { supabase } from "@/integrations/supabase/client";
import { User, Lock, Phone, Mail, MapPin, Camera, Shield } from "lucide-react";

const StudentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    usn: user?.usn || "",
    region: user?.region || "Hubli",
  });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Initialize form data from user object
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        usn: user.usn || "",
        region: user.region || "Hubli",
      });

      // Fetch profile photo URL
      const fetchProfilePhoto = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('profile_photo_url')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data && data.profile_photo_url) {
            setProfilePhotoUrl(data.profile_photo_url);
          }
        } catch (err) {
          console.error('Error fetching profile photo:', err);
        }
      };
      
      fetchProfilePhoto();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Only update allowed fields (not USN which is read-only)
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          region: formData.region
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    try {
      setIsLoading(true);
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);
        
      if (data) {
        // Update the profile with the new photo URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ profile_photo_url: data.publicUrl })
          .eq('id', user.id);
          
        if (updateError) throw updateError;
        
        setProfilePhotoUrl(data.publicUrl);
        toast.success("Profile photo updated successfully");
      }
    } catch (err: any) {
      console.error('Error uploading profile photo:', err);
      toast.error("Failed to upload profile photo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout pageTitle="My Profile">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-md overflow-hidden border-0">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <CardHeader className="flex flex-row items-center gap-4 pb-2 -mt-16 z-10 relative px-8">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                <AvatarImage 
                  src={profilePhotoUrl || "/placeholder.svg"} 
                  alt={user?.name} 
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-blue-700 text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 cursor-pointer">
                <div className="h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 shadow-md">
                  <Camera className="h-4 w-4" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isLoading}
                />
              </label>
            </div>
            <div className="pt-16 md:pt-0">
              <CardTitle className="text-2xl text-gray-800">{user?.name}</CardTitle>
              <CardDescription className="text-sm flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                Student • {user?.usn}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8">
            <Separator className="my-6" />
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1.5 text-gray-700">
                      <User className="h-4 w-4 text-primary" />
                      Full Name
                    </Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="shadow-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usn" className="flex items-center gap-1.5 text-gray-700">
                      <Shield className="h-4 w-4 text-gray-500" />
                      USN (Read Only)
                    </Label>
                    <Input 
                      id="usn" 
                      name="usn" 
                      value={formData.usn} 
                      readOnly 
                      className="bg-muted shadow-inner" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5 text-gray-700">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="shadow-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1.5 text-gray-700">
                      <Phone className="h-4 w-4 text-primary" />
                      Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                      className="shadow-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region" className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="h-4 w-4 text-primary" />
                      Region
                    </Label>
                    <Input 
                      id="region" 
                      name="region" 
                      value={formData.region} 
                      onChange={handleChange} 
                      required 
                      className="shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="shadow-sm"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="shadow-sm"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      Full Name
                    </h3>
                    <p className="text-base font-medium">{user?.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                      USN
                    </h3>
                    <p className="text-base font-medium">{user?.usn}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email Address
                    </h3>
                    <p className="text-base font-medium">{user?.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Phone Number
                    </h3>
                    <p className="text-base font-medium">{user?.phone || "-"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Region
                    </h3>
                    <p className="text-base font-medium">{user?.region}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="shadow-sm"
                  >
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="mt-6 shadow-md overflow-hidden border-0">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto shadow-sm group hover:bg-primary/5"
              onClick={() => toast.info("Password change functionality coming soon!")}
            >
              <Lock className="h-4 w-4 mr-2 group-hover:text-primary" />
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
