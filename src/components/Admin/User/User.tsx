import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
    IBrandsPermissions,
    ICreateUserData,
    IGroup,
    IPagePermissions,
} from '../../../data/common';
import { IColumnType } from '../../Common/Table/Table';
import SvgIcon from '../../Common/Icon/SvgIcon';
import AdminDrawer from '../../AdminDrawer/AdminDrawer';
import {
    deleteUser,
    getGroupData,
    getUserByCompany,
    inviteUser,
    updateUser,
} from '../../../services/api/api';
import { showToast } from '../../../data/utils/toast';
import { getDateFormat, validate } from '../../../data/utils/common';
import LoadingSpinner from '../../Common/Loader/Loader';

export interface IData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    job: string;
    createdAt: string;
}

const options = [
    { id: '', name: 'Bulk Changes...' },
    { id: 'v1', name: 'Delete' },
];

const User = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState<number>(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [pageAreaData, setPageAreaData] = useState<IPagePermissions[]>([]);
    const [accessAreaData, setAccessAreaData] = useState<IBrandsPermissions[]>(
        []
    );
    const[userLoading,setUserLoading] = useState(false);
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [userData, setUserData] = useState<ICreateUserData>();
    const [isError, setIsError] = useState<boolean>(false);
    const [validationErrors, setValidationError] = useState<{
        [p: string]: string | number;
    }>({});
    const [users, setUsers] = useState<IData[]>([]);
    const [checkedUsers, setCheckedUsers] = useState<string[]>([]);
    const [deleteId, setDeleteId] = useState<string>('');
    const [isEditUser, setIsEditUser] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const isAllChecked = users?.length === checkedUsers?.length;
    const [allGroups, setAllGroups] = useState<IGroup[]>([]);
    const [editGroupDetails, setEditGroupDetails] = useState<IGroup>({
        _id: '',
        permissionId: '',
        createdAt: '',
        name: '',
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

        updatedAt: '',
    });

    const getGroups = () => {
        getGroupData()
            .then((res) => {
                setAllGroups(res?.groups);
            })
            .catch((err) => {
                showToast(
                    err?.errors?.[0]?.message || 'something went wrong',
                    'error'
                );
            });
    };

    useEffect(() => {
        getGroups();
    }, []);

    const getUsers = () => {
        setUserLoading(true);
        getUserByCompany({
            sort: { fieldName: 'name', order: -1 },
            companyId: '64801a1b5476329156573a0c',
            offset: 0,
            // limit: 6,
        })
            .then((res) => {
                setUsers(res?.users);
                setUserLoading(false)
            })
            .catch((err) => {
                setUserLoading(false)
                showToast(
                    err?.errors?.[0]?.message || 'something went wrong',
                    'error'
                );
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const columns: IColumnType<ICreateUserData>[] = [
        {
            key: 'checked',
            width: 20,
            title: (
                <div className="flex justify-center">
                    <PrimaryInput
                        onChange={() => {
                            if (isAllChecked) {
                                setCheckedUsers([]);
                            } else {
                                setCheckedUsers(
                                    users?.map((item) => item?._id)
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
                            checkedUsers?.find((item) => item === i._id) ===
                            i._id
                        }
                        onChange={() => {
                            if (checkedUsers?.includes(i._id) || isAllChecked) {
                                setCheckedUsers(
                                    checkedUsers?.filter(
                                        (item) => item !== i?._id
                                    )
                                );
                            } else {
                                setCheckedUsers([...checkedUsers, i?._id]);
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
            key: 'email',
            title: (
                <div className="flex justify-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Email</div>
                </div>
            ),
            width: 200,
        },

        {
            key: 'job',
            title: (
                <div className="flex justify-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Job</div>
                </div>
            ),
            width: 200,
        },

        {
            key: 'phone',
            title: (
                <div className="flex justify-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Phone</div>
                </div>
            ),
            width: 200,
        },

        {
            key: 'createdAt',
            title: (
                <div className="flex justify-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Date</div>
                </div>
            ),
            render: (_, i) => (
                <div>{getDateFormat(i?.createdAt as string)}</div>
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
                        setIsEditUser(true);
                        setUserData(i);
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
                        setOpenDeleteModal(true);
                        setDeleteId(i?._id);
                        console.log(i);
                    }}
                    icon="DELETE_ICON"
                />
            ),
        },
    ];

    const handleDelete = () => {
        setOpenDeleteModal(false);
        deleteUser({ userId: deleteId })
            .then(() => {
                getUsers();
                showToast('Successfully Deleted');
            })
            .catch((err) => {
                showToast(
                    err?.errors?.[0]?.message || 'something went wrong',
                    'error'
                );
            });
    };
    console.log('validationErrors', validationErrors);
    const handleCreateNewUser = () => {
        if (isEditUser && userData) {
            const groupPermissionId = allGroups?.find(
                (item) => item?._id === userData?.group
            )?.permissionId;

            const errors: {
                [p: string]: string | number;
            } = {};
            const payload: {
                [key: string]: string;
            } = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                job: userData.job,
                // group: userData.group,
                company: '64801a1b5476329156573a0c' as string,
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
                const editUserPayload = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    job: userData.job,
                    role: 'USER',
                    isCustomGroup: false,
                    group: userData.group,
                    company: '64801a1b5476329156573a0c' as string,
                };
                const editUserForNoGroups = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    job: userData.job,
                    role: 'USER',
                    // group: userData.group,
                    permissionId: userData.permissionId,
                    brandsPermissions: accessAreaData,
                    pageAreasPermissions: pageAreaData,
                    company: '64801a1b5476329156573a0c' as string,
                };

                updateUser(
                    userData._id,
                    userData?.group === '2'
                        ? { ...editUserForNoGroups, isCustomGroup: true }
                        : editUserPayload
                )
                    .then(() => {
                        getUsers();
                        setIsOpen(false);

                        showToast('Successfully Updated');
                    })
                    .catch((err) => {
                        showToast(
                            err?.message || 'something went wrong',
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
                name: userData?.name as string,
                email: userData?.email as string,
                phone: userData?.phone as string,
                job: userData?.job as string,
                group: userData?.group as string,
                company: '64801a1b5476329156573a0c' as string,
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
                const UserData = {
                    name: userData?.name as string,
                    email: userData?.email as string,
                    phone: userData?.phone as string,
                    job: userData?.job as string,
                    role: 'USER',
                    isCustomGroup: false,
                    group: userData?.group as string,
                    company: '64801a1b5476329156573a0c' as string,
                };
                setValidationError({});
                setIsError(false);
                inviteUser(UserData)
                    .then((result) => {
                        // localStorage.setItem('token', result.token);
                        getUsers();
                        setIsOpen(false);
                        showToast(result?.message, 'success');
                    })
                    .catch((err: any) => {
                        showToast(err.message || 'you can not invite', 'error');
                    });
            }
        }
    };

    console.log('accessAreaData', accessAreaData, pageAreaData);

    const currentTableData = useMemo(
        () =>
            users?.slice(
                currentPage * pageLimit - pageLimit,
                currentPage * pageLimit
            ),
        [users, currentPage, pageLimit]
    );

    const openDrawer = () => {
        setUserData({
            createdBy: '',
            isCustomGroup: false,
            permissionId: '',
            updatedAt: '',
            updatedBy: '',
            _id: '',
            company: '',
            createdAt: '',
            email: '',
            group: '',
            job: '',
            name: '',
            phone: '',
            role: '',
        });

        setValidationError({});
        setAccessAreaData([]);
        setPageAreaData([]);
        setIsEditUser(false);
        setIsOpen(!isOpen);
    };

    const handleOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        if (currentTableData?.length < parseInt(e.target.value)) {
            setCurrentPage(1);
        }
        setPageLimit(parseInt(e.target.value));
    };

    const handleOnChange = useCallback(
        (
            e: ChangeEvent<
                HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >,
            key: string
        ) => {
            if (!key) return;

            setUserData((prevLoginData) => ({
                ...(prevLoginData as ICreateUserData),
                [key]: e.target.value,
            }));
        },
        []
    );
    console.log('userData', userData);

    useEffect(() => {
        if (isOpen) {
            getGroupData()
                .then((res) => {
                    setGroups(res?.groups);
                })
                .catch((err) => {
                    showToast(
                        err?.errors?.[0]?.message || 'something went wrong',
                        'error'
                    );
                });
        }
    }, [isOpen]);

    return (
        <div className="px-8 py-5">
            <div className="mb-8 flex w-full items-center justify-between">
                <div className="font-extrabold text-center text-2xl text-[#131119]">
                    Existing Users
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
                            name="Add New User"
                            color="#8FB131"
                            variant="filled"
                            className="w-full font-medium"
                        />
                    </div>
                </div>
            </div>
            {userLoading? (
                <div className="mt-5">
                    <LoadingSpinner />
                </div>
            ) : (
                <div>
                    <div className="min-[1300px]:max-h-[360px] md:max-h-[200px] !overflow-y-scroll !overflow-x-scroll">
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
                            totalCount={users?.length}
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
                editGroup={editGroupDetails}
                setEditGroup={setEditGroupDetails}
                isEditUser={isEditUser}
                editUserData={userData}
                isError={isError}
                validationErrors={validationErrors}
                groups={groups}
                isUser
                accessAreaData={accessAreaData}
                isOpen={isOpen}
                openDrawer={openDrawer}
                pageAreaData={pageAreaData}
                setAccessAreaData={setAccessAreaData}
                setPageAreaData={setPageAreaData}
                handleSubmit={handleCreateNewUser}
                handleOnChange={handleOnChange}
            />
            {openDeleteModal && (
                <Modal setIsOpen={setOpenDeleteModal} title="Delete">
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
                                onClick={() => setOpenDeleteModal(false)}
                                className="!bg-white !text-black !border !border-solid !border-[#8FB131]"
                                color="#8FB131"
                                variant="filled"
                                name="Cancel"
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default User;
