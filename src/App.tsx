import { useEffect, useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { useAuthContext } from './context/Auth/AuthContext';
import { RoutePage } from './routes/routes';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const { auth } = useAuthContext();
    const [routes, setRoutes] = useState<JSX.Element>();

    useEffect(() => {
        setRoutes(RoutePage(auth?.isLoggedIn));
    }, [auth?.isLoggedIn, auth?.role]);

    return (
        <>
            <div>{routes}</div>
            <ToastContainer />
        </>
    );
};

export default App;
