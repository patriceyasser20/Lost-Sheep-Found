'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../../lib/supabaseClient';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for an existing account first so we don't silently re-send a
    // confirmation to someone who already registered.
    const existsRes = await fetch('/api/check-existing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const { exists } = await existsRes.json();
    if (exists) {
      setError('An account with this email already exists.');
      setLoading(false);
      return;
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="content-page" style={{ maxWidth: 420, paddingTop: 100, textAlign: 'center' }}>
        <div className="custom-symbol">✦</div>
        <h2>Check your inbox</h2>
        <p>We've sent a confirmation link to {email}.</p>
      </main>
    );
  }

  return (
    <main className="content-page" style={{ maxWidth: 420, paddingTop: 100 }}>
      <p className="eyebrow" style={{ textAlign: 'center' }}>Join us</p>
      <h2 style={{ textAlign: 'center' }}>Create an account</h2>

      <form onSubmit={handleSignup}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        </div>
        {error && <p className="form-note" style={{ color: '#a14b3c' }}>{error}</p>}
        <button type="submit" className="button button-dark button-block" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="form-note" style={{ textAlign: 'center', marginTop: 18 }}>
        Already have an account? <Link href="/login" className="text-link">Sign in</Link>
      </p>
    </main>
  );
}
