import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { LoginPage } from "./pages/LoginPage";
import { OfficePage } from "./pages/OfficePage";
import { TasksPage } from "./pages/TasksPage";
import { TheoryPage } from "./pages/TheoryPage";
import { ToolkitPage } from "./pages/ToolkitPage";
import { TaskDetailPage } from "./pages/TaskDetailPage";
import { AuditPage } from "./pages/AuditPage";
import { ProfilePage } from "./pages/ProfilePage";
import { QuizPage } from "./pages/QuizPage";
import { FlashcardsPage } from "./pages/FlashcardsPage";
import { PersonalTasksPage } from "./pages/PersonalTasksPage";
import { AdminPage } from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface User {
  name: string;
  telegram: string;
  isAdmin?: boolean;
}

const App = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mvp-studio-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mvp-studio-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mvp-studio-user');
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route
              path="/"
              element={
                user ? <Navigate to="/office" replace /> : <LoginPage onLogin={handleLogin} />
              }
            />

            {/* Protected Routes */}
            <Route
              element={
                user ? (
                  <AppLayout user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            >
              <Route path="/office" element={<OfficePage user={user!} />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/task/:slug" element={<TaskDetailPage />} />
              <Route path="/theory" element={<TheoryPage />} />
              <Route path="/toolkit" element={<ToolkitPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/profile" element={<ProfilePage user={user!} />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/flashcards" element={<FlashcardsPage />} />
              <Route path="/personal" element={<PersonalTasksPage />} />
              {/* Admin Route */}
              <Route 
                path="/admin" 
                element={user?.isAdmin ? <AdminPage /> : <Navigate to="/office" replace />} 
              />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
