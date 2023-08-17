import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Modal,
    Pagination,
    PrimaryButton,
    PrimaryInput,
    Select,
    Switch,
    Table,
} from '../../Common';
import AdminDrawer from '../../AdminDrawer/AdminDrawer';
import { ICompanyData } from '../../../data/common';
import {
    createCompany,
    deleteCompany,
    getCompanies,
    updateCompany,
} from '../../../services/api/api';
import { showToast } from '../../../data/utils/toast';
import { validate } from '../../../data/utils/common';
import { IColumnType } from '../../Common/Table/Table';
import SvgIcon from '../../Common/Icon/SvgIcon';
import LoadingSpinner from '../../Common/Loader/Loader';

const options = [
    { id: '', name: 'Bulk Changes...' },
    { id: 'v1', name: 'Delete' },
];

const Companies = () => {
    const[loading,setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState<number>(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>('');

    const [isEditCompany, setIsEditCompany] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [validationErrors, setValidationError] = useState<{
        [p: string]: string | number;
    }>({});

    const [company, setCompany] = useState<ICompanyData>();
    const [allCompanies, setAllCompanies] = useState<ICompanyData[]>([]);

    const [checkedCompanies, setCheckedCompanies] = useState<string[]>([]);
    const isAllChecked = allCompanies?.length === checkedCompanies?.length;
    const columns: IColumnType<ICompanyData>[] = [
        {
            key: 'checked',
            width: 20,
            title: (
                <div className="flex justify-center">
                    <PrimaryInput
                        checked={isAllChecked}
                        isCheckbox
                        onChange={() => {
                            if (isAllChecked) {
                                setCheckedCompanies([]);
                            } else {
                                setCheckedCompanies(
                                    allCompanies?.map((item) => item?._id)
                                );
                            }
                        }}
                        type="checkbox"
                    />
                </div>
            ),
            render: (_, i) => (
                <div className="flex justify-center">
                    <PrimaryInput
                        isCheckbox
                        checked={
                            checkedCompanies?.find((item) => item === i._id) ===
                            i._id
                        }
                        onChange={() => {
                            if (
                                checkedCompanies?.includes(i._id) ||
                                isAllChecked
                            ) {
                                setCheckedCompanies(
                                    checkedCompanies?.filter(
                                        (item) => item !== i?._id
                                    )
                                );
                            } else {
                                setCheckedCompanies([
                                    ...checkedCompanies,
                                    i?._id,
                                ]);
                            }
                        }}
                        type="checkbox"
                    />
                </div>
            ),
        },
        {
            key: 'name',
            title: (
                <div className="flex justify-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Name</div>
                </div>
            ),
            width: 200,
        },

        {
            key: 'edit',
            title: 'Edit',
            width: 40,
            render: (_, i) => (
                <SvgIcon
                    className="cursor-pointer"
                    onClick={() => {
                        setCompany(i);
                        setIsEditCompany(true);

                        setIsOpen(true);
                    }}
                    icon="EDIT_ICON"
                />
            ),
        },
        {
            key: 'disable',
            title: 'Disable',
            width: 40,
            render: () => <Switch className="rounded-2xl bg-gray-200" />,
        },
        {
            key: 'delete',
            title: 'Action',
            width: 40,
            render: (_, i) => (
                <SvgIcon
                    className="cursor-pointer"
                    onClick={() => {
                        setIsOpenDeleteModal(true);
                        setDeleteId(i?._id);
                    }}
                    icon="DELETE_ICON"
                />
            ),
        },
    ];

    const getAllCompanies = () => {
        setLoading(true);
        getCompanies()
            .then((res) => {
                setAllCompanies(res);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                showToast(
                    err?.errors?.[0]?.message || 'something went wrong',
                    'error'
                );
            });
    };

    useEffect(() => {
        getAllCompanies();
    }, []);

    const handleDelete = () => {
        setIsOpenDeleteModal(false);
        deleteCompany(deleteId)
            .then(() => {
                getAllCompanies();
                showToast('Successfully Deleted');
            })
            .catch((err) => {
                showToast(
                    err?.errors?.[0]?.message || 'something went wrong',
                    'error'
                );
            });
    };

    const openDrawer = () => {
        setIsError(false);
        setValidationError({});
        setIsEditCompany(false);
        setCompany({
            __v: 0,
            _id: '',
            brands: [],
            createdAt: '',
            description: '',
            name: '',
            updatedAt: '',
        });

        setIsOpen(!isOpen);
    };

    const handleOnChange = useCallback(
        (
            e: ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >,
            key: string
        ) => {
            if (!key) return;
            setCompany((prevCompanyData) => ({
                ...(prevCompanyData as ICompanyData),
                [key]: e.target.value,
            }));
        },
        []
    );

    const currentTableData = useMemo(
        () =>
            allCompanies?.slice(
                currentPage * pageLimit - pageLimit,
                currentPage * pageLimit
            ),
        [allCompanies, currentPage, pageLimit]
    );

    const handleOnSubmit = () => {
        if (isEditCompany) {
            const errors: {
                [p: string]: string | number;
            } = {};

            const payload: {
                [key: string]: string;
            } = {
                description: company?.description as string,
                companyName: company?.name as string,
            };

            Object.keys(payload).forEach((key: string) => {
                const isErrors = validate(key, payload[key]);
                if (isErrors?.length) {
                    errors[key] = isErrors;
                }
            });

            if (Object.keys(errors)?.length) {
                setValidationError(errors as any);
                setIsError(true);
            } else if (company) {
                const updatedData = {
                    name: company?.name,
                    brands: [],
                    description: company?.description,
                    logo: 'string',
                    isDeleted: false,
                };
                updateCompany(company._id, updatedData)
                    .then(() => {
                        getAllCompanies();

                        setCompany({
                            __v: 0,
                            _id: '',
                            brands: [],
                            createdAt: '',
                            description: '',
                            name: '',
                            updatedAt: '',
                        });

                        setIsOpen(false);
                        showToast('Successfully Updated');
                    })
                    .catch((err) => {
                        showToast(
                            err?.errors?.[0]?.message || 'something went wrong',
                            'error'
                        );
                    });
            }
        } else {
            const errors: {
                [p: string]: string | number;
            } = {};

            const payload: {
                [key: string]: string;
            } = {
                description: company?.description as string,
                companyName: company?.name as string,
            };

            Object.keys(payload).forEach((key: string) => {
                const isErrors = validate(key, payload[key]);
                if (isErrors?.length) {
                    errors[key] = isErrors;
                }
            });

            if (Object.keys(errors)?.length) {
                setValidationError(errors as any);
                setIsError(true);
            } else {
                const data = {
                    name: company?.name,
                    brands: [],
                    description: company?.description,
                    logo: 'string',
                    isDeleted: false,
                };
                setValidationError({});
                setIsError(false);
                createCompany(data as any)
                    .then((result) => {
                        getAllCompanies();

                        setIsOpen(false);
                        showToast(result.message, 'success');
                    })
                    .catch((err: any) => {
                        showToast(err.message, 'error');
                    });
            }
        }
    };

    const handleOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        if (currentTableData?.length < parseInt(e.target.value)) {
            setCurrentPage(1);
        }
        setPageLimit(parseInt(e.target.value));
    };

    return (
        <div className="px-8 py-5">
            <div className="mb-8 flex w-full items-center justify-between">
                <div className="font-extrabold text-2xl text-[#131119]">
                    Existing Company
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-[290px]">
                        <Select
                            isGroup
                            options={options}
                            handleOnSelect={(
                                e: ChangeEvent<HTMLSelectElement>
                            ) => {
                                console.log(e.target.value);
                            }}
                            label="userList"
                            className="w-full max-w-[290px]"
                        />
                    </div>
                    <div className="w-[144px]">
                        <PrimaryButton
                            onClick={openDrawer}
                            type="button"
                            name="Add New Company"
                            color="#8FB131"
                            variant="filled"
                            className="w-full font-medium"
                        />
                    </div>
                </div>
            </div>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div>
                    <div className="min-[1512px]:max-h-[420px] md:max-h-[200px] lg:max-h-[300px] !overflow-y-scroll !overflow-x-scroll">
                        <div className="flex w-full max-w-full items-center">
                            <Table
                                data={currentTableData}
                                columns={columns}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="mt-2">
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={allCompanies?.length}
                            pageSize={pageLimit}
                            onPageChange={(page: number) =>
                                setCurrentPage(page)
                            }
                            siblingCount={1}
                            setCurrentPage={setCurrentPage}
                            handleOnSelect={handleOnSelect}
                        />
                    </div>
                </div>
            )}
            <AdminDrawer
                isEditCompanyDrawer={isEditCompany}
                company={company}
                isOpen={isOpen}
                openDrawer={openDrawer}
                isCompany
                handleSubmit={handleOnSubmit}
                handleOnChange={handleOnChange}
                isError={isError}
                validationErrors={validationErrors}
            />
            {isOpenDeleteModal && (
                <Modal setIsOpen={setIsOpenDeleteModal} title="Delete">
                    <div>
                        <h2>Are you sure want to delete?</h2>
                        <div className="flex justify-end gap-2">
                            <PrimaryButton
                                onClick={handleDelete}
                                className="!bg-red-600"
                                color="#8FB131"
                                variant="filled"
                                name="Delete"
                            />{' '}
                            <PrimaryButton
                                onClick={() => setIsOpenDeleteModal(false)}
                                className="!bg-white !text-black !border !border-solid !border-[#8FB131]"
                                color="#8FB131"
                                variant="filled"
                                name="Cancel"
                            />
                        </div>
                    </div>
                </Modal>
            )}{' '}
        </div>
    );
};

export default Companies;
