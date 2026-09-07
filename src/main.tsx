import './utils/safeStorage';
import {StrictMode, Component, ErrorInfo, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { purgeExpendableStorage } from './utils/safeStorage';

// Suppress benign iframe websocket connection rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason?.message || String(event?.reason || '');
    if (
      reason.includes('WebSocket') ||
      reason.includes('websocket') ||
      reason.includes('failed to connect') ||
      reason.includes('QuotaExceededError')
    ) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('WebSocket') ||
      msg.includes('websocket') ||
      msg.includes('QuotaExceededError')
    ) {
      event.preventDefault();
    }
  });
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // If it is a QuotaExceededError, auto-clean expendable keys
    if (error?.name === 'QuotaExceededError' || error?.message?.includes('exceeded the quota')) {
      try {
        purgeExpendableStorage();
      } catch (e) {}
    }
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg font-semibold">Algo salió mal al cargar la aplicación</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Esto suele deberse a datos antiguos o incompatibles guardados en el navegador. Haz clic en el botón de abajo para restablecer la base de datos local e intentar de nuevo.
            </p>
            {this.state.error && (
              <pre className="p-3 bg-black/40 rounded-lg border border-slate-800 text-[10px] font-mono text-rose-300 overflow-auto max-h-40 whitespace-pre-wrap">
                {this.state.error.toString()}
                {this.state.error.stack ? `\n\n${this.state.error.stack}` : ""}
              </pre>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                Restablecer Datos Locales
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer"
              >
                Recargar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

