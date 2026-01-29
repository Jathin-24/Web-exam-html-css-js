import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getCurrentStudent, setCurrentStudent, getActiveExams, getSubmissionByStudentAndExam } from '@/lib/storage';
import { Exam } from '@/types/exam';
import { Clock, FileCode, LogOut, CheckCircle, Play } from 'lucide-react';

export const StudentExamList = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExams, setSubmittedExams] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const student = getCurrentStudent();

  useEffect(() => {
    if (!student) {
      navigate('/');
      return;
    }
    loadExams();
  }, [student, navigate]);

  const loadExams = async () => {
    const activeExams = await getActiveExams();
    setExams(activeExams);
    
    // Check which exams are already submitted
    const submitted = new Set<string>();
    for (const exam of activeExams) {
      const existingSubmission = await getSubmissionByStudentAndExam(student!.id, exam.id);
      if (existingSubmission) {
        submitted.add(exam.id);
      }
    }
    setSubmittedExams(submitted);
  };

  const handleStartExam = async (exam: Exam) => {
    // Check if already submitted
    const existingSubmission = await getSubmissionByStudentAndExam(student!.id, exam.id);
    if (existingSubmission) {
      toast.error('You have already submitted this exam');
      return;
    }

    navigate(`/student/exam/${exam.id}`);
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!student) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Welcome, {student.name}</h1>
            <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Available Exams</h2>

        {exams.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No exams available at the moment</p>
              <p className="text-sm text-muted-foreground">Check back later for upcoming exams</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const submitted = submittedExams.has(exam.id);
              
              return (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{exam.title}</CardTitle>
                        <CardDescription className="mt-1">{exam.description}</CardDescription>
                      </div>
                      {submitted && (
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {exam.duration} mins
                      </span>
                      <Badge variant="outline">
                        {exam.maxTabSwitches} tab switches allowed
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 text-xs">
                      {exam.allowCopyPaste ? (
                        <Badge variant="secondary">Copy/Paste allowed</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive">Copy/Paste disabled</Badge>
                      )}
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleStartExam(exam)}
                      disabled={submitted}
                    >
                      {submitted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Already Submitted
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Start Exam
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
