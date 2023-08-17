import { Header, Sidebar } from '../index';
import './layout.css';

export interface ILayoutProps {
    children?: JSX.Element;
}

const Layout = ({ children }: ILayoutProps) => (
    <div>
        <div className="flex w-full">
            <div>
                <Sidebar />
            </div>
            <div>
                <Header />

                <div className="bg-gray-700 content">{children}</div>
            </div>
        </div>
    </div>
);

export default Layout;
