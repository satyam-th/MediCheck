import {Toaster} from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext';
import AppRoute from './routes/AppRoute';
export default function App(){
  return(
    <AuthProvider>
    <Toaster position='top-center'
    toastOptions={{
          success: {
            duration: 5000,
            style: {
              background: '#fff',
              color: '#212121',
              border: '0.5px solid #D1D5DB',
              borderRadius: '8px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.9rem',
              padding: '12px 16px',
              boxShadow: 'none',
            },
            iconTheme: {
              primary: '#0057B8',
              secondary: '#fff',
            },
            }}}/>
    <AppRoute/>
    </AuthProvider>
  );
}