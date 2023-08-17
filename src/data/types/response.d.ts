import { ICreateNewPasswordUser } from './backend';
import { GroupDetails, IGroup } from '../common';

export interface ICreateNewPasswordRes {
    status: string;
    message: string;
    token: string;
    isSuccess: boolean;
    qr: string;

    errors: any;
    user: ICreateNewPasswordUser;
}

export interface IVerifySignupRes {
    status: string;
    message: string;
    isValid: boolean;
    user: ICreateNewPasswordUser;
}

export interface IForgotPasswordRes {
    status: string;
    message: string;
    isSuccess: boolean;
    token: string;
}

export interface IValidateResetToken {
    status: string;
    message: string;
    isValid: boolean;
    isExpired: boolean;
}

export interface IResetPasswordRes {
    status: string;
    message: string;
    isSuccess: boolean;
    isValid: boolean;
}

export interface ISignInRes {
    isSuccess: boolean;
    successMessage?: string;
    token: string;
    qr?: string;
    errors: any;
}

export interface IGetBrandData {
    status: string;
    message: string;
    brands: IGetAllBrandData[];
}

export interface IGetPageAreaData {
    status: string;
    message: string;
    pageAreas: IGetAllPageAreasData[];
}

export interface IGetAllPageAreasData {
    _id: string;
    name: string;
    value: string;
}

export interface IGetAllBrandData {
    _id: string;
    name: string;
    description: string;
    companyId: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IGetAllGroups {
    message: string;
    status: string;
    groups: IGroup[];
}

export interface ICreateGroupData {
    status: string;
    message: string;
    isSuccess: boolean;
    groupDetails: GroupDetails;
}
