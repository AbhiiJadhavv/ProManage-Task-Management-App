import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Form from './pages/Form';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { UserProvider, useUser } from './UserContext';
import SharedTask from './pages/SharedTask';

function AppRouter() {
  const { user, setUser } = useUser();

  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard user={user} />,
    },
    {
      path: '/form',
      element: <Form setUser={setUser} />,
    },
    {
      path: '/sharedtask/:taskId',
      element: <SharedTask />,
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]);

  return <RouterProvider router={appRouter} />;
}

function App() {
  return (
    <UserProvider>
      <ToastContainer />
      <AppRouter />
    </UserProvider>
  );
}

export default App;
