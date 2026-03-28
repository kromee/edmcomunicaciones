/** Rutas que usan cookies (sesión) no deben pre-renderizarse en build. */
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
