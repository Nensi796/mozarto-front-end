import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    AppActions,
    AppActionsEnum,
    AppInitialState,
    IAppContext,
} from './AuthContextValues';
import { getCurrentUser } from '../../services/api/api';

export const AppReducer = (
    state: IAppContext,
    action: AppActions
): IAppContext => {
    const { type, payload } = action;

    console.log('AuthContext action made: ', state, action, {
        ...state,
        ...payload,
    });

    if (type === AppActionsEnum.SET_CURRENT_USER) {
        return {
            authUser: payload.authUser,
            role: payload.role,
            isLoggedIn: payload.isLoggedIn,
        };
    }
    return state;
};

export interface IAppContextProps {
    auth: IAppContext;
    dispatch: React.Dispatch<AppActions>;
}

const AuthContext = createContext<IAppContextProps>({
    auth: AppInitialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dispatch: () => {},
});

interface AuthContextProviderProps {
    children?: ReactNode;
}
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
    children,
}) => {
    const navigate = useNavigate();
    const [auth, dispatch] = useReducer(AppReducer, AppInitialState);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const fetchCurrentUser = async () => {
        try {
            const currentUser = await getCurrentUser(token);
            if (!currentUser?.user) {
                return dispatch({
                    type: AppActionsEnum.SET_CURRENT_USER,
                    payload: {
                        authUser: null,
                        isLoggedIn: false,
                        role: null,
                    },
                });
            }
            dispatch({
                type: AppActionsEnum.SET_CURRENT_USER,
                payload: {
                    authUser: currentUser.user,
                    isLoggedIn: true,
                    role: currentUser.user.role,
                },
            });
        } catch (err) {
            console.error('User information could not be fetched', err);
            dispatch({
                type: AppActionsEnum.SET_CURRENT_USER,
                payload: {
                    authUser: null,
                    isLoggedIn: false,
                    role: null,
                },
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token') || '';
        // if (!token) {
        //     navigate('/');
        //     return dispatch({
        //         type: AppActionsEnum.SET_CURRENT_USER,
        //         payload: {
        //             authUser: null,
        //             isLoggedIn: false,
        //             role: null,
        //         },
        //     });
        // }
        // if (auth?.isLoggedIn) {
        //     return navigate('/dashboard');
        // }
        fetchCurrentUser();
    }, [auth?.isLoggedIn]);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <AuthContext.Provider value={{ auth, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

// -----------------------------------------------
// We should use this context for anything which needs to be shared across components globally
// and does not match a specific usecase as other contexts.
// -----------------------------------------------

export default AuthContext;

export const useAuthContext = (): IAppContextProps => useContext(AuthContext);
