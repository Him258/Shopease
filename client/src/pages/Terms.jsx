import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, MapPin, FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="container" style={{ marginTop: '2.5rem', maxWidth: '860px' }}>
      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FileText size={28} color="var(--primary)" />
          <h1 style={{ fontSize: '2.2rem' }}>Terms & Conditions</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Last Updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Acceptance of Terms</h3>
            <p>
              By accessing, browsing, or purchasing products on <strong>ShopEase</strong>, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must refrain from using the platform.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Account Registration & Security</h3>
            <p>
              When creating an account on ShopEase, you are responsible for maintaining the confidentiality of your credentials and restricting unauthorized access to your devices. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Product Descriptions & Pricing</h3>
            <p>
              We endeavor to display product images, specifications, and prices as accurately as possible. All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices and availability are subject to change without prior notice.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Order Placement & Confirmation</h3>
            <p>
              Placing an order constitutes an offer to purchase. ShopEase reserves the right to accept, limit, or decline orders in cases of stock depletion, inaccurate pricing information, or suspected fraudulent activity.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>5. Payments & Verification</h3>
            <p>
              All online payments are securely processed through authorized gateways (including Razorpay / Cashfree) with 256-bit encryption. Payment verification occurs automatically via server-to-server cryptographic signatures.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>6. Shipping & Delivery</h3>
            <p>
              Delivery timeframes, courier partners, and shipping costs are subject to delivery location and order volume. Please refer to our <Link to="/shipping-policy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Shipping Policy</Link> for detailed coverage and guidelines.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>7. Cancellations, Returns & Refunds</h3>
            <p>
              Eligible returns and refund requests are handled according to our standard <Link to="/refund-policy" style={{ color: 'var(--primary)', fontWeight: 600 }}>Return & Refund Policy</Link>. Returns must be initiated with intact tags, original packaging, and purchase invoice.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>8. Prohibited Misuse & Limitations</h3>
            <p>
              Users agree not to disrupt website operations, tamper with price fields, use malicious scripts, or reverse engineer any software components of ShopEase.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>9. Policy Updates & Modifications</h3>
            <p>
              ShopEase reserves the right to revise these terms at any time. Continued use of the website after modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Business & Support Contact</h4>
            <p style={{ fontSize: '0.9rem' }}>
              <strong>Store:</strong> ShopEase<br />
              <strong>Owner:</strong> Kishan Soni<br />
              <strong>Contact:</strong> <a href="tel:6267194039" style={{ color: 'var(--primary)', fontWeight: 600 }}>+91 6267194039</a><br />
              <strong>Address:</strong> Vijay Nagar, Indore, Madhya Pradesh – 452001
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
