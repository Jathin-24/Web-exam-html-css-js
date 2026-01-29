import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentLogin } from "./components/StudentLogin";
import { AdminLogin } from "./components/AdminLogin";
import { StudentExamList } from "./components/StudentExamList";
import { ExamPage } from "./components/ExamPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { SubmissionView } from "./components/SubmissionView";
import { SupabaseTest2 } from "./components/SupabaseTest2";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Debug/Test */}
          <Route path="/test" element={<SupabaseTest2 />} />
          
          {/* Student Routes */}
          <Route path="/" element={<StudentLogin />} />
          <Route path="/student/exams" element={<StudentExamList />} />
          <Route path="/student/exam/:examId" element={<ExamPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/submission/:submissionId" element={<SubmissionView />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
     </TooltipProvider>
  </QueryClientProvider>
);

export default App;
