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
      // Check if student exists or create new
      let student = findStudentByRollNo(rollNo.trim());
      
      if (student) {
        // Validate name matches
        if (student.name.toLowerCase() !== name.trim().toLowerCase()) {
          toast.error('Name does not match the roll number');
          setIsLoading(false);
          return;
        }
      } else {
        // Create new student
        student = {
          id: `student-${Date.now()}`,
          rollNo: rollNo.trim(),
          name: name.trim(),
          createdAt: new Date().toISOString(),
        };
        saveStudent(student);
      }

      setCurrentStudent(student);
      toast.success('Login successful!');
      navigate('/student/exams');
    } catch (error) {
      toast.error('Login failed. Please try again.');
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
