import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
    Modal,
    Pagination,
    PrimaryButton,
    PrimaryInput,
    Select,
    Switch,
    Table,
} from '../../Common';
import {
     IPagePermissions,
     IBrandsPermissions,
} from '../../../data/common';
import AdminDrawer from '../../AdminDrawer/AdminDrawer';
import { validate } from '../../../data/utils/common';
import {
    createGroup,
    deleteGroup,
    getGroupData,
    updateGroup,
} from '../../../services/api/api';
import { showToast } from '../../../data/utils/toast';
import { IGroup } from '../../../data/common';
import { IColumnType } from '../../Common/Table/Table';
import SvgIcon from '../../Common/Icon/SvgIcon';
import LoadingSpinner from '../../Common/Loader/Loader';

const options = [
    { id: 'v3', name: 'Bulk Changes...' },
    { id: 'v1', name: 'Delete' },
];

const Groups = () => {
    const [allGroups, setAllGroups] = useState<IGroup[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState<number>(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [pageAreaData, setPageAreaData] = useState<IPagePermissions[]>([]);
    const [accessAreaData, setAccessAreaData] = useState<IBrandsPermissions[]>(
        []
    );
    const[loading,setLoading] = useState(false);

    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string>('');
    const [isError, setIsError] = useState<boolean>(false);
    const [validationErrors, setValidationError] = useState<{
        [p: string]: string | number;
    }>({});
    const [isGroupName, setIsGroupName] = useState<string>('');
    const [checkedGroups, setCheckedGroups] = useState<string[]>([]);
    const [editGroupDetails, setEditGroupDetails] = useState<IGroup>({
        _id: '',
        createdAt: '',
        name: '',
        updatedAt: '',
        __v: 0,
        isDeleted: false,
        permission: {
            _id: '',
            pageAreasPermissions: [],
            brandsPermissions: [],
            createdAt: '',
            updatedAt: '',
            __v: 0,
        },
        permissionId: '',
    });
    const [isEditGroupDrawer, setIsEditGroupDrawer] = useState<boolean>(false);

    const isAllChecked = allGroups?.length === checkedGroups?.length;

    const getGroups = () => {
        setLoading(true)
        getGroupData()
            .then((res) => {
                setAllGroups(res?.groups);
                setLoading(false)
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
        getGroups();
    }, []);

    const handleDelete = () => {
        setIsOpenDeleteModal(false);
        deleteGroup(deleteId)
            .then(() => {
                getGroups();
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
        setIsEditGroupDrawer(false);
        setValidationError({});
        setIsGroupName('');
        setEditGroupDetails({
            _id: '',
            createdAt: '',
            name: '',
            updatedAt: '',
            __v: 0,
            isDeleted: false,
            permission: {
                _id: '',
                pageAreasPermissions: [],
                brandsPermissions: [],
                createdAt: '',
                updatedAt: '',
                __v: 0,
            },
            permissionId: '',
        });

        setIsOpen(!isOpen);
        if (isOpen) {
            setIsGroupName('');
            setPageAreaData([]);
            setAccessAreaData([]);
        }
    };

    const currentTableData = useMemo(
        () =>
            allGroups?.slice(
                currentPage * pageLimit - pageLimit,
                currentPage * pageLimit
            ),
        [allGroups, currentPage, pageLimit]
    );

    const columns: IColumnType<IGroup>[] = [
        {
            key: 'checked',
            width: 10,
            title: (
                <div className="flex justify-center">
                    <PrimaryInput
                        onChange={() => {
                            if (isAllChecked) {
                                setCheckedGroups([]);
                            } else {
                                setCheckedGroups(
                                    allGroups?.map((item) => item?._id)
                                );
                            }
                        }}
                        isCheckbox
                        checked={isAllChecked}
                        type="checkbox"
                    />
                </div>
            ),
            render: (_, i) => (
                <div className="flex justify-center">
                    <PrimaryInput
                        isCheckbox
                        checked={
                            checkedGroups?.find((item) => item === i?._id) ===
                            i?._id
                        }
                        onChange={() => {
                            if (
                                checkedGroups?.includes(i?._id) ||
                                isAllChecked
                            ) {
                                setCheckedGroups(
                                    checkedGroups?.filter(
                                        (item) => item !== i?._id
                                    )
                                );
                            } else {
                                setCheckedGroups([...checkedGroups, i?._id]);
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
            width: 20,
        },
        {
            key: 'edit',
            title: 'Edit',
            width: 40,
            render: (_, i) => (
                <SvgIcon
                    className="cursor-pointer"
                    onClick={() => {
                        setEditGroupDetails(i);
                        setIsEditGroupDrawer(true);
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

    const handleOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setPageLimit(parseInt(e.target.value));
    };

    const handleCreateGroup = () => {
        if (editGroupDetails?._id && isEditGroupDrawer) {
            const errors: {
                [p: string]: string | number;
            } = {};

            const payload: {
                [key: string]:
                    | string
                    | IBrandsPermissions[]
                    | IPagePermissions[];
            } = {
                groupName: editGroupDetails?.name,
                brandsPermissions:
                    editGroupDetails?.permission?.brandsPermissions,
                pageAreasPermissions:
                    editGroupDetails?.permission?.pageAreasPermissions,
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
                const updatedData = {
                    name: editGroupDetails?.name,
                    permissionId: editGroupDetails?.permissionId,
                    brandsPermissions:
                        editGroupDetails?.permission?.brandsPermissions,
                    pageAreasPermissions:
                        editGroupDetails?.permission?.pageAreasPermissions,
                };

                updateGroup(editGroupDetails?._id, updatedData)
                    .then((result) => {
                        getGroups();

                        setAccessAreaData([]);
                        setPageAreaData([]);
                        setIsGroupName('');
                        setValidationError({});
                        setIsOpen(false);
                        showToast(result?.message, 'success');
                    })
                    .catch((err: any) => {
                        showToast(err.message, 'error');
                    });
            }
        } else {
            const errors: {
                [p: string]: string | number;
            } = {};

            const payload: {
                [key: string]:
                    | string
                    | IBrandsPermissions[]
                    | IPagePermissions[];
            } = {
                groupName: isGroupName,

                brandsPermissions: accessAreaData,
                pageAreasPermissions: pageAreaData,
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
            } else if (isGroupName && accessAreaData && pageAreaData) {
                const data = {
                    name: isGroupName,
                    brandsPermissions: accessAreaData,
                    pageAreasPermissions: pageAreaData,
                };
                setValidationError({});
                setIsError(false);
                createGroup(data as any)
                    .then((result) => {
                        getGroups();
                        setAccessAreaData([]);
                        setPageAreaData([]);
                        setIsGroupName('');
                        setIsOpen(false);
                        showToast(result.message, 'success');
                    })
                    .catch((err: any) => {
                        showToast(err.message, 'error');
                    });
            }
        }
    };

    return (
        <div className="px-8 py-5">
            <div className="mb-8 max-[970px]:flex-col flex w-full items-center justify-between">
                <div className="font-extrabold text-2xl text-[#131119]">
                    Existing Groups
                </div>
                <div className="max-[970px]:flex-col flex items-center gap-4">
                    <div className="w-[290px]">
                        <Select
                            isGroup
                            options={options}
                            handleOnSelect={(
                                e: ChangeEvent<HTMLSelectElement>
                            ) => console.log(e.target.value)}
                            label="userList"
                            className="w-full max-w-[290px]"
                        />
                    </div>
                    <div className="w-[144px]">
                        <PrimaryButton
                            onClick={openDrawer}
                            type="button"
                            name="Add New Group"
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
                            totalCount={allGroups?.length}
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
                setEditGroup={setEditGroupDetails}
                isEditGroupDrawer={isEditGroupDrawer}
                editGroup={editGroupDetails}
                accessAreaData={
                    isEditGroupDrawer
                        ? editGroupDetails?.permission?.brandsPermissions
                        : accessAreaData
                }
                isOpen={isOpen}
                openDrawer={openDrawer}
                pageAreaData={
                    isEditGroupDrawer
                        ? editGroupDetails?.permission?.pageAreasPermissions
                        : pageAreaData
                }
                setAccessAreaData={setAccessAreaData}
                setPageAreaData={setPageAreaData}
                handleSubmit={handleCreateGroup}
                setIsGroupName={setIsGroupName}
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

export default Groups;
