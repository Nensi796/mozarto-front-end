import { ActionMap } from '../context.helpers';
import { IUser } from '../../data/common';
import { UserRoles } from '../../data/constants/auth.constants';

export interface IAppContext {
    authUser: IUser | null;
    isLoggedIn: boolean | null;
    role: UserRoles | null;
}

export const AppInitialState: IAppContext = {
    authUser: null,
    isLoggedIn: null,
    role: null,
};

export enum AppActionsEnum {
    SET_CURRENT_USER = 'SET_CURRENT_USER',
}

export type AppActionsPayload = {
    [AppActionsEnum.SET_CURRENT_USER]: {
        authUser: IUser | null;
        isLoggedIn: boolean | null;
        role: UserRoles | null;
    };
};

export type AppActions =
    ActionMap<AppActionsPayload>[keyof ActionMap<AppActionsPayload>];
