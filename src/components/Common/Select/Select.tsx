import { ChangeEvent } from 'react';
import '../Input/index.css';

interface ISelectProps {
    isGroup?: boolean;
    options: any[];
    placeHolder?: string;
    label: string;
    handleOnSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    editUser?: string;
}
const Select = ({
    editUser,
    isGroup,
    handleOnSelect,
    placeHolder,
    options,
    label,
    className,
}: ISelectProps) => {
    console.log(editUser);
    return (
        <div>
            <select
                defaultValue={editUser}
                placeholder={placeHolder}
                style={{
                    display: 'flex',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#393838',
                    width: '100%',
                    padding: ' 8px',
                    borderRadius: 6,
                    marginTop: 4,
                }}
                onChange={handleOnSelect}
                name={label}
                id={label}
                className={className}
            >
                {options?.map((v, index) => {
                    const getValue = () => {
                        if (index === 0 && !editUser && isGroup) {
                            return '1';
                        }
                        if (
                            ((isGroup || editUser) &&
                                index === options.length - 1) ||
                            v?.name === 'No-Groups'
                        ) {
                            return v?._id as string;
                        }
                        return v?._id as string;
                    };

                    return (
                        <option
                            key={index}
                            selected={
                                editUser
                                    ? v?._id === editUser
                                    : index === 0 || editUser === null
                            }
                            value={getValue()}
                        >
                            {isGroup ? v?.name : v?.title}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
export default Select;
