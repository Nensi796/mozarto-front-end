import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import OtpInput from 'react-otp-input';
import { loginLogo } from '../../assets';
import { ResetPassword } from '../../components/AuthComponent';
import { ICreateNewPasswordReq, IVerifyOTP } from '../../data/types/request';
import { createNewPassword, verifyOtp } from '../../services/api/api';
import { IPasswordData } from '../../data/types/auth';
import { showToast } from '../../data/utils/toast';
import { validate } from '../../data/utils/common';
import AuthenticationModal from '../../components/Modal/AuthenticationModal';
import { AppActionsEnum } from '../../context/Auth/AuthContextValues';
import { useAuthContext } from '../../context/Auth/AuthContext';
import { PrimaryButton } from '../../components/Common';

const NewAdminPassword = () => {
    const navigate = useNavigate();
    const [isError, setIsError] = useState<boolean>(false);
    const [passwordValue, setPasswordValue] = useState<IPasswordData | null>();
    const [validationErrors, setValidationError] = useState<
        Partial<IPasswordData>
    >({});
    const [open, setOpen] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>('');
    const { dispatch } = useAuthContext();
    const [otpError, setOtpError] = useState<string>('');
    const [qrCode, setQrCode] = useState('');
    const digitLeftCount = 6 - otp.length;

    const verifyUser = JSON.parse(localStorage.getItem('user') as string);

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
        } else {
            setValidationError({});
            setIsError(false);
        }
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
    useEffect(() => localStorage.removeItem('token'), []);
    const handleOnSave = () => {
        if (!passwordValue) return;
        const payload: ICreateNewPasswordReq = {
            email: verifyUser.email,
            password: passwordValue.password,
        };
        createNewPassword(payload)
            .then((result) => {
                setQrCode(result?.qr);
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', result?.token);
                showToast('Your password created successfully', 'success');
                setOpen(true);
            })
            .catch((err) => {
                showToast(
                    err || 'Your password not created successfully',
                    'success'
                );
            });
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
                // localStorage.setItem('token', result.token || token);
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
            {qrCode ? (
                <div className="flex flex-col justify-center items-center mx-auto w-[500px]">
                    <img src={qrCode} alt="code" height="50%" />
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
                <div className="mx-14 flex w-1/2">
                    <ResetPassword
                        isNewAdmin
                        handleSubmit={handleSubmit}
                        isError={isError}
                        handleOnChange={handleOnChange}
                        validationErrors={validationErrors as IPasswordData}
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
            )}
        </div>
    );
};

export default NewAdminPassword;
