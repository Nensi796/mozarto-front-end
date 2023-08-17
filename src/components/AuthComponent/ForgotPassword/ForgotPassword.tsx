import { ChangeEvent, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Success from '../../../assets/images/Success.svg';
import { forgotPassword } from '../../../services/api/api';
import { IForgotPasswordRes } from '../../../data/types/response';
import { IForgotPasswordReq } from '../../../data/types/request';
import { showToast } from '../../../data/utils/toast';
import { PrimaryButton, PrimaryInput } from '../../Common';
import { validate } from '../../../data/utils/common';

const ForgotPassword = () => {
    const [isForgotPasswordData, setIsForgotPasswordData] =
        useState<IForgotPasswordReq | null>();
    const [isError, setIsError] = useState<boolean>(false);
    const [isRecoveryLink, setIsRecoveryLink] = useState(false);
    const [validationErrors, setValidationError] = useState<{
        [p: string]: string | number;
    }>({});

    const handleOnChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, key: string) => {
            if (!key) return;
            setIsForgotPasswordData((prevLoginData) => ({
                ...(prevLoginData as IForgotPasswordReq),
                [key]: e.target.value,
            }));
        },
        []
    );

    const handleOnSend = () => {
        const errors: { [p: string]: string | number } = {};
        const payload: {
            [key: string]: string;
        } = {
            email: isForgotPasswordData?.email as string,
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
            setIsRecoveryLink(false);
        } else if (isForgotPasswordData && isForgotPasswordData.email) {
            setValidationError({});
            setIsError(false);
            forgotPassword(isForgotPasswordData)
                .then((result: IForgotPasswordRes) => {
                    showToast(result.message, 'success');
                    setIsRecoveryLink(true);
                })
                .catch((err: any) => {
                    setIsRecoveryLink(false);
                    console.log(err);
                    showToast(err.message, 'error');
                });
        }
    };

    const handleOnSubmit = () => {
        if (isForgotPasswordData && isForgotPasswordData.email) {
            forgotPassword(isForgotPasswordData)
                .then((result: IForgotPasswordRes) => {
                    showToast(result.message, 'success');
                })
                .catch((err: any) => {
                    setIsRecoveryLink(false);
                    showToast(err.message, 'error');
                });
        }
    };

    return isRecoveryLink ? (
        <div className="flex flex-col justify-center items-center mx-auto w-[320px]">
            <img
                src={Success}
                className="loginLogo"
                alt="logo"
                width="100px"
                height="100px"
            />
            <div className="flex items-center text-[32px] text-green-100 font-bold w-full">
                Recovery email sent
            </div>
            <div className="text-sm font-base">
                A recovery link has been sent to
            </div>
            <Link to="/" className="text-sm font-medium	text-green-100">
                {`${isForgotPasswordData?.email as string}`}
            </Link>
            <div className="text-sm font-base">
                {' '}
                Please follow the link and reset your password
            </div>

            <PrimaryButton
                onClick={() => handleOnSubmit()}
                type="button"
                name="Send recovery email again"
                color="#2E672F"
                variant="filled"
                className="mt-10 w-full p-1 font-medium"
            />
        </div>
    ) : (
        <div className="flex flex-col justify-center items-start w-[500px] mx-auto">
            <div className="flex items-center text-[32px] text-green-100 font-bold w-full">
                Forgot Password{' '}
            </div>
            <div className="text-[16px] font-medium w-full">
                Don't fret! We understand forgetting passwords happens
                occasionally. Enter your email address and we'll send you a link
                to recover your password.{' '}
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
                        {validationErrors ? validationErrors?.email : ''}
                    </div>
                </div>

                <PrimaryButton
                    onClick={handleOnSend}
                    type="button"
                    name="Send recovery link"
                    color="#2E672F"
                    variant="filled"
                    className="mt-6 w-full p-1 font-medium"
                />

                <div className="flex justify-start items-center text-[12px] mt-1">
                    Don’t have an account?{' '}
                    <Link to="/" className="pl-1 font-bold text-green-600">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
