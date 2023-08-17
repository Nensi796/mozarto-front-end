import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router';
import SvgIcon from '../Icon/SvgIcon';
import { type IMenuItem } from '../../../data/common';

const Menubar = ({ menuItem }: any) => {
    const location = useLocation();
    const [isActiveIndex, setIsActiveIndex] = useState<boolean>(false);

    useEffect(() => {
        if (
            location.pathname.includes('admin') ||
            location.pathname.includes('payment')
        ) {
            setIsActiveIndex(true);
        } else {
            setIsActiveIndex(false);
        }
    }, [location.pathname]);

    return (
        <div className="flex h-full flex-col justify-between px-2">
            <div>
                {menuItem.map((v: IMenuItem) => (
                    <div
                        key={v.title}
                        onClick={() => {
                            if (!v.subMenu) return;
                            setIsActiveIndex(!isActiveIndex);
                        }}
                    >
                        <div
                            key={v.id}
                            className={classNames(
                                'flex flex-col hover:bg-green-100 rounded-lg focus:bg-green-100 mt-1',
                                (location.pathname === v.path ||
                                    location.pathname.includes(
                                        v?.path as string
                                    )) &&
                                    isActiveIndex
                                    ? 'bg-green-100'
                                    : ''
                            )}
                        >
                            <Link
                                to={v?.subMenu ? '' : (v?.path as string)}
                                className="!decoration-0 text-green-800 !border-b-0 hover:text-white "
                            >
                                <div className="flex items-center justify-between">
                                    <div className="ml-3 flex items-center">
                                        <SvgIcon
                                            icon={v.icon}
                                            className={classNames(
                                                'fill-green-100',

                                                location.pathname === v.path ||
                                                    location.pathname.includes(
                                                        v?.path as string
                                                    )
                                                    ? '!fill-white stroke-white stroke-2'
                                                    : ''
                                            )}
                                        />

                                        <div
                                            className={classNames(
                                                'ml-4 text-base font-extrabold py-2',
                                                (location.pathname === v.path ||
                                                    location.pathname.includes(
                                                        v?.path as string
                                                    )) &&
                                                    isActiveIndex
                                                    ? 'text-white '
                                                    : ''
                                            )}
                                        >
                                            {v?.title}
                                        </div>
                                    </div>
                                    <div className="mr-4">
                                        {v.subMenu && (
                                            <SvgIcon icon="ARROW_DOWN" />
                                        )}
                                        {v.subMenu &&
                                            ((location.pathname.includes(
                                                v?.path as string
                                            ) &&
                                                isActiveIndex) ||
                                                (location.pathname === v.path &&
                                                    isActiveIndex)) && (
                                                <SvgIcon icon="ARROW_UP" />
                                            )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {isActiveIndex && v.subMenu && (
                            <div className="mx-4 mt-1 ml-4 border border-y-0 border-r-0 border-solid border-green-100">
                                {(v?.subMenu || []).map((d) => (
                                    <div className="py-1 pl-2" key={d?.id}>
                                        <Link to={d?.path}>
                                            <div
                                                className={classNames(
                                                    'ml-1 text-green-100 text-xs font-extrabold',
                                                    location.pathname === d.path
                                                        ? 'text-green-200'
                                                        : ''
                                                )}
                                            >
                                                {d?.title}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Menubar;
