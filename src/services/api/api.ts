import axios from './axios';
import {
    ISignInUser,
    IVerifyOTP,
    ICreateNewPasswordReq,
    IForgotPasswordReq,
    IVerifySignupTokenReq,
    IResetPasswordReq,
    ICreateGroupReq,
} from '../../data/types/request';
import {
    ICreateGroupData,
    ICreateNewPasswordRes,
    IForgotPasswordRes,
    IGetAllGroups,
    IGetBrandData,
    IGetPageAreaData,
    IResetPasswordRes,
    ISignInRes,
    IValidateResetToken,
    IVerifySignupRes,
} from '../../data/types/response';

/** **************************
 *            Auth           *
 *************************** */
export const signIn = (requestObj: ISignInUser): Promise<ISignInRes> =>
    axios.post('/users/signin', requestObj);

export const getCurrentUser = (token: string): Promise<any> =>
    axios.get(`users/get-current-user`);

export const verifyOtp = (requestObj: IVerifyOTP): Promise<any> =>
    axios.post('users/verify-otp', requestObj);

export const verifySignupToken = (
    requestObj: IVerifySignupTokenReq
): Promise<IVerifySignupRes> =>
    axios.post('/users/verify-signup-token', requestObj);

export const forgotPassword = (
    requestObj: IForgotPasswordReq
): Promise<IForgotPasswordRes> =>
    axios.post('/users/forgot-password', requestObj);

export const verifyResetToken = (
    requestObj: IVerifySignupTokenReq
): Promise<IValidateResetToken> =>
    axios.post('/users/verify-reset-token', requestObj);

export const resetPassword = (
    requestObj: IResetPasswordReq
): Promise<IResetPasswordRes> =>
    axios.post('/users/reset-password', requestObj);

export const createNewPassword = (
    requestObj: ICreateNewPasswordReq
): Promise<ICreateNewPasswordRes> =>
    axios.post('/users/set-password', requestObj);

/** **************************
 *            Brands           *
 *************************** */

export const getAllBrands = (): Promise<IGetBrandData> =>
    axios.post('/brands/get');

/** **************************
 *            PageAreas           *
 *************************** */

export const getAllPageAreas = (): Promise<IGetPageAreaData> =>
    axios.get('/page-areas/get-all');

/** **************************
 *            Groups           *
 *************************** */

export const createGroup = (
    requestObj: ICreateGroupReq
): Promise<ICreateGroupData> => axios.post('/groups/create', requestObj);

export const getGroupData = (): Promise<IGetAllGroups> =>
    axios.get('/groups/get-all');
export const deleteGroup = (groupId: string): Promise<any> =>
    axios.delete(`/groups/delete/${groupId}`);
export const updateGroup = (groupId: string, requestObj: any): Promise<any> =>
    axios.put(`/groups/update/${groupId}`, requestObj);

/** **************************
 *            User           *
 *************************** */

export const inviteUser = (requestObj: any): Promise<any> =>
    axios.post('/users/invite-user', requestObj);

export const deleteUser = (requestObj: { userId: string }): Promise<any> =>
    axios.post('/users/delete', requestObj);
export const updateUser = (userId: string, requestObj: any): Promise<any> =>
    axios.put(`/users/update`, requestObj);

export const getUserByCompany = (requestObj: any): Promise<any> =>
    axios.post('/users/get-users-by-company', requestObj);

/** **************************
 *            Company           *
 *************************** */

export const createCompany = (requestObj: any): Promise<any> =>
    axios.post('/company/create', requestObj);

export const deleteCompany = (companyId: string): Promise<any> =>
    axios.delete(`/company/delete/${companyId}`);
export const updateCompany = (
    companyId: string,
    requestObj: any
): Promise<any> => axios.put(`/company/update/${companyId}`, requestObj);
export const getCompanies = (): Promise<any> => axios.get('/company/get');
/** **************************
 *            Permissions           *
 *************************** */
export const getPermissions = (permissionId: string): Promise<any> =>
    axios.get(`/permissions/get-by-id/${permissionId}`);
