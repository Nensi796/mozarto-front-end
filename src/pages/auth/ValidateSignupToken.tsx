import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { verifySignupToken } from '../../services/api/api';
import { IVerifySignupRes } from '../../data/types/response';
import { IVerifySignupTokenReq } from '../../data/types/request';
import { showToast } from '../../data/utils/toast';
import { Loader } from '../../components/Common';

const ValidateSignupToken = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    useEffect(() => {
        if (!token) return;
        const payload: IVerifySignupTokenReq = { token };
        verifySignupToken(payload)
            .then((result: IVerifySignupRes) => {
                localStorage.setItem('user', JSON.stringify(result.user));
                showToast(result.message, 'success');
                navigate('/create-new-password');
            })
            .catch((err) => {
                showToast(err.message, 'error');
            });
    }, [token]);

    return (
        <div className="flex justify-center items-center w-[100vw] h-[100vh]">
            {' '}
            <Loader />
        </div>
    );
};

export default ValidateSignupToken;
