import { Sidenav } from '@/components/ui/sidenav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidenav />
      <div className="flex-1 overflow-auto bg-gray-50">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 