import React, { useState } from 'react';

function ErrorBoundary({ children, fallback }) {
    const [hasError, setHasError] = useState(false);

    const resetError = () => setHasError(false);

    return (
        <React.Suspense fallback={fallback || <h1>Something went wrong.</h1>}>
            {hasError ? (
                fallback || <h1>Something went wrong.</h1>
            ) : (
                <React.ErrorBoundary
                    fallbackRender={({ error, resetErrorBoundary }) => {
                        setHasError(true);
                        console.error('Error caught by ErrorBoundary:', error);
                        return fallback || <h1>Something went wrong.</h1>;
                    }}
                    onReset={resetError}
                >
                    {children}
                </React.ErrorBoundary>
            )}
        </React.Suspense>
    );
}

export default ErrorBoundary;
