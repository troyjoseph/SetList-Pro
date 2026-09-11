
import React from 'react';
import { Music, ListMusic, Users, Settings, ArrowRight, Coffee, Loader2 } from 'lucide-react';
import { FeedbackForm } from './FeedbackForm';
import FaviconIcon from './Logo'

// reCAPTCHA Enterprise type definition
declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = React.useState(false);
  
  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6Le0s78sAAAAAOtIdD5vSK5XxPBI_c9w1PKZGfO8";

  React.useEffect(() => {
    // Load reCAPTCHA Enterprise script dynamically
    if (!document.getElementById('recaptcha-enterprise-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-enterprise-script';
      script.src = `https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }
  }, [SITE_KEY]);

  const handleStart = async () => {
    // Skip reCAPTCHA if we are in AI Studio / Development mode
    if (import.meta.env.DEV) {
      console.info("Skipping reCAPTCHA in development mode.");
      onEnter();
      return;
    }

    if (!window.grecaptcha?.enterprise) {
      alert('Security service not ready. If you just updated your keys, please wait a few seconds and refresh.');
      return;
    }

    setIsVerifying(true);
    try {
      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute(SITE_KEY, { action: 'LOGIN' });
          
          const response = await fetch('/api/verify-recaptcha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, action: 'LOGIN' }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server verification failed');
          }

          const data = await response.json();
          if (data.success) {
            onEnter();
          } else {
            const scoreMsg = data.score !== undefined ? ` (Score: ${data.score})` : "";
            const reasonMsg = data.reason?.length ? ` Reasons: ${data.reason.join(', ')}` : "";
            const tokenMsg = data.tokenProperties?.invalidReason ? ` Error: ${data.tokenProperties.invalidReason}` : "";
            
            alert(`Security verification failed${scoreMsg}.${reasonMsg}${tokenMsg}`);
            console.error('reCAPTCHA assessment:', data);
          }
        } catch (execErr: any) {
          console.error('reCAPTCHA execution error:', execErr);
          alert(`Verification error: ${execErr.message}`);
        } finally {
          setIsVerifying(false);
        }
      });
    } catch (err: any) {
      console.error('Verification error:', err);
      setIsVerifying(false);
      alert('Security verification failed. Please check your internet connection.');
    }
  };

  const features = [
    {
      icon: <ListMusic className="text-indigo-600" size={24} />,
      title: "Smart Setlist Building",
      description: "Automate your sequencing with smart logic that considers song keys, energy levels, and singer rotations."
    },
    {
      icon: <Music className="text-indigo-600" size={24} />,
      title: "Repertoire Management",
      description: "Keep your entire song bank organized with tags, keys, and ratings for every performance style."
    },
    {
      icon: <Users className="text-indigo-600" size={24} />,
      title: "Singer Coordination",
      description: "Manage singer availability, song quotas, and vocal ranges to ensure everyone sounds their best."
    },
    {
      icon: <Settings className="text-indigo-600" size={24} />,
      title: "Custom Event Setup",
      description: "Configure event-specific rules, must-play songs, and set structures tailored to your gig."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <header className="bg-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-2xl shadow-xl">
              <FaviconIcon size={48} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Setlist♯
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            The professional setlist builder for bands and event managers. 
            Create perfect event flows with smart automation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleStart}
              disabled={isVerifying}
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>Verifying... <Loader2 className="ml-2 animate-spin" size={20} /></>
              ) : (
                <>Start building <ArrowRight className="ml-2" size={20} /></>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Everything you need for the perfect gig
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <FeedbackForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-gray-100 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Setlist♯. All rights reserved.</p>
      </footer>
    </div>
  );
};
