
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { MarketingScripts } from './MarketingScripts';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const navItemClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg' 
        : isAdminPath 
          ? 'text-slate-400 hover:bg-slate-800 hover:text-white' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MarketingScripts />
      <nav 
        className={`${isAdminPath ? 'bg-slate-900 text-white' : 'text-white shadow-sm sticky top-0 z-[100]'}`}
        style={!isAdminPath ? { backgroundColor: theme.primaryColor } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="font-bold text-2xl italic">{theme.siteName}</span>
            </Link>

            <div className="hidden lg:flex items-center space-x-2">
              <Link to="/" className={navItemClass('/')}>
                <Lucide.BookOpen size={16} />
                <span>{t('newsLink')}</span>
              </Link>
              {user && (
                <>
                  <Link to="/admin" className={navItemClass('/admin')}><Lucide.LayoutDashboard size={16} /><span>Admin</span></Link>
                  <Link to="/admin/whatsapp" className={navItemClass('/admin/whatsapp')}><Lucide.MessageSquare size={16} /><span>WhatsApp</span></Link>
                  <Link to="/admin/funnels" className={navItemClass('/admin/funnels')}><Lucide.GitFork size={16} /><span>Funis</span></Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user ? (
                  <button onClick={() => logout()} className="text-sm font-bold hover:opacity-70 flex items-center gap-1">
                    <Lucide.LogOut size={16} /> Sair
                  </button>
                ) : (
                  <Link to="/login" className="text-sm font-bold hover:opacity-70 flex items-center gap-1">
                    <Lucide.LogIn size={16} /> Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} {theme.siteName}. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
};
