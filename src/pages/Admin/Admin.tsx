import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { Layout } from '../../components/Common';
import User from '../../components/Admin/User/User';
import Groups from '../../components/Admin/Groups/Groups';
import Companies from '../../components/Admin/Companies/Companies';

const AdminPage = () => {
    const location = useLocation();

    const admin = useCallback(() => {
        switch (location.pathname) {
            case '/admin/existing-users':
                return <User />;
            case '/admin/groups':
                return <Groups />;
            case '/admin/companies':
                return <Companies />;
            default:
                return <User />;
        }
    }, [location.pathname]);

    return <Layout>{admin()}</Layout>;
};
export default AdminPage;
