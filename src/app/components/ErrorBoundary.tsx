import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary Caught Error:', error);
    console.error('📍 Error Info:', errorInfo);
    console.error('📚 Component Stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    console.log('🔄 Resetting error boundary...');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    console.log('🏠 Navigating to home...');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-slate-800 rounded-2xl border-4 border-red-500 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 border-b-4 border-yellow-400">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" strokeWidth={3} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      Something Went Wrong
                    </h1>
                    <p className="text-yellow-200 font-bold text-sm sm:text-base mt-1">
                      The Fictionverse encountered an unexpected error
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                <div className="bg-slate-900 rounded-lg p-4 border-2 border-slate-700">
                  <h3 className="text-red-400 font-black text-sm uppercase mb-2">Error Details:</h3>
                  <p className="text-white font-mono text-sm break-words">
                    {this.state.error?.message || 'Unknown error occurred'}
                  </p>
                </div>

                {/* Stack Trace (collapsible) */}
                {this.state.errorInfo && (
                  <details className="bg-slate-900 rounded-lg border-2 border-slate-700">
                    <summary className="p-4 cursor-pointer text-yellow-400 font-bold text-sm uppercase hover:text-yellow-300">
                      Show Technical Details
                    </summary>
                    <div className="p-4 pt-0">
                      <pre className="text-xs text-slate-300 overflow-auto max-h-64 font-mono whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 border-4 border-blue-400 text-white font-black uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" strokeWidth={3} />
                    Try Again
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 border-4 border-green-400 text-white font-black uppercase rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="w-5 h-5" strokeWidth={3} />
                    Go Home
                  </button>
                </div>

                {/* Help Text */}
                <div className="text-center">
                  <p className="text-slate-400 text-sm">
                    If this problem persists, please check the browser console for more details.
                  </p>
                  <p className="text-slate-500 text-xs mt-2">
                    Press F12 to open developer tools
                  </p>
                </div>
              </div>
            </div>

            {/* Logo/Branding */}
            <div className="text-center mt-8">
              <p className="text-slate-500 font-bold text-sm">
                The Fictionverse by AlterOne Studio
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for page components
export function PageErrorBoundary({ children, pageName }: { children: ReactNode; pageName: string }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error(`🚨 Error in ${pageName} page:`, error);
        console.error('Component stack:', errorInfo.componentStack);
      }}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 p-8 bg-slate-800 rounded-xl border-4 border-red-500">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" strokeWidth={3} />
            <div>
              <h3 className="text-xl font-black text-white uppercase">Error Loading {pageName}</h3>
              <p className="text-slate-400 text-sm mt-2">Please refresh the page or try again later</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400 text-white font-black uppercase rounded-lg hover:opacity-90 transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
