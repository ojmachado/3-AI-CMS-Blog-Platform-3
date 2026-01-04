
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { PostPage } from './pages/PostPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { AdminEditor } from './pages/AdminEditor.tsx';
import { AdminSettings } from './pages/AdminSettings.tsx';
import { AdminAppearance } from './pages/AdminAppearance.tsx';
import { AdminUsers } from './pages/AdminUsers.tsx';
import { AdminWhatsApp } from './pages/AdminWhatsApp.tsx';
import { AdminEmail } from './pages/AdminEmail.tsx';
import { AdminFunnels } from './pages/AdminFunnels.tsx';
import { AdminLandingGenerator } from './pages/AdminLandingGenerator.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:slug" element={<PostPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Fixed TypeScript error by correctly wrapping components inside ProtectedRoute as children */}
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/create" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
                <Route path="/admin/edit/:id" element={<ProtectedRoute><AdminEditor /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                <Route path="/admin/appearance" element={<ProtectedRoute><AdminAppearance /></ProtectedRoute>} />
                <Route path="/admin/whatsapp" element={<ProtectedRoute><AdminWhatsApp /></ProtectedRoute>} />
                <Route path="/admin/email" element={<ProtectedRoute><AdminEmail /></ProtectedRoute>} />
                <Route path="/admin/funnels" element={<ProtectedRoute><AdminFunnels /></ProtectedRoute>} />
                <Route path="/admin/landing" element={<ProtectedRoute><AdminLandingGenerator /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
