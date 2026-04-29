export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-uw-purple text-white px-4 py-3 shadow-md">
        <div className="max-w-5xl mx-auto">
          <span className="font-semibold text-base tracking-tight">GIX Events</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
