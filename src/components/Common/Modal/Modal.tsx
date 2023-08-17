import { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import './modal.css';
import SvgIcon from '../Icon/SvgIcon';

interface IModalProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    children: JSX.Element;
    title: string | JSX.Element;
    icon?: boolean;
}

const Modal = ({ title, setIsOpen, children, icon = false }: IModalProps) => (
    <div className="darkBG" style={{ position: 'absolute', zIndex: 1000 }}>
        <div className="centered">
            <div className="modal">
                {' '}
                <div
                    className={classNames(
                        '',
                        typeof title !== 'string'
                            ? 'modalImageHeader'
                            : 'modalHeader'
                    )}
                >
                    {typeof title !== 'string' ? (
                        <div className="flex justify-center">{title}</div>
                    ) : (
                        <div className="heading">{title}</div>
                    )}
                    {icon && (
                        <SvgIcon
                            onClick={() => setIsOpen(false)}
                            icon="CLOSE_BUTTON"
                            className="pr-2"
                        />
                    )}
                </div>
                <div className="modalContent">{children}</div>
            </div>
        </div>
    </div>
);

export default Modal;
