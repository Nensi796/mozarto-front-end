import {
    InputHTMLAttributes,
    DetailedHTMLProps,
    FC,
    MouseEvent,
    ReactNode,
} from 'react';
import './index.css';
import classNames from 'classnames';
import SvgIcon from '../Icon/SvgIcon';

interface Props
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    // onChange: (e: ChangeEvent<HTMLInputElement>, key?: string) => void;
    label?: ReactNode;
    icon?: any;
    iconPosition?: 'left' | 'right';
    isError?: boolean;
    isCheckbox?: boolean;
    iconOnClick?: (e: MouseEvent<HTMLElement>) => void;
    placeHolder?: string;
    max?: number;
    defaultValue?: string;
}

const Input: FC<Props> = ({
    defaultValue,
    style,
    icon,
    iconPosition,
    isCheckbox = false,
    label,
    className,
    iconOnClick,
    isError = false,
    placeHolder,
    max,
    ...props
}: Props) => (
    <div className="flex flex-col">
        {!isCheckbox && (
            <label
                className={classNames(
                    'font-medium text-gray-300 text-sm mb-1',
                    {
                        'text-red-200': isError,
                        'text-gray-300': !isError,
                    }
                )}
                htmlFor={props?.id}
            >
                {label}
            </label>
        )}
        <div
            className="w-full input-with-icon"
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            {iconPosition === 'left' && (
                <SvgIcon
                    icon={icon}
                    onClick={(e) => (iconOnClick ? iconOnClick(e) : '')}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: iconPosition === 'left' ? '10px' : 'auto',
                        right: iconPosition === 'left' ? 'auto' : 'auto',
                    }}
                />
            )}
            {isCheckbox ? (
                <label className="container">
                    {label}
                    <input
                        placeholder={placeHolder}
                        className={className}
                        style={{
                            display: 'flex',
                            fontSize: '15px',
                            fontWeight: 400,
                            color: '#393838',
                            width: '100%',
                            padding: '10px 8px',
                            borderRadius: 6,
                        }}
                        type="text"
                        {...props}
                    />{' '}
                    <span className="checkmark" />
                </label>
            ) : (
                <input
                    defaultValue={defaultValue}
                    max={max}
                    placeholder={placeHolder}
                    className={className}
                    style={{
                        display: 'flex',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#393838',
                        width: '100%',
                        padding: '10px 8px',
                        borderRadius: 6,
                    }}
                    type="text"
                    {...props}
                />
            )}
            {iconPosition === 'right' && (
                <SvgIcon
                    icon={icon}
                    onClick={(e) => (iconOnClick ? iconOnClick(e) : '')}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: iconPosition === 'right' ? 'auto' : '10px',
                        right: iconPosition === 'right' ? '10px' : 'auto',
                    }}
                />
            )}
        </div>
    </div>
);

export default Input;
