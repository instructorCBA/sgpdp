import React from 'react';
import { CaseProvider, useCaseContext } from './context/CaseContext';
import { SideNavBar } from './components/layout/SideNavBar';
import { TopNavBar } from './components/layout/TopNavBar';
import { GlobalFooter } from './components/layout/GlobalFooter';
import { Breadcrumbs } from './components/common/Breadcrumbs';
import { ReadingProgressBar } from './components/common/ReadingProgressBar';
import { ScrollToTop } from './components/common/ScrollToTop';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { LiveSupportWidget } from './components/common/LiveSupportWidget';
import { ErrorBoundary500 } from './components/common/ErrorBoundary500';
import { OtpSignatureModal } from './components/modals/OtpSignatureModal';
import { LegalModals } from './components/modals/LegalModals';
import { AuthModal } from './components/modals/AuthModal';

import { DashboardView } from './components/views/DashboardView';
import { MasterCaseFileView } from './components/views/MasterCaseFileView';
import { ExecutorCitationView } from './components/views/ExecutorCitationView';
import { ExecutorSessionView } from './components/views/ExecutorSessionView';
import { PlanEvaluationView } from './components/views/PlanEvaluationView';
import { CommitteeRequestView } from './components/views/CommitteeRequestView';
import { CommitteeScheduleView } from './components/views/CommitteeScheduleView';
import { SmartTriageView } from './components/views/SmartTriageView';
import { WarningCall1View } from './components/views/WarningCall1View';
import { WarningCall2View } from './components/views/WarningCall2View';
import { PublicPortalView } from './components/views/PublicPortalView';
import { AuthView } from './components/views/AuthView';
import { NotFoundView } from './components/views/NotFoundView';

const AppContent: React.FC = () => {
  const { activeView, toastMessage } = useCaseContext();

  // Full-screen standalone views
  if (activeView === 'public-portal') {
    return (
      <div className="relative min-h-screen bg-[#121212] text-gray-200 antialiased selection:bg-[#39a900] selection:text-white flex flex-col justify-between">
        <ReadingProgressBar />
        <PublicPortalView />
        <GlobalFooter />
        <ScrollToTop />
        <LiveSupportWidget />
        <CookieConsentBanner />
        <LegalModals />
        <OtpSignatureModal />
        <AuthModal />
      </div>
    );
  }

  if (activeView === 'auth') {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col justify-between">
        <AuthView />
        <GlobalFooter />
        <LegalModals />
      </div>
    );
  }

  // Dashboard layout views
  return (
    <div className="flex min-h-screen bg-[#121212] text-gray-200 antialiased selection:bg-[#39a900] selection:text-white relative">
      {/* Top Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Side Navigation Bar (Fixed on Desktop, Drawer on Mobile) */}
      <SideNavBar />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col lg:ml-[280px] min-h-screen w-full overflow-x-hidden">
        <TopNavBar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs />

          {/* Active View Router */}
          {activeView === 'dashboard' && <DashboardView />}
          {(activeView === 'case-detail' || activeView === 'cases-list') && <MasterCaseFileView />}
          {activeView === 'executor-citation' && <ExecutorCitationView />}
          {activeView === 'executor-session' && <ExecutorSessionView />}
          {activeView === 'plan-evaluation' && <PlanEvaluationView />}
          {activeView === 'committee-request' && <CommitteeRequestView />}
          {activeView === 'committee-schedule' && <CommitteeScheduleView />}
          {activeView === 'smart-triage' && <SmartTriageView />}
          {activeView === 'warning-1' && <WarningCall1View />}
          {activeView === 'warning-2' && <WarningCall2View />}
          {activeView === 'not-found' && <NotFoundView />}
        </main>

        {/* Global Institutional Footer */}
        <GlobalFooter />
      </div>

      {/* Floating Utilities */}
      <ScrollToTop />
      <LiveSupportWidget />
      <CookieConsentBanner />
      <LegalModals />
      <OtpSignatureModal />
      <AuthModal />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div 
          role="alert"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1a1c1c] border border-[#39a900] text-white px-5 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-fadeIn"
        >
          <span className="material-symbols-outlined text-[#39a900] text-[20px]">
            check_circle
          </span>
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary500>
      <CaseProvider>
        <AppContent />
      </CaseProvider>
    </ErrorBoundary500>
  );
}
