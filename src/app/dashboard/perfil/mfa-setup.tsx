'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MfaSetup({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'scan' | 'recovery'>('idle');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [secret, setSecret] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const begin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/profile/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || 'No se pudo iniciar la configuración');
        return;
      }
      setPassword('');
      setSecret(result.secret);
      setQrDataUrl(result.qrDataUrl);
      setStep('scan');
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const response = await fetch('/api/profile/mfa/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || 'No se pudo activar el segundo factor');
        return;
      }
      setCode('');
      setSecret('');
      setQrDataUrl('');
      setRecoveryCodes(result.recoveryCodes);
      setStep('recovery');
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <section className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Segundo factor de acceso</h2>
      </div>
      <div className="p-6 space-y-4">
        {enabled && step !== 'recovery' ? (
          <p className="text-sm text-gray-700">
            Activo. Al iniciar sesión necesitarás el código de tu app autenticadora.
            Conserva tus códigos de recuperación en un lugar seguro.
          </p>
        ) : step === 'idle' ? (
          <>
            <p className="text-sm text-gray-700">
              Necesitas una app de códigos en tu celular, como Google Authenticator,
              Microsoft Authenticator o Contraseñas del iPhone. Confirma tu contraseña
              para vincularla con tu cuenta de EDM.
            </p>
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Si varias personas usan esta misma cuenta, no actives todavía el segundo
              factor. Sus sesiones actuales dejarán de funcionar y necesitarán un código
              de tu app para volver a entrar. Primero conviene darles cuentas individuales.
            </p>
            <form onSubmit={begin} className="space-y-3">
              <label htmlFor="mfa-password" className="block text-sm font-medium">Contraseña actual</label>
              <input
                id="mfa-password" type="password" autoComplete="current-password"
                value={password} onChange={(event) => setPassword(event.target.value)}
                required className="input w-full"
              />
              <button type="submit" disabled={busy} className="btn-accent">
                {busy ? 'Preparando...' : 'Configurar segundo factor'}
              </button>
            </form>
          </>
        ) : step === 'scan' ? (
          <>
            <p className="text-sm text-gray-700">
              En tu celular, abre la app de códigos, elige «Agregar cuenta» y luego
              «Escanear código QR». Apunta la cámara al QR de esta pantalla. La app
              mostrará EDM Comunicaciones y un código de seis dígitos: escríbelo abajo.
              Tienes 10 minutos para completar este paso.
            </p>
            {/* El QR contiene un secreto local; next/image no optimiza data URLs. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR para configurar la app autenticadora" width={220} height={220} />
            <p className="text-xs text-gray-600">
              Si ves esta página en el mismo celular o no puedes escanear el QR,
              elige «Ingresar clave manualmente» en la app y usa esta clave privada:
            </p>
            <code className="block break-all rounded bg-gray-100 p-3 text-sm select-all">{secret}</code>
            <form onSubmit={confirm} className="space-y-3">
              <label htmlFor="mfa-code" className="block text-sm font-medium">Código de la app</label>
              <input
                id="mfa-code" type="text" inputMode="numeric" autoComplete="one-time-code"
                pattern="[0-9]{6}" maxLength={6} required
                value={code} onChange={(event) => setCode(event.target.value)}
                className="input w-full"
              />
              <button type="submit" disabled={busy} className="btn-accent">
                {busy ? 'Verificando...' : 'Activar segundo factor'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="font-medium text-gray-900">Segundo factor activado</p>
            <p className="text-sm text-gray-700">
              Guarda estos códigos fuera de tu cuenta. Cada uno funciona una sola vez y
              no volveremos a mostrarlos.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 rounded bg-gray-100 p-4 font-mono text-sm select-all">
              {recoveryCodes.map((value) => <code key={value}>{value}</code>)}
            </div>
            <button type="button" onClick={signOut} className="btn-accent">
              Ya los guardé; volver a iniciar sesión
            </button>
          </>
        )}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
}
