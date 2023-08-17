import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import React from 'react';

interface IUserDrawer {
    drawerDirection: 'left' | 'right' | 'top' | 'bottom';
    toggleDrawer: () => void;
    isOpen: boolean;
    drawerSize?: number;
    children?: React.ReactNode;
    className?: string;
}
const userDrawer = ({
    drawerDirection,
    toggleDrawer,
    isOpen,
    children,
    drawerSize,
    className,
}: IUserDrawer) => (
    <Drawer
        size={drawerSize}
        open={isOpen}
        onClose={toggleDrawer}
        direction={drawerDirection}
        className={className}
    >
        <div>{children}</div>
    </Drawer>
);

export default userDrawer;
