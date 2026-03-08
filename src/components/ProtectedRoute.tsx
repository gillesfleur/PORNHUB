import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isLoggedIn) {
      setToastMessage('Veuillez vous connecter pour accéder à cette page');
      setShowToast(true);
      timeout = setTimeout(() => setShowToast(false), 3000);
    } else if (adminOnly && user?.role !== 'admin') {
      setToastMessage('Accès non autorisé');
      setShowToast(true);
      timeout = setTimeout(() => setShowToast(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isLoggedIn, adminOnly, user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location, message: 'Veuillez vous connecter pour accéder à cette page' }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" state={{ message: 'Accès non autorisé' }} replace />;
  }

  return <>{children}</>;
};
