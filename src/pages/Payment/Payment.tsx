import { useCallback } from 'react';
import { useLocation } from 'react-router';
import PaymentTransactions from '../../components/Payment/Transactions';
import { Layout } from '../../components/Common';

import PaymentApprovals from '../../components/Payment/Approvals';

const Payment = () => {
    const location = useLocation();
    const payment = useCallback(() => {
        switch (location.pathname) {
            case '/payment/transactions':
                return <PaymentTransactions />;
            case '/payment/approvals':
                return <PaymentApprovals />;

            default:
                return <PaymentTransactions />;
        }
    }, [location.pathname]);
    return <Layout>{payment()}</Layout>;
};
export default Payment;
