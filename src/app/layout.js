import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'JobPulse AI',
  description: 'Track your job applications smartly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#e2e8f0',
                border: '1px solid #7c3aed',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}