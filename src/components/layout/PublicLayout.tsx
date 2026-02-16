import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
