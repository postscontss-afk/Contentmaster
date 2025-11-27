import type { FC } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthProvider from './services/Auth';
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import VideoList from './pages/VideoList';
import VideoPage from './pages/VideoPage';
import Videoplayer from './pages/Videoplayer';
import Admin from './pages/Admin';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import SplashAnimation from './components/SplashAnimation';
import PaymentNotifications from './components/PaymentNotifications';
import PrivacyNotice from './components/PrivacyNotice';
import ScrollToTop from './components/ScrollToTop';
import CustomAnalytics from './components/CustomAnalytics';
import AgeVerificationModal from './components/AgeVerificationModal';

// Componente AppContent para usar hooks que dependem do Router
const AppContent: FC = () => {
  const { siteName, loading } = useSiteConfig();
  const [showSplash, setShowSplash] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(true);
  const location = useLocation();
  const enableSplash = true; // feature-flag: enable splash to match new design
  
  // Atualizar o título da página quando o siteName mudar
  useEffect(() => {
    if (siteName) {
      document.title = `${siteName} - Adult Content`;
    }
  }, [siteName, location]);

  // Exibir a animação somente na primeira visita à página inicial
  useEffect(() => {
    if (!enableSplash) return;
    const isFirstVisit = !sessionStorage.getItem('visited');

    if (location.pathname === '/' && isFirstVisit) {
      setShowSplash(true);
      sessionStorage.setItem('visited', 'true');
    } else {
      setShowSplash(false);
    }
  }, [location.pathname, enableSplash]);

  // Função para marcar que a animação foi concluída
  const handleAnimationComplete = () => {
    setShowSplash(false);
  };

  // Função para confirmar idade
  const handleAgeConfirm = () => {
    setShowAgeVerification(false);
  };

  // Função para rejeitar acesso
  const handleAgeReject = () => {
    // Redirecionar para uma página de bloqueio ou fechar o site
    window.location.href = 'https://www.google.com';
  };
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <AgeVerificationModal open={showAgeVerification} onConfirm={handleAgeConfirm} onReject={handleAgeReject} />
      {enableSplash && showSplash && <SplashAnimation onAnimationComplete={handleAnimationComplete} />}
      <PrivacyNotice />
      <PaymentNotifications />
      <CustomAnalytics />
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <ScrollToTop />
        <Routes>
          {/* Home page shows our new Home component */}
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<VideoList />} />
          
          {/* Video pages */}
          <Route path="/video/:id" element={<Videoplayer />} />
          <Route path="/video/legacy/:id" element={<VideoPage />} />
          
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Payment Success */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          
          {/* Admin area (protected) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

const App: FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <SiteConfigProvider>
            <AppContent />
          </SiteConfigProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
