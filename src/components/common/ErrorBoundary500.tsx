import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  incidentId: string;
}

export class ErrorBoundary500 extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      incidentId: '',
    };
  }

  static getDerivedStateFromError(_: Error): State {
    const incident = `ERR-500-${Date.now().toString(36).toUpperCase()}`;
    return { hasError: true, incidentId: incident };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Mask sensitive details and log safe incident metadata
    console.error('Safe Error Boundary caught exception:', {
      incidentId: this.state.incidentId,
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-6 antialiased">
          <div className="max-w-lg w-full bg-[#161818] border border-red-500/30 rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
            {/* Top red accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500" />

            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/15 text-red-400 rounded-2xl mb-4 border border-red-500/30">
              <span className="material-symbols-outlined text-[32px]">error</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              Incidencia Técnica Detectada (500)
            </h2>
            
            <p className="text-xs text-gray-300 mt-2 leading-relaxed">
              Ha ocurrido un evento inesperado al procesar la solicitud procesal. Por motivos de seguridad y debido proceso, la sesión ha sido resguardada de manera segura.
            </p>

            <div className="my-5 p-3 bg-[#121414] border border-gray-800 rounded-xl font-mono text-xs text-gray-400 flex items-center justify-between">
              <span>ID de Incidencia:</span>
              <span className="text-[#39a900] font-bold">{this.state.incidentId}</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-700 hover:bg-[#252727] text-xs font-semibold text-gray-200 transition-colors cursor-pointer"
              >
                Ir al Inicio
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#39a900] hover:bg-[#329600] text-xs font-bold text-white transition-all shadow-lg cursor-pointer"
              >
                Reintentar Carga
              </button>
            </div>

            <p className="text-[10px] font-mono text-gray-500 mt-5">
              Servicio Nacional de Aprendizaje SENA • Mesa de Ayuda SGPDP
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
