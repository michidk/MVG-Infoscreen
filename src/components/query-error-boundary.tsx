"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: (props: {
		error: Error;
		resetErrorBoundary: () => void;
	}) => ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
		console.error("[ErrorBoundary] Caught error:", error, errorInfo);
	}

	resetErrorBoundary = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError && this.state.error) {
			if (this.props.fallback) {
				return this.props.fallback({
					error: this.state.error,
					resetErrorBoundary: this.resetErrorBoundary,
				});
			}

			return (
				<DefaultErrorFallback
					error={this.state.error}
					resetErrorBoundary={this.resetErrorBoundary}
				/>
			);
		}

		return this.props.children;
	}
}

interface DefaultErrorFallbackProps {
	error: Error;
	resetErrorBoundary: () => void;
}

function DefaultErrorFallback({
	error,
	resetErrorBoundary,
}: DefaultErrorFallbackProps) {
	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
			<div className="rounded-full bg-red-100 p-4 mb-4">
				<AlertCircle className="h-12 w-12 text-red-600" />
			</div>
			<h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
			<p className="text-gray-600 mb-4 max-w-md">
				{error.message || "An unexpected error occurred"}
			</p>
			<button
				type="button"
				onClick={resetErrorBoundary}
				className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				<RefreshCw className="h-4 w-4" />
				Try again
			</button>
		</div>
	);
}

/**
 * QueryErrorBoundary - Error boundary optimized for React Query
 *
 * Integrates with React Query's error reset mechanism to properly
 * reset query errors when the user clicks "Try again".
 *
 * @example
 * ```tsx
 * <QueryErrorBoundary>
 *   <YourComponent />
 * </QueryErrorBoundary>
 * ```
 *
 * @example Custom fallback
 * ```tsx
 * <QueryErrorBoundary
 *   fallback={({ error, resetErrorBoundary }) => (
 *     <div>
 *       <p>Error: {error.message}</p>
 *       <button onClick={resetErrorBoundary}>Reset</button>
 *     </div>
 *   )}
 * >
 *   <YourComponent />
 * </QueryErrorBoundary>
 * ```
 */
export function QueryErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					fallback={
						fallback
							? ({ error }) => fallback({ error, resetErrorBoundary: reset })
							: ({ error }) => (
									<DefaultErrorFallback
										error={error}
										resetErrorBoundary={reset}
									/>
								)
					}
				>
					{children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
