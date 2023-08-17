import { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router';
import { IPasswordData } from '../../../data/types/auth';
import { PrimaryButton, PrimaryInput } from '../../Common';

interface IResetPassword {
    isError: boolean;
    isNewAdmin?: boolean;
    validationErrors?: IPasswordData;
    handleSubmit: () => void;
    handleOnChange: (e: ChangeEvent<HTMLInputElement>, key: string) => void;

    handleOnSave: () => void;
}

export const ResetPassword = ({
    isError,
    validationErrors,
    isNewAdmin,
    handleOnChange,
    handleSubmit,

    handleOnSave,
}: IResetPassword) => {
    const [passwordType, setPasswordType] = useState('password');
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const location = useLocation();
    const togglePassword = () => {
        if (passwordType === 'password') {
            setPasswordType('text');
            return;
        }
        setPasswordType('password');
    };
    const toggleConfirmPassword = () => {
        if (confirmPasswordType === 'password') {
            setConfirmPasswordType('text');
            return;
        }
        setConfirmPasswordType('password');
    };

    return (
        <div className="flex flex-col justify-center items-start w-[500px] mx-auto">
            <div className="flex items-center text-[32px] text-green-100 font-bold w-full">
                {isNewAdmin ? 'Create your Password' : 'New Password'}
            </div>
            <div className="text-[16px] font-normal">
                {isNewAdmin
                    ? 'Enter your password to complete the onboarding process.'
                    : 'Enter your new password to begin again.'}{' '}
            </div>
            <div className="flex flex-col w-[100%] pt-12">
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
                    iconOnClick={() => togglePassword()}
                />
                <div className="mb-1 text-sm font-medium text-red-200">
                    {validationErrors ? validationErrors?.password : ''}
                </div>
                <div>
                    <PrimaryInput
                        className={classNames(
                            'text-gray-400',
                            isError
                                ? 'bg-red-100 border-0 !text-red-200'
                                : 'text-gray-400 bg-gray-200'
                        )}
                        label="Confirm Password"
                        type={confirmPasswordType}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            handleOnChange(e, 'confirmPassword')
                        }
                        icon={
                            confirmPasswordType === 'password'
                                ? 'HIDDEN_PASSWORD'
                                : 'SHOW_PASSWORD'
                        }
                        iconPosition="right"
                        isError={isError}
                        iconOnClick={() => toggleConfirmPassword()}
                    />
                    <div className="mb-1 text-sm font-medium text-red-200">
                        {validationErrors
                            ? validationErrors?.confirmPassword
                            : ''}
                    </div>
                </div>
                <PrimaryButton
                    onClick={() =>
                        location?.pathname === '/create-new-password'
                            ? handleOnSave()
                            : handleSubmit()
                    }
                    type="button"
                    name="Submit"
                    color="#2E672F"
                    variant="filled"
                    className="hover:bg-[#2E672F] hover:border-green-600 focus:border-green-600 mt-10 w-full font-medium"
                />
            </div>
        </div>
    );
};

export default ResetPassword;
