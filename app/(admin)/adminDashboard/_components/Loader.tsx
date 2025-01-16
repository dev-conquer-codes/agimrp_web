import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="loader border-8 border-t-8 border-gray-300 border-t-blue-500 rounded-full w-24 h-24 animate-spin mb-4"></div>
            <p className="text-2xl font-bold">Loading...</p>
            <style jsx>{`
                .loader {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loader;
