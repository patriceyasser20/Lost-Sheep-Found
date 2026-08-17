'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabaseClient } from '../../lib/supabaseClient';
import VerseBlock from '../components/VerseBlock';

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

    try {
      // Check whether the email already exists
      const existsRes = await fetch('/api/check-existing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!existsRes.ok) {
        throw new Error('Unable to check this email address.');
      }

      const { exists } = await existsRes.json();

      if (exists) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }

      // Create Supabase account
      const { error: signupError } = await supabaseClient.auth.signUp({
        email: email.trim().toLowerCase(),
        password,

        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },

          emailRedirectTo: `${window.location.origin}/confirm`,
        },
      });

      if (signupError) {
        console.error('Supabase signup error:', signupError);

        setError(
          signupError.message || 'Unable to create your account.'
        );

        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      console.error('Signup error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main>
        <div className="mx-auto max-w-[420px] px-[30px] pt-[100px] text-center">
          <div className="mb-[18px] text-[22px] text-gold">
            ✦
          </div>

          <h2 className="mt-[30px] mb-4 font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">
            Check your inbox
          </h2>

          <p className="mb-[18px] text-[14.5px] leading-[1.85] text-brown-soft">
            We've sent a confirmation link to{' '}
            <strong>{email}</strong>.
          </p>

          <p className="text-[13px] leading-[1.8] text-brown-soft">
            Open the email and click the confirmation button
            to finish creating your account.
          </p>
        </div>

        <VerseBlock
          verse="The Lord bless you and keep you."
          reference="Numbers 6:24"
        />
      </main>
    );
  }

  return (
    <main>
      <div className="mx-auto max-w-[420px] px-[30px] pb-[80px] pt-[100px]">
        <p className="mb-[6px] text-center text-[10px] uppercase tracking-[.16em] text-gold">
          Join us
        </p>

        <h2 className="mt-[30px] mb-4 text-center font-display text-[clamp(30px,3.6vw,38px)] font-medium tracking-[-.03em]">
          Create an account
        </h2>

        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
            <div className="mb-[18px] flex flex-col gap-2">
              <label
                htmlFor="firstName"
                className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft"
              >
                First name
              </label>

              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold"
              />
            </div>

            <div className="mb-[18px] flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft"
              >
                Last name
              </label>

              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="mb-[18px] flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold"
            />
          </div>

          <div className="mb-[18px] flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[10.5px] uppercase tracking-[.12em] text-brown-soft"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="border border-line bg-cream px-[14px] py-[13px] text-sm outline-none focus:border-gold"
            />

            <p className="text-[11px] text-brown-soft">
              At least 8 characters.
            </p>
          </div>

          {error && (
            <div className="mb-4 border border-[#d9aaa0] bg-[#fff7f5] px-3 py-3 text-xs text-[#a14b3c]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[46px] w-full items-center justify-center border border-transparent bg-brown px-5 text-[11px] uppercase tracking-[.08em] text-cream transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-[18px] py-5 text-center text-xs text-brown-soft">
          Already have an account?{' '}
          <Link
            href="/login"
            className="border-b border-gold pb-[5px] text-xs uppercase tracking-[.08em]"
          >
            Sign in
          </Link>
        </p>
      </div>

      <VerseBlock
        verse="In all things God works for the good of those who love him."
        reference="Romans 8:28"
      />
    </main>
  );
}