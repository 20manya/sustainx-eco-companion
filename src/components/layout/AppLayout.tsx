import { BottomNav } from './BottomNav';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background gradient-nature">
      <main className="pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
