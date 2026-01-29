import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from '@/components/CodeEditor';
import { getCurrentAdmin, getSubmissions, getExamById } from '@/lib/storage';
import { Submission, Exam } from '@/types/exam';
import { ArrowLeft, User, Clock, AlertTriangle } from 'lucide-react';

export const SubmissionView = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const admin = getCurrentAdmin();
  
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }

    if (!submissionId) {
      navigate('/admin/dashboard');
      return;
    }

    const loadSubmission = async () => {
      const allSubmissions = await getSubmissions();
      const found = allSubmissions.find(s => s.id === submissionId);
      
      if (!found) {
        navigate('/admin/dashboard');
        return;
      }

      setSubmission(found);
      const examData = await getExamById(found.examId);
      setExam(examData || null);
    };

    loadSubmission();
  }, [submissionId, admin, navigate]);

  if (!submission || !admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Submission Review</h1>
              <p className="text-sm text-muted-foreground">{exam?.title}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Student Info */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{submission.studentName}</span>
                <span className="text-muted-foreground">({submission.studentRollNo})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">
                  {submission.tabSwitchCount} tab switches
                </Badge>
              </div>
              {submission.isAutoSubmitted && (
                <Badge variant="destructive">Auto-submitted (violation)</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Code View */}
        <Card className="h-[calc(100vh-250px)]">
          <CardContent className="p-0 h-full">
            <CodeEditor
              htmlCode={submission.htmlCode}
              cssCode={submission.cssCode}
              jsCode={submission.jsCode}
              onHtmlChange={() => {}}
              onCssChange={() => {}}
              onJsChange={() => {}}
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
