import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import { CaseFile, ViewType, UserProfile, LegalModalType } from '../types';
import { SupabaseDataService } from '../services/supabase';

const defaultFallbackUser: UserProfile = {
  id: 'usr-default',
  name: 'Ing. Andrés Felipe Cárdenas',
  email: 'andres.cardenas@sena.edu.co',
  role: 'Coordinador',
  roleTitle: 'Coordinador Académico',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  regional: 'Regional Cundinamarca',
  center: 'Centro de Biotecnología Agropecuaria - Mosquera',
};

export interface OtpConfig {
  title: string;
  description: string;
  actionType?: string;
  onSign: (signatureHash: string) => void;
}

interface CaseContextType {
  cases: CaseFile[];
  activeView: ViewType;
  selectedCaseId: string;
  selectedCase: CaseFile | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: ViewType) => void;
  setSelectedCaseId: (id: string) => void;
  navigateTo: (view: ViewType, caseId?: string) => void;
  updateCase: (caseId: string, partial: Partial<CaseFile>) => void;
  addCase: (newCase: CaseFile) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  
  // Auth & Session
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  users: UserProfile[];
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user?: UserProfile) => void;
  loginWithCredentials: (identifier: string, password?: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => void;

  // Theme (Dark / Light)
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Mobile Drawer
  isMobileDrawerOpen: boolean;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;

  // Legal & Institutional Modals
  activeLegalModal: LegalModalType;
  openLegalModal: (modal: LegalModalType) => void;
  closeLegalModal: () => void;

  // Human-in-the-Loop OTP Signature
  isOtpModalOpen: boolean;
  otpConfig: OtpConfig | null;
  requestOtpSignature: (config: OtpConfig) => void;
  closeOtpModal: () => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [activeView, setActiveView] = useState<ViewType>('public-portal');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultFallbackUser);

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Legal Modals State
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  // Human-in-the-Loop OTP Signature State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [otpConfig, setOtpConfig] = useState<OtpConfig | null>(null);

  // Supabase Data Sync Effect
  useEffect(() => {
    let isMounted = true;

    // Restaurar sesión previa si existe
    try {
      const savedSession = localStorage.getItem('sgpdp_user_session');
      if (savedSession) {
        const parsedUser = JSON.parse(savedSession);
        if (parsedUser && parsedUser.id) {
          setCurrentUser(parsedUser);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.warn('Error al restaurar sesión previa:', e);
    }

    async function loadDataFromSupabase() {
      try {
        // Cargar usuarios reales desde Supabase
        const dbUsers = await SupabaseDataService.fetchAndMapUsers();
        if (isMounted && dbUsers && dbUsers.length > 0) {
          setUsers(dbUsers);
          
          // Si no había sesión guardada, mantener el usuario actual sincronizado
          const savedSession = localStorage.getItem('sgpdp_user_session');
          if (!savedSession) {
            const defaultDbUser = dbUsers.find((u: any) => u.dbRole === 'COORDINADOR_ACADEMICO') || dbUsers[0];
            if (defaultDbUser) {
              setCurrentUser(defaultDbUser);
            }
          } else {
            // Actualizar los datos del usuario logueado con los últimos de la base de datos
            try {
              const currentSaved = JSON.parse(savedSession);
              const refreshed = dbUsers.find(u => u.email === currentSaved.email || u.id === currentSaved.id);
              if (refreshed) {
                setCurrentUser(refreshed);
                localStorage.setItem('sgpdp_user_session', JSON.stringify(refreshed));
              }
            } catch {}
          }
          console.log(`[Supabase] ${dbUsers.length} usuarios institucionales cargados desde PostgreSQL`);
        }

        // Cargar casos reales desde Supabase
        const dbCases = await SupabaseDataService.fetchAndMapCases();
        if (isMounted && dbCases && dbCases.length > 0) {
          setCases(dbCases);
          if (dbCases[0]?.id) {
            setSelectedCaseId(dbCases[0].id);
          }
          console.log(`[Supabase] ${dbCases.length} expedientes cargados desde PostgreSQL`);
        }
      } catch (err) {
        console.error('[Supabase] Error al consultar datos desde la base de datos:', err);
      }
    }

    loadDataFromSupabase();

    // Suscribirse a cambios en tiempo real
    const channel = SupabaseDataService.subscribeToCases(() => {
      loadDataFromSupabase();
    });

    return () => {
      isMounted = false;
      channel?.unsubscribe?.();
    };
  }, []);

  // Apply dark/light class to root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    showToast(`Tema cambiado a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const selectedCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  const navigateTo = (view: ViewType, caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
    setActiveView(view);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCase = (caseId: string, partial: Partial<CaseFile>) => {
    setCases(prev => prev.map(c => (c.id === caseId ? { ...c, ...partial } : c)));
  };

  const addCase = async (newCase: CaseFile) => {
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    try {
      await SupabaseDataService.persistCaseToSupabase(newCase);
    } catch (e) {
      console.warn('Error al persistir en Supabase:', e);
    }
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (user?: UserProfile) => {
    const targetUser = user || currentUser;
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('sgpdp_user_session', JSON.stringify(targetUser));
    }
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    showToast(`Bienvenido(a), ${targetUser?.name} (${targetUser?.roleTitle})`);
    navigateTo('dashboard');
  };

  const loginWithCredentials = async (identifier: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    try {
      const res = await SupabaseDataService.authenticateUser(identifier, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        localStorage.setItem('sgpdp_user_session', JSON.stringify(res.user));
        showToast(`Acceso verificado en Supabase: ${res.user.name} (${res.user.roleTitle})`);
        navigateTo('dashboard');
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Credenciales no válidas' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error de conexión con Supabase' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sgpdp_user_session');
    showToast('Sesión cerrada correctamente');
    navigateTo('public-portal');
  };

  const toggleMobileDrawer = () => {
    setIsMobileDrawerOpen(prev => !prev);
  };

  const closeMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  const openLegalModal = (modal: LegalModalType) => {
    setActiveLegalModal(modal);
  };

  const closeLegalModal = () => {
    setActiveLegalModal(null);
  };

  const requestOtpSignature = (config: OtpConfig) => {
    setOtpConfig(config);
    setIsOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtpConfig(null);
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        activeView,
        selectedCaseId,
        selectedCase,
        searchQuery,
        setSearchQuery,
        setActiveView,
        setSelectedCaseId,
        navigateTo,
        updateCase,
        addCase,
        toastMessage,
        showToast,
        isAuthenticated,
        isAuthModalOpen,
        users,
        currentUser,
        setCurrentUser,
        openAuthModal,
        closeAuthModal,
        login,
        loginWithCredentials,
        logout,
        theme,
        toggleTheme,
        isMobileDrawerOpen,
        toggleMobileDrawer,
        closeMobileDrawer,
        activeLegalModal,
        openLegalModal,
        closeLegalModal,
        isOtpModalOpen,
        otpConfig,
        requestOtpSignature,
        closeOtpModal,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCaseContext = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  return context;
};
