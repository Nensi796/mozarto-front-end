import { DetailedHTMLProps, FC, InputHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import './TextArea.css';

interface Props
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    > {
    placeHolder?: string;
    rows: number;
    cols: number;
    label?: ReactNode;
    isError?: boolean;
}

const TextArea: FC<Props> = ({
    label,
    rows,
    cols,
    className,
    placeHolder,
    isError = false,
    ...props
}: Props) => (
    <div className="flex flex-col">
        <label
            className={classNames('font-medium text-gray-300 text-sm mb-1', {
                'text-red-200': isError,
                'text-gray-300': !isError,
            })}
            htmlFor={props?.id}
        >
            {label}
        </label>
        <textarea
            style={{
                display: 'flex',
                fontWeight: 400,
                color: '#393838',
                padding: '10px 8px',
                border: 'none !important',
                borderColor: '#393838 !important',
                borderRadius: 6,
            }}
            className="font-medium text-gray-300 text-sm mb-1"
            cols={cols}
            placeholder={placeHolder}
            rows={rows}
            {...props}
        />
    </div>
);
export default TextArea;
