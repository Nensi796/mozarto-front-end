import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import './pagination.css';
import { PrimaryButton, PrimaryInput, Select } from '../index';
import { IOptionProps } from '../../../data/common';
import { showToast } from '../../../data/utils/toast';

interface IPaginationProps {
    onPageChange: (number: number) => void;
    totalCount: number;
    siblingCount: number;
    currentPage: number;
    pageSize: number;
    className: string;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    handleOnSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const options: IOptionProps[] = [
    { key: '10', title: '10' },
    { key: '20', title: '20' },
    { key: '30', title: '30' },
];

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
    setCurrentPage,
    handleOnSelect,
}: IPaginationProps) => {
    const paginationRange: (string | number)[] | any = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });
    const [currentPageValue, setCurrentPageValue] = useState<number>(0);

    if (currentPage === 0) {
        return null;
    }
    const onPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const lastPage = paginationRange[paginationRange.length - 1];

    const onNext = () => {
        if (currentPage === lastPage) return;
        if (currentPage !== lastPage) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-between">
            <div className="flex items-center">
                <div
                    className={classnames('pagination-container', {
                        [className]: className,
                    })}
                >
                    <div
                        className={classnames('pagination-item', {
                            disabled: currentPage === 1,
                        })}
                        onClick={onPrevious}
                    >
                        <div
                            className="arrow"
                            style={{
                                transform: 'rotate(-135deg) translate(-50%)',
                            }}
                        />
                    </div>
                    {paginationRange.map((pageNumber: any) => {
                        if (pageNumber === DOTS) {
                            return (
                                <div className="pagination-item dots">
                                    &#8230;
                                </div>
                            );
                        }

                        return (
                            <div
                                key={pageNumber}
                                className={classnames('pagination-item', {
                                    'bg-green-200': pageNumber === currentPage,
                                })}
                                onClick={(e) => {
                                    const eventTarget = e.target as HTMLElement;
                                    onPageChange(
                                        parseInt(eventTarget.innerText)
                                    );
                                }}
                            >
                                {pageNumber}
                            </div>
                        );
                    })}
                    <div
                        className={classnames('pagination-item', {
                            'pointer-events-none hover:bg-none':
                                currentPage === lastPage,
                        })}
                        onClick={onNext}
                    >
                        <div
                            className="arrow"
                            style={{ transform: 'rotate(45deg' }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm">Go To Page</div>
                    <PrimaryInput
                        type="number"
                        className="!w-8 !bg-white"
                        onChange={(e) =>
                            setCurrentPageValue(parseInt(e.target.value))
                        }
                    />
                    <PrimaryButton
                        onClick={() => {
                            if (
                                currentPageValue > 0 &&
                                !(paginationRange.length < 2) &&
                                (currentPageValue < paginationRange.length ||
                                    currentPageValue === paginationRange.length)
                            ) {
                                setCurrentPage(currentPageValue);
                            }
                            if (
                                paginationRange.length < 2 &&
                                currentPageValue > paginationRange.length
                            ) {
                                showToast('Enter valid page number', 'error');
                            }
                        }}
                        type="button"
                        name="Go"
                        color="#8FB131"
                        variant="filled"
                        className="w-fit p-2 font-medium"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm">Show Transactions</div>
                <Select
                    className="!bg-white"
                    label="pageList"
                    options={options}
                    handleOnSelect={(e) => handleOnSelect(e)}
                />
            </div>
        </div>
    );
};

export default Pagination;
