import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import OtpInput from 'react-otp-input';
import { PrimaryButton, PrimaryInput } from '../../Common';
import { LoginFormData } from '../../../data/types/auth';
import { signIn, verifyOtp } from '../../../services/api/api';
import { showToast } from '../../../data/utils/toast';
import { IVerifyOTP } from '../../../data/types/request';
import { validate } from '../../../data/utils/common';
import AuthenticationModal from '../../Modal/AuthenticationModal';
import { AppActionsEnum } from '../../../context/Auth/AuthContextValues';
import { useAuthContext } from '../../../context/Auth/AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const { dispatch } = useAuthContext();
    const [loginData, setLoginData] = useState<LoginFormData | null>();
    const [validationErrors, setValidationError] = useState<{
        [p: string]: string | number;
    }>({});
    const [isError, setIsError] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [otpError, setOtpError] = useState<string>('');
    const [passwordType, setPasswordType] = useState('password');

    const digitLeftCount = 6 - otp.length;

    const togglePassword = () => {
        if (passwordType === 'password') {
            setPasswordType('text');
            return;
        }
        setPasswordType('password');
    };

    const handleOnChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, key: string) => {
            if (!key) return;
            setLoginData((prevLoginData) => ({
                ...(prevLoginData as LoginFormData),
                [key]: e.target.value,
            }));
        },
        []
    );

    const handleLogin = () => {
        const errors: { [p: string]: string | number } = {};
        const payload: {
            [key: string]: string;
        } = {
            email: loginData?.email as string,
            password: loginData?.password as string,
        };

        Object.keys(payload).forEach((key: string) => {
            const isErrors = validate(key, payload[key]);
            if (isErrors?.length) {
                errors[key] = isErrors;
            }
        });

        if (Object.keys(errors)?.length) {
            setValidationError(errors);
            setIsError(true);
        } else {
            setValidationError({});
            setIsError(false);
        }

        if (loginData && loginData.email && loginData.password) {
            signIn(loginData)
                .then((result) => {
                    localStorage.setItem('token', result.token);
                    // For First time login
                    setQrCode(result?.qr as string);
                    setOpen(true);
                    showToast('Successfully', 'success');
                })
                .catch((err) => {
                    showToast(
                        err?.errors?.[0]?.message || 'something went wrong',
                        'error'
                    );
                });
        }
    };

    const onOTPVerify = () => {
        if (!otp) {
            setOtpError('Please Enter your OTP');
            return;
        }
        if (otp.length < 6) {
            setOtpError('Enter 6 digit OTP');
            return;
        }
        const payload: IVerifyOTP = { code: otp };

        verifyOtp(payload)
            .then((result) => {
                localStorage.setItem('token', result?.token);
                if (result?.qr) {
                    setQrCode(result?.qr);
                } else {
                    setQrCode('');
                }
                dispatch({
                    type: AppActionsEnum.SET_CURRENT_USER,
                    payload: {
                        authUser: result.user,
                        isLoggedIn: true,
                        role: result.user?.role,
                    },
                });
                setOtpError('');
                showToast('successfully verified', 'success');
                setOpen(false);
                navigate('/dashboard');
            })
            .catch((err) => {
                showToast(err.message, 'error');
            });
    };

    return (
        <div className="flex flex-col justify-center items-start mx-auto w-[500px]">
            {qrCode ? (
                <div>
                    <img src={qrCode} alt="code" height="60%" />
                    <OtpInput
                        value={otp}
                        onChange={(value: string) => setOtp(value)}
                        numInputs={6}
                        renderSeparator={
                            <span style={{ marginLeft: '13px' }} />
                        }
                        renderInput={(props: any) => (
                            <input id="inputOtp" {...props} />
                        )}
                        inputStyle={{
                            width: '53px',
                            height: '55px',
                            color: 'text-green-600',
                            background: '#F7F7F7',
                            border:
                                otpError && otp.length < 6
                                    ? '1px solid red'
                                    : otp
                                    ? '2px solid green'
                                    : 'none',
                            borderRadius: 15,
                            fontSize: '30px',
                            fontWeight: 500,
                        }}
                    />
                    <PrimaryButton
                        onClick={onOTPVerify}
                        type="button"
                        name={
                            digitLeftCount === 0
                                ? `Let's go`
                                : `${digitLeftCount} Digits Left`
                        }
                        color="#2E672F"
                        variant="filled"
                        className={classNames(
                            'ml-5 mt-5 flex justify-center items-center w-[88%] h-10 rounded-xl bg-zinc-300 text-base font-bold text-gray-400',
                            {
                                'bg-green-700 text-white': digitLeftCount === 0,
                            }
                        )}
                    />
                </div>
            ) : (
                <>
                    <div className="flex items-center text-[32px] text-green-100 font-extrabold w-full">
                        Unlock the Possibilities of Your Business with Mozarto!
                    </div>
                    <div className="text-[16px] font-normal">
                        Enter your credentials below to get started
                    </div>
                    <div className="flex flex-col w-[100%] pt-12">
                        <div>
                            <PrimaryInput
                                className={classNames(
                                    'text-gray-400',
                                    isError
                                        ? 'bg-red-100 border-0 !text-red-200'
                                        : 'text-gray-400 bg-gray-200'
                                )}
                                label="Email address"
                                type="email"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleOnChange(e, 'email')
                                }
                                isError={isError}
                            />
                            <div className="mb-1 text-sm font-medium text-red-200">
                                {validationErrors
                                    ? validationErrors?.email
                                    : ''}
                            </div>
                        </div>

                        <div className="mt-2">
                            <PrimaryInput
                                className={classNames(
                                    'text-gray-400',
                                    isError
                                        ? 'bg-red-100 border-0 !text-red-200'
                                        : 'text-gray-400 bg-gray-200'
                                )}
                                label="Password"
                                type={passwordType}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    handleOnChange(e, 'password')
                                }
                                icon={
                                    passwordType === 'password'
                                        ? 'HIDDEN_PASSWORD'
                                        : 'SHOW_PASSWORD'
                                }
                                iconPosition="right"
                                isError={isError}
                                iconOnClick={togglePassword}
                            />
                            <div className="mb-1 text-sm font-medium text-red-200">
                                {validationErrors
                                    ? validationErrors?.password
                                    : ''}
                            </div>
                        </div>
                        <div className="flex justify-end items-center text-[12px] mt-0">
                            Forgot password{' '}
                            <Link
                                to="/forgot-password"
                                className="border-b-0 pl-1 font-bold text-green-200"
                            >
                                Request here
                            </Link>
                        </div>

                        <PrimaryButton
                            onClick={handleLogin}
                            type="button"
                            name="Submit"
                            color="#2E672F"
                            variant="filled"
                            className="hover:bg-[#2E672F] hover:border-green-600 focus:border-green-600 mt-10 w-full font-medium"
                        />
                        <div className="flex justify-start items-center text-[12px]">
                            Don’t have an account?{' '}
                            <a className="pl-1 font-bold text-green-200">
                                Contact us
                            </a>
                        </div>
                    </div>
                    {open && (
                        <AuthenticationModal
                            setIsOpen={setOpen}
                            handleVerifyOTP={onOTPVerify}
                            setOtp={setOtp}
                            otp={otp}
                            otpError={otpError}
                        />
                    )}
                </>
            )}
        </div>
    );
};
export default LoginForm;
