import React from 'react';
import { ShieldCheck, Lock, Eye, Server, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="container" style={{ marginTop: '2.5rem', maxWidth: '860px' }}>
      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={28} color="var(--primary)" />
          <h1 style={{ fontSize: '2.2rem' }}>Privacy Policy</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Effective Date: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Information We Collect</h3>
            <p>
              When you register, place an order, or browse ShopEase, we collect necessary account information including your name, mobile number, shipping addresses, and transaction histories. One-Time Passwords (OTPs) used for authentication are cryptographically hashed using bcrypt and automatically deleted after expiry.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Payment Information Security</h3>
            <p>
              We <strong>never</strong> store your raw debit/credit card numbers, CVVs, or bank net-banking passwords on our servers. All financial transactions are directly processed through PCI-DSS certified payment gateways (Razorpay / Cashfree) with end-to-end encryption.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. How We Use Your Data</h3>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Processing, fulfilling, and updating you on your order status.</li>
              <li>Managing your user cart, preferences, and account security.</li>
              <li>Customer service assistance and responding to inquiries.</li>
              <li>Preventing fraud, unauthorized account access, and security breaches.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Data Protection & Isolation</h3>
            <p>
              We implement industry-standard security safeguards. Your cart items, personal profile, and order history are strictly isolated and accessible only by you through JWT-authenticated sessions.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>5. Third-Party Disclosures</h3>
            <p>
              We do not sell, trade, or rent your personal identification information to marketing third parties. Data is shared exclusively with verified delivery courier partners and payment processors to complete your order.
            </p>
          </section>

          <section style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Privacy & Data Inquiries</h4>
            <p style={{ fontSize: '0.9rem' }}>
              For any questions regarding your personal data or account deletion:<br />
              <strong>ShopEase</strong> | Kishan Soni<br />
              <strong>Phone:</strong> <a href="tel:6267194039" style={{ color: 'var(--primary)', fontWeight: 600 }}>+91 6267194039</a><br />
              <strong>Location:</strong> Vijay Nagar, Indore, Madhya Pradesh – 452001
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
