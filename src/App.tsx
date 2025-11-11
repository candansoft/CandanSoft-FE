import { AuthenticationProvider } from './contexts/authentication/AuthenticationContext';
import AppRouter from './AppRouter';
import { NotificationProvider } from './contexts/notification/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <AuthenticationProvider>
        <AppRouter />
      </AuthenticationProvider>
    </NotificationProvider>
  );
}

export default App;
