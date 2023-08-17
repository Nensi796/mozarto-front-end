export interface ICreateNewPasswordUser {
    _id: string;
    email: string;
    isDeleted: boolean;
    isVerified: boolean;
    isFirstLogin: boolean;
    __v: number;
}

export interface Root {
    _id: string;
    email: string;
    isDeleted: boolean;
    isVerified: boolean;
    isFirstLogin: boolean;
    __v: number;
}
