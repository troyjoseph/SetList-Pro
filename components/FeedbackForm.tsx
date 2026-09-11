
import React, { useState } from 'react';
import { Mail, CheckCircle, Loader2, Send } from 'lucide-react';

export const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      if (response.ok) {
        setIsSubmitted(true);
        setFeedback({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send feedback');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-indigo-50 rounded-3xl p-8 sm:p-12 border border-indigo-100">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <Mail className="text-indigo-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">We'd love your feedback</h2>
        <p className="text-gray-600">
          Help us make Setlist♯ even better. Send your suggestions, bug reports, or feature requests directly to our team.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-200 text-center animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h3>
          <p className="text-gray-600 mb-6">Your feedback has been sent successfully. We appreciate your input.</p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                required
                value={feedback.name}
                onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                required
                value={feedback.email}
                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              required
              rows={4}
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="How can we improve Setlist♯?"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-bold rounded-xl shadow-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <Send className="mr-2" size={18} />
            )}
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </button>
        </form>
      )}
    </div>
  );
};
