import React from 'react';
import { Truck, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';

const ShippingPolicy = () => {
  return (
    <div className="container" style={{ marginTop: '2.5rem', maxWidth: '860px' }}>
      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Truck size={28} color="var(--primary)" />
          <h1 style={{ fontSize: '2.2rem' }}>Shipping Policy</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Effective: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Order Processing & Dispatch</h3>
            <p>
              Orders placed on ShopEase are processed and dispatched within standard working days (Monday to Saturday, excluding public holidays). Once your payment is verified, our fulfillment team prepares your items for courier handover.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Delivery Timelines & Estimates</h3>
            <p>
              Estimated delivery times depend on your geographical location and pin code.
            </p>
            <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', margin: '0.75rem 0', fontSize: '0.9rem' }}>
              <p>
                <em>[Configurable Business Notice: Standard delivery generally takes 3 to 7 business days depending on destination pin code across India. Exact delivery commitments are confirmed upon dispatch with courier tracking numbers.]</em>
              </p>
            </div>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Shipping Charges</h3>
            <p>
              Shipping rates and free-shipping eligibility thresholds are calculated and transparently displayed at checkout prior to final payment confirmation.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Order Tracking</h3>
            <p>
              Once your order has shipped, you can track fulfillment status in real-time under the <a href="/orders" style={{ color: 'var(--primary)', fontWeight: 600 }}>My Orders</a> tab or reach out to our customer support.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>5. Damaged or Delayed Packages</h3>
            <p>
              If your package arrives visibly damaged or tampered with, please do not accept delivery and immediately notify us with photos. We will coordinate with the courier for an expedited replacement.
            </p>
          </section>

          <section style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Shipping Inquiries & Dispatch Center</h4>
            <p style={{ fontSize: '0.9rem' }}>
              <strong>ShopEase</strong> | Kishan Soni<br />
              <strong>Contact Phone:</strong> <a href="tel:6267194039" style={{ color: 'var(--primary)', fontWeight: 600 }}>+91 6267194039</a><br />
              <strong>Dispatch Address:</strong> Vijay Nagar, Indore, Madhya Pradesh – 452001
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
