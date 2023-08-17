import './sidebar.css';
import SvgIcon from '../Common/Icon/SvgIcon';
import { Menubar, PrimaryButton, Switch } from '../Common';
import { type IMenuItem } from '../../data/common';

const menuItem: IMenuItem[] = [
    {
        id: 1,
        icon: 'DASHBOARD_ICON',
        path: '/dashboard',
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: 'PAYMENT_ICON',
        path: '/payment',
        title: 'Payments',
        subMenu: [
            {
                id: 1,
                title: 'Transactions',
                path: '/payment/transactions',
            },
            {
                id: 2,
                title: 'Approvals',
                path: '/payment/approvals',
            },
        ],
    },
    {
        id: 3,
        icon: 'CUSTOMERS_ICON',
        // path: '/customers',
        title: 'Customers',
        subMenu: [],
    },
    {
        id: 4,
        icon: 'REPORTS_ICON',
        path: '/reports',
        title: 'Reports',
    },

    {
        id: 5,
        icon: 'CASHIER_ICON',
        // path: '/cashier',
        title: 'Cashier',
    },
    {
        id: 4,
        icon: 'REPORTS_ICON',
        path: '/audit',
        title: 'Audit',
    },
    {
        id: 6,
        icon: 'ADMIN_ICON',
        path: '/admin',
        title: 'Admin',
        subMenu: [
            {
                id: 1,
                title: 'Users',
                path: '/admin/existing-users',
            },
            {
                id: 2,
                title: 'Companies',
                path: '/admin/companies',
            },
            {
                id: 3,
                title: 'Groups',
                path: '/admin/groups',
            },
        ],
    },

    {
        id: 7,
        icon: 'SUPPORT_ICON',
        path: '/support',
        title: 'Support',
        subMenu: [],
    },
    {
        id: 8,
        icon: 'DEVELOPERS_ICON',
        // path: '/developers',
        title: 'Developers',
        subMenu: [],
    },
    {
        id: 9,
        icon: 'PROFILE_ICON',
        // path: '/profiles',
        title: 'Profiles',
        subMenu: [],
    },
];

const SideBar = () => (
    <div className="w-64 h-full background-gradient max-h-[100vh] overflow-y-scroll">
        <div className="flex h-full flex-col justify-between">
            <div className="p-4">
                <SvgIcon icon="MOZARTO_ICON" />
                <div className="mt-4">
                    <Menubar menuItem={menuItem} />
                </div>

                <div className="mt-3 flex items-center justify-between">
                    <span className="ml-4 text-xs font-extrabold text-green-100">
                        Sandbox Mode
                    </span>
                    <Switch className="rounded-2xl bg-white" />
                </div>
            </div>
            <div className="p-6">
                <div className="flex flex-col items-center rounded-2xl bg-green-600 p-4 text-white">
                    <span className="text-base font-extrabold">
                        Need more help?
                    </span>
                    <span className="text-xs font-light">
                        24/7 support is available,
                    </span>
                    <span className="text-xs font-light">
                        {' '}
                        start a chat now
                    </span>
                    <PrimaryButton
                        onClick={() => console.log('send recovery Link')}
                        type="button"
                        name="Chat Now"
                        color="#8FB131"
                        variant="filled"
                        className="bg-[#8FB131] h-[40px] font-extrabold hover:bg-[#2E672F] hover:border-green-600 focus:border-green-100 rounded-xl w-full mt-5"
                    />
                </div>
            </div>
        </div>
    </div>
);

export default SideBar;
