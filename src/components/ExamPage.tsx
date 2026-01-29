import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/CodeEditor';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import {
  getCurrentStudent,
  getExamById,
  saveSubmission,
  setExamSession,
  getExamSession,
  updateExamSessionTabCount,
} from '@/lib/storage';
import { Exam, Submission } from '@/types/exam';
import { Clock, AlertTriangle, Send, Maximize2 } from 'lucide-react';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>Start coding here...</p>
</body>
</html>`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
}`;

const DEFAULT_JS = `// Write your JavaScript code here
console.log('Hello from JavaScript!');`;

export const ExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const student = getCurrentStudent();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleSubmit = useCallback(async (isAuto: boolean = false) => {
    if (!exam || !student || isSubmitting) return;

    setIsSubmitting(true);

    const submission: Submission = {
      id: `submission-${Date.now()}`,
      examId: exam.id,
      studentId: student.id,
      studentRollNo: student.rollNo,
      studentName: student.name,
      htmlCode,
      cssCode,
      jsCode,
      tabSwitchCount: antiCheat.tabSwitchCount,
      submittedAt: new Date().toISOString(),
      isAutoSubmitted: isAuto,
    };

    saveSubmission(submission);
    setExamSession(null);
    
    toast.success(isAuto ? 'Exam auto-submitted due to violations' : 'Exam submitted successfully!');
    antiCheat.exitFullscreen();
    navigate('/student/exams');
  }, [exam, student, htmlCode, cssCode, jsCode, isSubmitting, navigate]);

  const antiCheat = useAntiCheat({
    maxTabSwitches: exam?.maxTabSwitches || 3,
    allowCopyPaste: exam?.allowCopyPaste || false,
    onMaxTabSwitchesReached: () => handleSubmit(true),
    onTabSwitch: (count) => updateExamSessionTabCount(count),
  });

  useEffect(() => {
    if (!student) {
      navigate('/');
      return;
    }

    if (!examId) {
      navigate('/student/exams');
      return;
    }

    const examData = getExamById(examId);
    if (!examData) {
      toast.error('Exam not found');
      navigate('/student/exams');
      return;
    }

    setExam(examData);
    setTimeRemaining(examData.duration * 60);
  }, [examId, student, navigate]);

  // Timer
  useEffect(() => {
    if (!hasStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, timeRemaining, handleSubmit]);

  const handleStartExam = async () => {
    if (!exam || !student) return;

    setExamSession({
      examId: exam.id,
      studentId: student.id,
      tabSwitchCount: 0,
    });

    await antiCheat.enterFullscreen();
    setShowStartDialog(false);
    setHasStarted(true);
    toast.success('Exam started! Good luck!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exam || !student) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-semibold">{exam.title}</h1>
            <p className="text-xs text-muted-foreground">
              {student.name} ({student.rollNo})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge 
            variant={timeRemaining < 300 ? 'destructive' : 'secondary'}
            className="text-lg px-4 py-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(timeRemaining)}
          </Badge>

          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Tab switches: {antiCheat.tabSwitchCount} / {exam.maxTabSwitches}
          </Badge>

          {!antiCheat.isFullscreen && (
            <Button size="sm" variant="outline" onClick={antiCheat.enterFullscreen}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          )}

          <Button onClick={() => setShowSubmitDialog(true)} disabled={isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </header>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        {hasStarted && (
          <CodeEditor
            htmlCode={htmlCode}
            cssCode={cssCode}
            jsCode={jsCode}
            onHtmlChange={setHtmlCode}
            onCssChange={setCssCode}
            onJsChange={setJsCode}
          />
        )}
      </div>

      {/* Start Exam Dialog */}
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to start {exam.title}?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Please read the following rules carefully:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Duration: {exam.duration} minutes</li>
                <li>Maximum tab switches allowed: {exam.maxTabSwitches}</li>
                <li>Copy/Paste: {exam.allowCopyPaste ? 'Allowed' : 'Disabled'}</li>
                <li>The exam will start in fullscreen mode</li>
                <li>Exceeding tab switch limit will auto-submit your exam</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate('/student/exams')}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStartExam}>
              Start Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your exam?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit? You cannot make any changes after submission.
              <br />
              Time remaining: {formatTime(timeRemaining)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Working</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSubmit(false)}>
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
