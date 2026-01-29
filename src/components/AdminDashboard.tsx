import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  getCurrentAdmin,
  setCurrentAdmin,
  getExams,
  saveExam,
  deleteExam,
  getSubmissionsByExam,
  getStudents,
} from '@/lib/storage';
import { Exam, Submission, Student } from '@/types/exam';
import {
  Plus,
  LogOut,
  FileCode,
  Users,
  Clock,
  Settings,
  Eye,
  Trash2,
  Edit,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState('60');
  const [formMaxTabSwitches, setFormMaxTabSwitches] = useState('3');
  const [formAllowCopyPaste, setFormAllowCopyPaste] = useState(false);
  
  const navigate = useNavigate();
  const admin = getCurrentAdmin();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [admin, navigate]);

  const loadData = () => {
    setExams(getExams());
    setStudents(getStudents());
  };

  const handleLogout = () => {
    setCurrentAdmin(null);
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDuration('60');
    setFormMaxTabSwitches('3');
    setFormAllowCopyPaste(false);
  };

  const handleCreateExam = () => {
    if (!formTitle.trim()) {
      toast.error('Please enter an exam title');
      return;
    }

    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title: formTitle.trim(),
      description: formDescription.trim(),
      duration: parseInt(formDuration) || 60,
      maxTabSwitches: parseInt(formMaxTabSwitches) || 3,
      allowCopyPaste: formAllowCopyPaste,
      isActive: false,
      createdAt: new Date().toISOString(),
    };

    saveExam(newExam);
    setShowCreateDialog(false);
    resetForm();
    loadData();
    toast.success('Exam created successfully!');
  };

  const handleEditExam = () => {
    if (!editingExam || !formTitle.trim()) {
      toast.error('Please enter an exam title');
      return;
    }

    const updatedExam: Exam = {
      ...editingExam,
      title: formTitle.trim(),
      description: formDescription.trim(),
      duration: parseInt(formDuration) || 60,
      maxTabSwitches: parseInt(formMaxTabSwitches) || 3,
      allowCopyPaste: formAllowCopyPaste,
    };

    saveExam(updatedExam);
    setShowEditDialog(false);
    setEditingExam(null);
    resetForm();
    loadData();
    toast.success('Exam updated successfully!');
  };

  const openEditDialog = (exam: Exam) => {
    setEditingExam(exam);
    setFormTitle(exam.title);
    setFormDescription(exam.description);
    setFormDuration(exam.duration.toString());
    setFormMaxTabSwitches(exam.maxTabSwitches.toString());
    setFormAllowCopyPaste(exam.allowCopyPaste);
    setShowEditDialog(true);
  };

  const toggleExamActive = (exam: Exam) => {
    const updatedExam = { ...exam, isActive: !exam.isActive };
    saveExam(updatedExam);
    loadData();
    toast.success(`Exam ${updatedExam.isActive ? 'activated' : 'deactivated'}`);
  };

  const handleDeleteExam = (examId: string) => {
    deleteExam(examId);
    loadData();
    toast.success('Exam deleted successfully');
  };

  const viewSubmissions = (exam: Exam) => {
    setSelectedExam(exam);
    setSubmissions(getSubmissionsByExam(exam.id));
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">{admin.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="exams" className="space-y-6">
          <TabsList>
            <TabsTrigger value="exams" className="gap-2">
              <FileCode className="h-4 w-4" />
              Exams
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <Eye className="h-4 w-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Exams</h2>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Exam
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Exam</DialogTitle>
                    <DialogDescription>
                      Set up exam parameters and anti-cheat settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Exam Title</Label>
                      <Input
                        id="title"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g., HTML/CSS Practical Test"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Exam instructions..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formDuration}
                          onChange={(e) => setFormDuration(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tabSwitches">Max Tab Switches</Label>
                        <Input
                          id="tabSwitches"
                          type="number"
                          value={formMaxTabSwitches}
                          onChange={(e) => setFormMaxTabSwitches(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="copyPaste">Allow Copy/Paste</Label>
                      <Switch
                        id="copyPaste"
                        checked={formAllowCopyPaste}
                        onCheckedChange={setFormAllowCopyPaste}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateExam}>Create Exam</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {exams.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No exams created yet</p>
                  <p className="text-sm text-muted-foreground">Create your first exam to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exams.map((exam) => (
                  <Card key={exam.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{exam.title}</CardTitle>
                          <CardDescription className="mt-1">{exam.description}</CardDescription>
                        </div>
                        <Badge variant={exam.isActive ? 'default' : 'secondary'}>
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {exam.duration} mins
                        </Badge>
                        <Badge variant="outline">
                          {exam.maxTabSwitches} tab switches
                        </Badge>
                        <Badge variant={exam.allowCopyPaste ? 'secondary' : 'destructive'}>
                          {exam.allowCopyPaste ? 'Copy allowed' : 'No copy'}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExamActive(exam)}
                        >
                          {exam.isActive ? (
                            <ToggleRight className="h-4 w-4" />
                          ) : (
                            <ToggleLeft className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(exam)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewSubmissions(exam)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete exam?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. All submissions will also be lost.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteExam(exam.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Exam</DialogTitle>
                  <DialogDescription>
                    Update exam parameters and settings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Exam Title</Label>
                    <Input
                      id="edit-title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-duration">Duration (minutes)</Label>
                      <Input
                        id="edit-duration"
                        type="number"
                        value={formDuration}
                        onChange={(e) => setFormDuration(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-tabSwitches">Max Tab Switches</Label>
                      <Input
                        id="edit-tabSwitches"
                        type="number"
                        value={formMaxTabSwitches}
                        onChange={(e) => setFormMaxTabSwitches(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-copyPaste">Allow Copy/Paste</Label>
                    <Switch
                      id="edit-copyPaste"
                      checked={formAllowCopyPaste}
                      onCheckedChange={setFormAllowCopyPaste}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditExam}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <h2 className="text-2xl font-bold">Registered Students</h2>
            {students.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No students registered yet</p>
                  <p className="text-sm text-muted-foreground">Students will appear here when they login</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined: {new Date(student.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-4">
            <h2 className="text-2xl font-bold">View Submissions</h2>
            
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">Select Exam</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {exams.map((exam) => (
                    <Button
                      key={exam.id}
                      variant={selectedExam?.id === exam.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => viewSubmissions(exam)}
                    >
                      {exam.title}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-sm">
                    {selectedExam ? `Submissions for ${selectedExam.title}` : 'Select an exam'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedExam ? (
                    <p className="text-muted-foreground text-center py-8">
                      Select an exam to view submissions
                    </p>
                  ) : submissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No submissions yet for this exam
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => (
                        <Card key={submission.id}>
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-base">{submission.studentName}</CardTitle>
                                <CardDescription>Roll No: {submission.studentRollNo}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.isAutoSubmitted && (
                                  <Badge variant="destructive">Auto-submitted</Badge>
                                )}
                                <Badge variant="outline">
                                  {submission.tabSwitchCount} tab switches
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground mb-2">
                              Submitted: {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                            <Button
                              size="sm"
                              onClick={() => navigate(`/admin/submission/${submission.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Code
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
