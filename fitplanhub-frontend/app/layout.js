import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { theme } from '../lib/theme';

export const metadata = {
  title: 'FitPlanHub',
  description: 'Fitness plans and trainers platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: theme.colors.bgSecondary,
        color: theme.colors.textPrimary
      }}>
        <AuthProvider>
          <Navbar />
          <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '3rem 1rem 1rem 1rem' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
