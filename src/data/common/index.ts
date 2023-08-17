import { ReactElement } from 'react';
import { UserRoles } from '../constants/auth.constants';

export interface IIcons {
    NOTIFICATION: ReactElement;
    SHOW_PASSWORD: ReactElement;
    HIDDEN_PASSWORD: ReactElement;
    CLOSE_BUTTON: ReactElement;
    AUDIT_ICON: ReactElement;
    ADMIN_ICON: ReactElement;
    CASHIER_ICON: ReactElement;
    CUSTOMERS_ICON: ReactElement;
    DEVELOPERS_ICON: ReactElement;
    MOZARTO_ICON: ReactElement;
    PAYMENT_ICON: ReactElement;
    PROFILE_ICON: ReactElement;
    REPORTS_ICON: ReactElement;
    DASHBOARD_ICON: ReactElement;
    SUPPORT_ICON: ReactElement;
    ARROW_DOWN: ReactElement;
    ARROW_UP: ReactElement;
    SEARCH_ICON: ReactElement;
    CLOCK_ICON: ReactElement;
    SORT_ICON: ReactElement;
    EDIT_ICON: ReactElement;
    DELETE_ICON: ReactElement;
    GOOGLE_LOGO: ReactElement;
    SUCCESS_LOGO: ReactElement;
}

export interface ICreateUserData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isCustomGroup: boolean;
    group: string;
    permissionId: string;
    company: string;
    updatedBy: string;
    createdBy: string;
    updatedAt: string;
    createdAt?: string;
    role: string;
    job: string;
}

export interface IOptionProps {
    key: string;
    title: string;
}
export interface IBrandsPermissions {
    brandId: string;
    isRead: boolean;
    isWrite: boolean;
    _id?: string;
}
export interface IPagePermissions {
    pageAccessId: string;
    isRead: boolean;
    isWrite: boolean;
}
export interface IPermission {
    _id: string;
    pageAreasPermissions: IPagePermissions[];
    brandsPermissions: IBrandsPermissions[];
    createdAt: string;
    updatedAt: string;
    __v?: number;
}
export interface IPermissionData {
    status: string;
    message: string;
    permission: IPermission;
}
export interface GroupDetails {
    name: string;
    permissionId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IGroup {
    _id: string;
    name: string;
    isDeleted: boolean;
    permissionId: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
    permission: IPermission;
}

export interface ICompanyData {
    _id: string;
    name: string;
    brands: string[];
    description: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface IMenuItem {
    icon: keyof IIcons;
    path?: string;
    title: string;
    subMenu?: any[];
    id: number;
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    role: UserRoles;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}
