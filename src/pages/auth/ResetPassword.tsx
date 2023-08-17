import { ChangeEvent, useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginLogo } from '../../assets';
import { ResetPassword } from '../../components/AuthComponent';
import { resetPassword, verifyOtp } from '../../services/api/api';
import { IPasswordData } from '../../data/types/auth';
import { showToast } from '../../data/utils/toast';
import { validate } from '../../data/utils/common';
import AuthenticationModal from '../../components/Modal/AuthenticationModal';
import { IVerifyOTP } from '../../data/types/request';
import { AppActionsEnum } from '../../context/Auth/AuthContextValues';
import { useAuthContext } from '../../context/Auth/AuthContext';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { dispatch } = useAuthContext();
    const token = searchParams.get('token') || '';
    const [isError, setIsError] = useState<boolean>(false);
    // const [isPassword, setIsPassword] = useState<boolean>(false);
    const [passwordValue, setPasswordValue] = useState<IPasswordData | null>();
    const [validationErrors, setValidationError] = useState<
        | {
              [p: string]: string | number;
          }
        | IPasswordData
    >({});
    const [open, setOpen] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const [otpError, setOtpError] = useState<string>('');

    const handleSubmit = () => {
        const errors: { [p: string]: string | number } = {};
        const errorPayload: {
            [key: string]: string;
        } = {
            password: passwordValue?.password as string,
            confirmPassword: passwordValue?.confirmPassword as string,
        };

        Object.keys(errorPayload).forEach((key: string) => {
            const isErrors = validate(key, errorPayload[key]);
            if (isErrors?.length) {
                errors[key] = isErrors;
            }
        });

        if (Object.keys(errors)?.length) {
            setValidationError(errors);
            setIsError(true);
            // setIsPassword(false);
        }
        if (
            passwordValue &&
            passwordValue.password !== passwordValue.confirmPassword
        ) {
            setValidationError({
                confirmPassword: 'Confirm password is not matched',
            });
        } else {
            setValidationError({});
            setIsError(false);

            const payload = {
                token,
                password: passwordValue?.password || '',
            };
            resetPassword(payload)
                .then((result) => {
                    if (result.isSuccess) {
                        // setIsPassword(true);
                        localStorage.setItem('token', token);
                        setOpen(true);
                        showToast(
                            result.message,
                            result.isSuccess ? 'success' : 'error'
                        );
                    }
                })
                .catch((err) => {
                    showToast(err.message, 'error');
                });
        }
    };

    const handleOnSave = () => {
        setOpen(true);
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
                console.log('result', result);
                localStorage.setItem('token', result.token || token);
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

    const handleOnChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, key: string) => {
            if (!key) return;
            setPasswordValue((prevLoginData) => ({
                ...(prevLoginData as IPasswordData),
                [key]: e.target.value,
            }));
        },
        []
    );

    return (
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
                <ResetPassword
                    handleSubmit={handleSubmit}
                    isError={isError}
                    handleOnChange={handleOnChange}
                    validationErrors={validationErrors as IPasswordData}
                    // isPassword={isPassword}
                    handleOnSave={handleOnSave}
                />
                {open && (
                    <AuthenticationModal
                        setIsOpen={setOpen}
                        handleVerifyOTP={onOTPVerify}
                        setOtp={setOtp}
                        otp={otp}
                        otpError={otpError}
                    />
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
