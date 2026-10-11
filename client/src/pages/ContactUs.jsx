import React, { useState } from 'react';
import { Phone, MapPin, User, Mail, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

const FAQS = [
  {
    q: 'How do I place an order on ShopEase?',
    a: 'Browse our catalog, click on any product, choose your desired quantity, and click "Add to Cart". When you are ready, head to your Cart and proceed to our secure online checkout.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We support all major payment modes including UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and NetBanking through verified 256-bit encrypted gateways (Cashfree / Razorpay).',
  },
  {
    q: 'How can I track my order?',
    a: 'You can check your active orders and fulfillment statuses anytime by visiting the "My Orders" tab after logging into your account.',
  },
  {
    q: 'Can I cancel or modify an order after placing it?',
    a: 'If your order is still in "Processing" status, please contact our support team immediately at +91 6267194039 for assistance.',
  },
];

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="container" style={{ marginTop: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Get in Touch with Us</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about an order, shipping, or product sizing? We are here to help.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Official Store Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Store Owner</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>Kishan Soni</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Direct Contact Phone</h4>
                  <p style={{ fontSize: '0.92rem' }}>
                    <a href="tel:6267194039" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      +91 6267194039
                    </a>
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Call or WhatsApp (Mon - Sat, 10 AM - 7 PM)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Registered Address</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5' }}>
                    Vijay Nagar, Indore, Madhya Pradesh – 452001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Send Us a Message</h3>

          {submitted && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Thank you! Your message has been received. We will get back to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="e.g. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Order ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Question regarding Order #12345"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-input"
                rows="4"
                required
                placeholder="How can we help you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '1.5rem' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '4rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <HelpCircle size={24} color="var(--primary)" />
          <h2 style={{ fontSize: '1.6rem' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {faq.q}
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
