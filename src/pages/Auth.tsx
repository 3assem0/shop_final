import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import type { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener to handle session changes and redirection
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to admin dashboard
        if (session?.user) {
          navigate('/admin/dashboard');
        }
      }
    );

    // Check for an existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/admin/dashboard');
      }
    });

    // Clean up the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, [navigate]); // navigate is a dependency to ensure useEffect reacts to changes if navigate function itself changes, though it's usually stable.

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true during the sign-in process

    try {
      // Directly attempt to sign in using Supabase's built-in authentication.
      // Supabase handles password hashing and verification against its auth.users table.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If there's an error during sign-in (e.g., invalid credentials, user not found)
        toast({
          title: "Sign In Failed",
          description: signInError.message || "Invalid email or password.", // Display Supabase's error message or a generic one
          variant: "destructive",
        });
        setLoading(false); // Reset loading state
        return; // Stop further execution
      }

      // If sign-in is successful, the onAuthStateChange listener will detect the new session
      // and handle the navigation to '/admin/dashboard'.
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to admin dashboard.",
      });

    } catch (error: any) {
      // Catch any unexpected errors that might occur outside of the Supabase call
      toast({
        title: "Error",
        description: "An unexpected error occurred during sign-in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Ensure loading state is always reset
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Store
          </Button>
          <h1 className="text-3xl font-bold text-primary">Mohair Handmade</h1>
          <p className="text-muted-foreground mt-2">Admin Access</p>
        </div>

        <Card className="craft-shadow">
          <CardHeader className="text-center">
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>
              Sign in to manage your handmade products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mohairhandmade.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
