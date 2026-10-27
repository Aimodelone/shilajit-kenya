/**
 * pages/admin/login.js
 * Admin login page — no AdminLayout, no public chrome.
 */
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { redirectIfLoggedIn } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

export default function AdminLogin() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [status,   setStatus]   = useState(null); // null | 'loading' | 'error-401' | 'error-429' | 'error-other'
  const [errMsg,   setErrMsg]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.replace('/admin');
        return;
      }
      if (res.status === 401) { setStatus('error-401'); return; }
      if (res.status === 429) { setStatus('error-429'); return; }
      const data = await res.json().catch(() => ({}));
      setErrMsg(data.error || `Unexpected error (${res.status})`);
      setStatus('error-other');
    } catch {
      setErrMsg('Network error — please try again.');
      setStatus('error-other');
    }
  }

  const sending = status === 'loading';

  return (
    <div className={s.loginWrap}>
      <Head>
        <title>Admin Login | Shilajit Kenya</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className={s.loginCard}>
        <h1 className={s.loginTitle}>Admin Login</h1>
        <p className={s.loginSub}>Shilajit Kenya — dashboard access</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className={s.loginField}>
            <label htmlFor="adm-email" className={s.loginLabel}>Email address</label>
            <input
              id="adm-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={s.loginInput}
              disabled={sending}
            />
          </div>
          <div className={s.loginField}>
            <label htmlFor="adm-password" className={s.loginLabel}>Password</label>
            <input
              id="adm-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={s.loginInput}
              disabled={sending}
            />
          </div>

          <button type="submit" className={s.loginBtn} disabled={sending}>
            {sending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {status === 'error-401' && (
          <p className={`${s.loginMsg} ${s.loginErr}`}>
            Invalid email or password.
          </p>
        )}
        {status === 'error-429' && (
          <p className={`${s.loginMsg} ${s.loginWarn}`}>
            Too many attempts — please wait a few minutes and try again.
          </p>
        )}
        {status === 'error-other' && errMsg && (
          <p className={`${s.loginMsg} ${s.loginErr}`}>{errMsg}</p>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return redirectIfLoggedIn(ctx);
}
