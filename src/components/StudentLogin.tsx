import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { findStudentByRollNo, saveStudent, setCurrentStudent } from '@/lib/storage';
import { Student } from '@/types/exam';
import { GraduationCap, User, Hash } from 'lucide-react';

export const StudentLogin = () => {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rollNo.trim() || !name.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Starting login for roll number:', rollNo.trim());
      
      // Always create/get a student (simpler for initial setup)
      const studentId = `student-${rollNo.trim().toLowerCase()}`;
      const student: Student = {
        id: studentId,
        rollNo: rollNo.trim(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      // Try to save student (will upsert - update if exists, create if not)
      await saveStudent(student);
      console.log('Student saved successfully:', student);

      setCurrentStudent(student);
      toast.success('Login successful!');
      navigate('/student/exams');
    } catch (error: any) {
      console.error('Student login error:', error);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
      
      // Check if it's a table not found error (common when DB not initialized)
      const errorMsg = error?.message || 'Unknown error';
      const isTableError = errorMsg.includes('relation') || errorMsg.includes('does not exist') || errorMsg.includes('PGRST');
      
      if (isTableError) {
        toast.error(
          'Database tables not initialized. Visit /test to check Supabase connection.',
          {
            duration: 5000,
          }
        );
      } else {
        toast.error(`Login failed: ${errorMsg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Student Login</CardTitle>
            <CardDescription>Enter your roll number and name to access exams</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rollNo" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Roll Number
              </Label>
              <Input
                id="rollNo"
                placeholder="Enter your roll number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Start Exam'}
            </Button>

            <a href="/test" className="block text-center text-sm text-muted-foreground hover:text-primary mt-2">
              Not working? Run diagnostic test →
            </a>

            <p className="text-center text-sm text-muted-foreground">
              Are you an admin?{' '}
              <a href="/admin/login" className="text-primary hover:underline">
                Login here
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
