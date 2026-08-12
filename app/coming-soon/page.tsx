export default function ComingSoon() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="custom-symbol">✦</div>
        <h1 style={{ fontSize: 40, letterSpacing: '-.03em', marginBottom: 16 }}>Coming Soon</h1>
        <p style={{ color: 'var(--brown-soft)', maxWidth: 420, margin: 'auto' }}>
          We're putting the finishing touches on something beautiful. Check back shortly.
        </p>
      </div>
    </div>
  );
}
