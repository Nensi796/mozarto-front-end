import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { IVerifySignupTokenReq } from '../../data/types/request';
import { verifyResetToken } from '../../services/api/api';
import { IValidateResetToken } from '../../data/types/response';
import { showToast } from '../../data/utils/toast';
import { Loader } from '../../components/Common';

const ValidateResetToken = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    useEffect(() => {
        if (!token) return;
        const payload: IVerifySignupTokenReq = { token };
        verifyResetToken(payload)
            .then((result: IValidateResetToken) => {
                if (result && result.isValid) {
                    showToast(result.message, 'success');
                    navigate(`/reset-password?token=${token}`);
                }
            })
            .catch((err) => {
                showToast(err.message, 'error');
            });
    }, []);

    return (
        <div className="flex justify-center items-center w-[100vw] h-[100vh]">
            {' '}
            <Loader />
        </div>
    );
};

export default ValidateResetToken;
