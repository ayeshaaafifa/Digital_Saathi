import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Digital Saathi encountered an unexpected issue while loading your data. Please reload the page to continue safely.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition-colors"
            >
              Reload Digital Saathi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
