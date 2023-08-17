import { loginLogo } from '../../assets';
import { ForgotPassword } from '../../components/AuthComponent';

const ResetPasswordPage = () => (
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
            <ForgotPassword />
        </div>
    </div>
);

export default ResetPasswordPage;
