import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUserStore } from './stores/userStore.ts';
import { Layout } from './components/layout/Layout.tsx';
import { Welcome } from './components/onboarding/Welcome.tsx';
import { BackgroundAssessment } from './components/onboarding/BackgroundAssessment.tsx';
import { InterestMapping } from './components/onboarding/InterestMapping.tsx';
import { GoalSetting } from './components/onboarding/GoalSetting.tsx';
import { PathwayPreview } from './components/onboarding/PathwayPreview.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { PathwayPage } from './pages/PathwayPage.tsx';
import { LessonPage } from './pages/LessonPage.tsx';
import { LibraryPage } from './pages/LibraryPage.tsx';
import { NotesPage } from './pages/NotesPage.tsx';
import { ProgressPage } from './pages/ProgressPage.tsx';
import { ExportPage } from './pages/ExportPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';

function AppRoutes() {
  const { profile } = useUserStore();
  const onboarded = profile?.onboardingCompleted;

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Onboarding routes */}
        <Route path="/onboarding" element={<Welcome />} />
        <Route path="/onboarding/background" element={<BackgroundAssessment />} />
        <Route path="/onboarding/interests" element={<InterestMapping />} />
        <Route path="/onboarding/goals" element={<GoalSetting />} />
        <Route path="/onboarding/preview" element={<PathwayPreview />} />

        {/* Main app routes */}
        <Route path="/dashboard" element={onboarded ? <DashboardPage /> : <Navigate to="/onboarding" />} />
        <Route path="/pathway" element={onboarded ? <PathwayPage /> : <Navigate to="/onboarding" />} />
        <Route path="/lesson/:lessonId" element={onboarded ? <LessonPage /> : <Navigate to="/onboarding" />} />
        <Route path="/library" element={onboarded ? <LibraryPage /> : <Navigate to="/onboarding" />} />
        <Route path="/notes" element={onboarded ? <NotesPage /> : <Navigate to="/onboarding" />} />
        <Route path="/progress" element={onboarded ? <ProgressPage /> : <Navigate to="/onboarding" />} />
        <Route path="/export" element={onboarded ? <ExportPage /> : <Navigate to="/onboarding" />} />
        <Route path="/about" element={onboarded ? <AboutPage /> : <Navigate to="/onboarding" />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={onboarded ? '/dashboard' : '/onboarding'} />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
