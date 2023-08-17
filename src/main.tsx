import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { AuthContextProvider } from './context/Auth/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </BrowserRouter>
);
