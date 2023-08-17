import { type IPagePermissions, type IBrandsPermissions } from '../common';

export interface ISignInUser {
    email: string;
    password: string;
}

export interface IVerifyOTP {
    code: string;
}

export interface ICreateNewPasswordReq {
    email: string;
    password: string;
}

export interface IVerifySignupTokenReq {
    token: string;
}

export interface IForgotPasswordReq {
    email: string;
}

export interface IResetPasswordReq {
    token: string;
    password: string;
}

export interface ICreateGroupReq {
    name: string;
    brandsPermissions: IBrandsPermissions;
    pageAreasPermissions: IPagePermissions;
}
