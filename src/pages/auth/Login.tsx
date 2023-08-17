import { loginLogo } from '../../assets';
import { LoginForm } from '../../components/AuthComponent';

const Login = () => (
    <div className="flex w-[100vw] h-[100vh]">
        <div className="flex w-1/2 bg-amber-100">
            <img
                src={loginLogo}
                className="loginLogo"
                alt="logo"
                width="100%"
                height="100%"
            />
        </div>
        <div className="mx-14 flex w-1/2">
            <LoginForm />
        </div>
    </div>
);

export default Login;
