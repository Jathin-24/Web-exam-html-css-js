import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { validateAdmin, setCurrentAdmin } from '@/lib/storage';
import { Shield, Mail, Lock } from 'lucide-react';
export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const admin = validateAdmin(email.trim(), password);
      if (admin) {
        setCurrentAdmin(admin);
        toast.success('Welcome back, Admin!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access the exam management dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input id="email" type="email" placeholder="admin@exam.com" value={email} onChange={e => setEmail(e.target.value)} className="h-11" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} className="h-11" />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>

            <div className="text-center space-y-2">
              
              <p className="text-sm text-muted-foreground">
                Are you a student?{' '}
                <a href="/" className="text-primary hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>;
};