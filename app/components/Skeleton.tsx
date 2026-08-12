export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="product-card" aria-hidden>
          <div className="product-placeholder" style={{ opacity: 0.4 }} />
          <div style={{ padding: '17px 4px' }}>
            <div style={{ height: 14, width: '70%', background: 'var(--line)', marginBottom: 8 }} />
            <div style={{ height: 10, width: '40%', background: 'var(--line)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="product-detail" aria-hidden>
      <div className="product-gallery" style={{ opacity: 0.4 }} />
      <div>
        <div style={{ height: 10, width: 100, background: 'var(--line)', marginBottom: 16 }} />
        <div style={{ height: 34, width: '80%', background: 'var(--line)', marginBottom: 16 }} />
        <div style={{ height: 14, width: '30%', background: 'var(--line)', marginBottom: 26 }} />
        <div style={{ height: 60, width: '100%', background: 'var(--line)' }} />
      </div>
    </div>
  );
}
