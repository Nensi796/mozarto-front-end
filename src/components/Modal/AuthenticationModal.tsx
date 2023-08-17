import { Dispatch, SetStateAction } from 'react';
import OtpInput from 'react-otp-input';
import classNames from 'classnames';
import { Modal, PrimaryButton } from '../Common';
import SvgIcon from '../Common/Icon/SvgIcon';

interface IModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;

    handleVerifyOTP: () => void;
    otp: string;
    setOtp: Dispatch<SetStateAction<string>>;
    otpError: string;
}

const AuthenticationModal = ({
    setIsOpen,
    handleVerifyOTP,
    setOtp,
    otp,
    otpError,
}: IModalProps) => {
    const digitLeft = 6 - otp.length;

    return (
        <Modal title={<SvgIcon icon="GOOGLE_LOGO" />} setIsOpen={setIsOpen}>
            <div className="p-2 pt-0">
                <div className="flex justify-center font-extrabold text-green-700 text-xl mt-1">
                    Two-Factor Authentication - A Breeze!
                </div>
                <div className="flex items-start text-sm font-extrabold justify-center">
                    Enter 6-digit code from your two factor authentication APP.
                </div>
                <div className="flex flex-col mt-8">
                    <OtpInput
                        value={otp}
                        // inputType="number"
                        onChange={(value: string) => setOtp(value)}
                        numInputs={6}
                        renderSeparator={
                            <span style={{ marginLeft: '13px' }} />
                        }
                        renderInput={(props) => (
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
                                    ? '2px solid #9ED79F'
                                    : 'none',
                            borderRadius: 15,
                            fontSize: '30px',
                            fontWeight: 500,
                            boxShadow: otp
                                ? '0 2px 2px 0 #9ED79F, 0 4px 4px 0 #9ED79F'
                                : '',
                        }}
                    />
                    {otpError && otp.length < 6 && (
                        <div className="flex justify-center text-sm text-red-500 mt-1">
                            {otpError}
                        </div>
                    )}
                </div>

                <PrimaryButton
                    onClick={() => handleVerifyOTP()}
                    type="button"
                    name={
                        digitLeft === 0
                            ? `Let's go`
                            : `${digitLeft} Digits Left`
                    }
                    color="#2E672F"
                    variant="filled"
                    className={classNames(
                        'flex justify-center items-center w-full h-10 rounded-xl  text-base font-bold mt-10',
                        digitLeft !== 0
                            ? '!bg-zinc-300 !text-gray-400'
                            : 'bg-green-700 text-white'
                    )}
                />
                <div className="flex justify-center items-center text-[12px] mt-6 mb-3">
                    Ned help? We can help
                    <a className="font-bold text-green-600 pl-1 hover:text-green-600">
                        Contact us
                    </a>
                </div>
            </div>
        </Modal>
    );
};
export default AuthenticationModal;
