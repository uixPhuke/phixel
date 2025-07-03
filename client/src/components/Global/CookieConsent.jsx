import React, { useState, useEffect } from 'react';

// Define the CookieConsentModal component
export const CookieConsent = () => {
    // State variable to track whether the modal is open
    const [open, setOpen] = useState(false);

    // useEffect hook to check if the user has already consented to cookies
    useEffect(() => {
        const hasConsented = localStorage.getItem('cookieConsent');
        if (!hasConsented) {
            setOpen(true); // Open the modal if consent has not been given
        }
    }, []);

    // Function to handle the acceptance of cookies
    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true'); // Save consent in localStorage
        setOpen(false); // Close the modal
    };

    // Function to handle the decline of cookies
    const handleClose = () => {
        localStorage.setItem('cookieConsent', 'false'); // Save decline in localStorage
        setOpen(false); // Close the modal
    };

    return (
        <div>
            {/* Render the modal only if the open state is true */}
            {open && (
                <div className="fixed bottom-4 right-4 bg-primary shadow-lg md:w-96 w-80 z-50 rounded-lg">
                    <div className="p-4">
                        <div className="mb-4">
                            <p className="cursive-font md:text-lg text-sm text-secondary text-center">
                                Our website uses cookies in order to offer you the most relevant information. Please accept for optimal experience.
                            </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                            {/* Accept button */}
                            <button
                                className="cursive-font bg-secondary text-accent text-sm px-4 py-1 rounded-xs hover:bg-primary border hover:border-white hover:text-white"
                                onClick={handleAccept}
                            >
                                Accept
                            </button>
                            {/* Decline button */}
                            <button
                                className="cursive-font border border-white text-white text-xs px-4 py-1 rounded-sm hover:bg-gray-white hover:text-white"
                                onClick={handleClose}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
