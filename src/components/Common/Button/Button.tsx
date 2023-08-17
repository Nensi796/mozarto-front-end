import {
    AriaAttributes,
    DetailedHTMLProps,
    ButtonHTMLAttributes,
    MouseEvent,
    FC,
} from 'react';

const lightgreen = '#8FB131';
const darkgreen = '#2E672F';

interface IButtonProps
    extends DetailedHTMLProps<
            ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
        >,
        AriaAttributes {
    onClick?: (e?: MouseEvent<HTMLElement>) => void;
    color: typeof lightgreen | typeof darkgreen;
    variant: 'outline' | 'filled';
    isDrawerButton?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const PrimaryButton: FC<IButtonProps> = (props) => {
    const {
        name,
        variant,
        color,
        type = 'button',
        className,
        disabled = false,
        isDrawerButton,
        ...rest
    } = props;

    let backgroundColor: string;
    let fontColor: string;

    if (variant === 'filled') {
        fontColor = 'white';
        backgroundColor = color;
    } else {
        backgroundColor = 'white';
        fontColor = color;
    }

    return type === 'submit' ? (
        <button
            style={{
                height: isDrawerButton ? '50px' : '32px',
                fontSize: isDrawerButton ? '16px' : '14px',
                fontWeight: 500,
                border:
                    variant === 'outline' ? `1px solid ${fontColor}` : 'none',
                background: backgroundColor,
                color: fontColor,
                opacity: 1,
                borderRadius: isDrawerButton ? '12px' : '6px',
                cursor: 'pointer',
                ...rest,
            }}
            type="submit"
            disabled={disabled}
            className={className}
            {...rest}
        >
            {name}
        </button>
    ) : (
        <button
            style={{
                height: isDrawerButton ? '50px' : '32px',
                fontSize: isDrawerButton ? '16px' : '14px',
                fontWeight: 500,
                border:
                    variant === 'outline' ? `1px solid ${fontColor}` : 'none',
                background: backgroundColor,
                color: fontColor,
                opacity: 1,
                borderRadius: isDrawerButton ? '12px' : '6px',
                cursor: 'pointer',
                ...rest,
            }}
            type="button"
            disabled={disabled}
            className={className}
            {...rest}
        >
            {name}
        </button>
    );
};

export default PrimaryButton;
