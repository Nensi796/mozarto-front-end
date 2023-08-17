import { ChangeEvent } from 'react';
import { PrimaryButton, PrimaryInput, Select } from '../index';
import SvgIcon from '../Icon/SvgIcon';
import { avatar } from '../../../assets';
import { IOptionProps } from '../../../data/common';

const options: IOptionProps[] = [
    { key: '', title: 'Coax Creative' },
    { key: 'value1', title: 'Value 1' },
    { key: 'value2', title: 'Value 2' },
    { key: 'value3', title: 'Value 3' },
    { key: 'value4', title: 'Value 4' },
    { key: 'value5', title: 'Value 5' },
    { key: 'value6', title: 'Value 6' },
];
const List = ['Transaction Matcher', 'Recent History', 'Shareholders', 'Audit'];

const Header = () => {
    const handleOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log('============', e.target.value);
    };

    return (
        <div className="h-[155px] bg-white">
            <div className="h-24 border border-solid border-x-0 border-t-0 border-b border-gray-200">
                <div className="flex py-5 px-8 header gap-4">
                    <div className="w-1/3">
                        <PrimaryInput
                            iconPosition="left"
                            icon="SEARCH_ICON"
                            placeholder="Search for something...."
                            className="min-w-1/2 !pl-9"
                        />
                    </div>
                    <div className="w-1/4">
                        <Select
                            label="searchSelect"
                            options={options}
                            handleOnSelect={(e) => handleOnSelect(e)}
                        />
                    </div>
                    <div className="w-[404px]">
                        <div className="flex items-center justify-between">
                            <SvgIcon className="mt-[15px]" icon="CLOCK_ICON" />
                            <div className="flex flex-col ml-4 ">
                                <span className="text-sm text-gray-400 font-medium">
                                    Local time
                                </span>
                                <span className="text-sm text-green-200 font-medium">
                                    18:08:05
                                </span>
                            </div>
                            <div className="h-6 border border-solid border-y-0 border-l-0 border-gray-300" />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-400 font-medium">
                                    System time
                                </span>
                                <span className="text-sm text-green-200 font-medium">
                                    17:08:05
                                </span>
                            </div>
                            <div className="h-6 border border-solid border-y-0 border-l-0 border-gray-300" />
                            <SvgIcon icon="NOTIFICATION" />
                            <div className="h-6 border border-solid border-y-0 border-l-0 border-gray-300" />
                            <div className="flex items-center">
                                <img
                                    src={avatar}
                                    alt="img"
                                    className="mr-4"
                                    width="50%"
                                    height="50%"
                                />
                                <SvgIcon icon="ARROW_DOWN" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-1/2 gap-x-4 px-8 py-4">
                {List.map((v, index) => (
                    <PrimaryButton
                        key={index}
                        type="button"
                        name={v}
                        color="#8FB131"
                        variant="filled"
                    />
                ))}
            </div>
        </div>
    );
};
export default Header;
