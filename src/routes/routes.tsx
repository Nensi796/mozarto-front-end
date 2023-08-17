import { Route, Routes } from 'react-router-dom';
import Companies from '../components/Admin/Companies/Companies';
import Groups from '../components/Admin/Groups/Groups';
import User from '../components/Admin/User/User';
import PaymentApprovals from '../components/Payment/Approvals';
import PaymentTransactions from '../components/Payment/Transactions';
import Admin from '../pages/Admin/Admin';
import Audit from '../pages/Audit/Audit';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import Login from '../pages/auth/Login';
import NewAdminPassword from '../pages/auth/NewAdminPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import ValidateResetToken from '../pages/auth/ValidateResetToken';
import ValidateSignupToken from '../pages/auth/ValidateSignupToken';
import Dashboard from '../pages/Dashboard/Dashboard';

import Payment from '../pages/Payment/Payment';

export const RoutePage = (isUserLoggedIn: boolean | null) => (
    <Routes>
        {isUserLoggedIn && <Route path="/dashboard" element={<Dashboard />} />}
        {isUserLoggedIn && (
            <Route path="/admin" element={<Admin />}>
                <Route path="/admin/existing-users" element={<User />} />
                <Route path="/admin/companies" element={<Companies />} />
                <Route path="/admin/groups" element={<Groups />} />
            </Route>
        )}
        {isUserLoggedIn && (
            <Route path="/payment" element={<Payment />}>
                <Route
                    path="/payment/transactions"
                    element={<PaymentTransactions />}
                />
                <Route
                    path="/payment/approvals"
                    element={<PaymentApprovals />}
                />
            </Route>
        )}
        {isUserLoggedIn && <Route path="/audit" element={<Audit />} />}
        <Route path="/login" element={<Login />} />{' '}
        <Route path="/" element={<Login />} />
        <Route
            path="/validate-signup-token"
            element={<ValidateSignupToken />}
        />
        <Route path="/validate-reset-token" element={<ValidateResetToken />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/create-new-password" element={<NewAdminPassword />} />
    </Routes>
);
