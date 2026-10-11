import React from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, CreditCard, Phone } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="container" style={{ marginTop: '2.5rem', maxWidth: '860px' }}>
      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <RefreshCw size={28} color="var(--primary)" />
          <h1 style={{ fontSize: '2.2rem' }}>Return & Refund Policy</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Effective: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Return Eligibility</h3>
            <p>
              We want you to be completely satisfied with your purchase. To be eligible for a return:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>The item must be unused, unwashed, and in the same pristine condition as received.</li>
              <li>The item must be in its original brand packaging with all tags and labels intact.</li>
              <li>Proof of purchase (Order receipt or Order ID) must be provided.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Return Request Window</h3>
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '0.75rem 0', fontSize: '0.9rem' }}>
              <p>
                <em>[Configurable Business Notice: Return requests should be initiated within the store's designated return window (e.g. 7 days from delivery date) by contacting our customer support team.]</em>
              </p>
            </div>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Inspection & Approval Process</h3>
            <p>
              Once your return package is received at our facility, our quality team inspects the items. You will receive notification regarding the approval or rejection of your refund.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Refund Processing & Mode</h3>
            <p>
              Approved refunds are credited back to the original method of payment (via Razorpay / Cashfree) or via direct bank transfer depending on the original transaction method.
            </p>
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '0.75rem 0', fontSize: '0.9rem' }}>
              <p>
                <em>[Configurable Business Notice: Online gateway refunds typically reflect in customer bank accounts within 5 to 7 business days following approval, subject to respective banking clearing cycles.]</em>
              </p>
            </div>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>5. Non-Returnable Items</h3>
            <p>
              For hygiene and safety reasons, certain personal accessories, customized items, and clearance sale products may be marked as non-returnable on product detail pages.
            </p>
          </section>

          <section style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Returns & Help Desk</h4>
            <p style={{ fontSize: '0.9rem' }}>
              To initiate a return or check refund status:<br />
              <strong>ShopEase</strong> | Kishan Soni<br />
              <strong>Helpline:</strong> <a href="tel:6267194039" style={{ color: 'var(--primary)', fontWeight: 600 }}>+91 6267194039</a><br />
              <strong>Address:</strong> Vijay Nagar, Indore, Madhya Pradesh – 452001
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
