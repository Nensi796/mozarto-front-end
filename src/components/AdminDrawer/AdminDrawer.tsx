import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react';
import classNames from 'classnames';
import {
    PrimaryButton,
    PrimaryInput,
    PrimaryTextArea,
    Select,
    Table,
    UserDrawer,
} from '../Common';
import SvgIcon from '../Common/Icon/SvgIcon';
import {
    type IPagePermissions,
    type IBrandsPermissions,
    ICompanyData,
    IGroup,
    IPermissionData,
} from '../../data/common';
import { IColumnType } from '../Common/Table/Table';
import {
    getAllBrands,
    getAllPageAreas,
    getPermissions,
} from '../../services/api/api';
import { showToast } from '../../data/utils/toast';
import {
    IGetAllBrandData,
    IGetAllPageAreasData,
} from '../../data/types/response';
import LoadingSpinner from '../Common/Loader/Loader';

interface IDrawerProps {
    isEditUser?: boolean;
    company?: ICompanyData;
    editUserData?: any;
    isEditGroupDrawer?: boolean;
    isEditCompanyDrawer?: boolean;
    editGroup?: IGroup;
    setEditGroup?: Dispatch<SetStateAction<IGroup>>;
    isOpen: boolean;
    openDrawer: () => void;
    accessAreaData?: IBrandsPermissions[];
    setAccessAreaData?: Dispatch<SetStateAction<IBrandsPermissions[]>>;
    pageAreaData?: IPagePermissions[];
    setPageAreaData?: Dispatch<SetStateAction<IPagePermissions[]>>;
    isUser?: boolean;
    handleSubmit: () => void;
    setIsGroupName?: Dispatch<SetStateAction<string>>;
    isGroupName?: string;
    isError?: boolean;
    validationErrors?: {
        [p: string]: string | number;
    };
    handleOnChange?: (
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
        key: string
    ) => void;
    isCompany?: boolean;
    groups?: IGroup[];
}

const AdminDrawer = ({
    isEditUser,
    company,
    editUserData,
    isEditCompanyDrawer,
    isEditGroupDrawer,
    editGroup,
    setEditGroup,
    isOpen,
    openDrawer,
    accessAreaData = [],
    setAccessAreaData,
    pageAreaData = [],
    setPageAreaData,
    isUser,
    handleSubmit,
    setIsGroupName,
    isGroupName,
    isError,
    validationErrors,
    handleOnChange,
    isCompany,
    groups,
}: IDrawerProps) => {
    const [allBrandData, setAllBrandData] = useState<IGetAllBrandData[] | null>(
        null
    );
    const [permissionsData, setPermissionsData] =
        useState<IPermissionData | null>(null);

    const [allPageAreaData, setAllPageAreaData] = useState<
        IGetAllPageAreasData[] | null
    >(null);

    const [selectedGroup, setSelectedGroup] = useState<IGroup>();

    const getGroupPermissions = () => {
        getPermissions(editUserData?.permissionId)
            .then((result) => {
                setPermissionsData(result);
                if (setPageAreaData) {
                    setPageAreaData(result?.permission?.pageAreasPermissions);
                }
                if (setAccessAreaData) {
                    setAccessAreaData(result?.permission?.brandsPermissions);
                }
            })
            .catch((err) => {
                showToast(
                    err?.errors?.[0]?.message || 'something went wrong',
                    'error'
                );
            });
    };

    useEffect(() => {
        if (isCompany && isOpen) return;
        if (editUserData?.permissionId) {
            getGroupPermissions();
        }
        if (isOpen) {
            getAllBrands()
                .then((result) => {
                    setAllBrandData(result?.brands);
                })
                .catch((err) => {
                    showToast(
                        err?.errors?.[0]?.message || 'something went wrong',
                        'error'
                    );
                });

            getAllPageAreas()
                .then((result) => {
                    setAllPageAreaData(result?.pageAreas);
                })
                .catch((err) => {
                    showToast(
                        err?.errors?.[0]?.message || 'something went wrong',
                        'error'
                    );
                });
        }
    }, [isCompany, isOpen, editUserData, selectedGroup]);

    const isDisabled = useMemo(() => {
        if (isUser && selectedGroup?.name !== 'No-Groups') {
            return true;
        }
        if (isUser && selectedGroup?.name === 'No-Groups') {
            return false;
        }
        if (isUser && selectedGroup?.name === 'Select group') {
            if (setAccessAreaData) {
                setAccessAreaData([]);
            }
            if (setPageAreaData) {
                setPageAreaData([]);
            }
            return true;
        }

        return false;
    }, [selectedGroup?.name, isUser]);

    const getOptions = useMemo(() => {
        if (groups && groups[0]?.name !== 'Select group') {
            groups.unshift({
                createdAt: '',
                name: 'Select group',
                updatedAt: '',
                _id: '1',
                permissionId: 'isPermission',
                __v: 0,
                isDeleted: false,
                permission: {
                    _id: 'isPermission',
                    pageAreasPermissions: [],
                    brandsPermissions: [],
                    createdAt: '',
                    updatedAt: '',
                    __v: 0,
                },
            });

            if (isUser && isEditUser)
                groups?.push({
                    isDeleted: false,
                    createdAt: '',
                    name: 'No-Groups',
                    updatedAt: '',
                    _id: '2',
                    permissionId: '',
                    __v: 0,
                    permission: {
                        _id: 'No-Groups',
                        pageAreasPermissions: [],
                        brandsPermissions: [],
                        createdAt: '',
                        updatedAt: '',
                        __v: 0,
                    },
                });
        }

        return groups;
    }, [groups]);

    useEffect(() => {
        if (selectedGroup?.name === 'No-Groups') {
            if (setPageAreaData) {
                setPageAreaData([]);
            }
            if (setAccessAreaData) {
                setAccessAreaData([]);
            }
        }
    }, [selectedGroup]);
    const sideBarTableColumns: IColumnType<IGetAllPageAreasData>[] = [
        {
            key: 'name',
            width: 70,
            title: 'PageAreas',
            render: (_, i) => {
                return (
                    <div className="flex items-center gap-x-1">
                        <PrimaryInput
                            disabled={isDisabled}
                            isCheckbox
                            type="checkbox"
                            checked={
                                (selectedGroup?.name !== 'Select group' &&
                                    pageAreaData
                                        ?.map((item) => item?.pageAccessId)
                                        ?.includes(i?._id)) ||
                                false ||
                                (selectedGroup?.name !== 'Select group' &&
                                    selectedGroup?.permission?.pageAreasPermissions
                                        .map(
                                            (item: IPagePermissions) =>
                                                item?.pageAccessId
                                        )
                                        .includes(i?._id)) ||
                                false ||
                                (selectedGroup?.name !== 'No-Groups' &&
                                    selectedGroup?.name !== 'Select group' &&
                                    !isEditGroupDrawer &&
                                    permissionsData?.permission?.pageAreasPermissions
                                        ?.map((items) => items?.pageAccessId)
                                        ?.includes(i?._id)) ||
                                false ||
                                (isEditGroupDrawer &&
                                    editGroup?.permission?.pageAreasPermissions
                                        ?.map(
                                            (item: IPagePermissions) =>
                                                item?.pageAccessId
                                        )
                                        ?.includes(i?._id)) ||
                                false
                            }
                            onChange={() => {
                                const isChecked = pageAreaData?.find(
                                    (item) => item?.pageAccessId === i?._id
                                );
                                const isEdit =
                                    editGroup?.permission?.pageAreasPermissions?.find(
                                        (item: IPagePermissions) =>
                                            item?.pageAccessId === i?._id
                                    );
                                if (
                                    isEditGroupDrawer &&
                                    !isEdit &&
                                    !isChecked
                                ) {
                                    if (setEditGroup && editGroup) {
                                        setEditGroup({
                                            ...editGroup,
                                            permission: {
                                                ...editGroup.permission,
                                                pageAreasPermissions: [
                                                    ...editGroup.permission
                                                        .pageAreasPermissions,
                                                    {
                                                        pageAccessId: i?._id,
                                                        isRead: true,
                                                        isWrite: true,
                                                    },
                                                ],
                                            },
                                        });
                                    }
                                }
                                if (
                                    isEditGroupDrawer &&
                                    isEdit &&
                                    isEdit?.pageAccessId === i?._id
                                ) {
                                    if (setEditGroup && editGroup) {
                                        setEditGroup({
                                            ...editGroup,
                                            permission: {
                                                ...editGroup.permission,
                                                pageAreasPermissions:
                                                    editGroup?.permission?.pageAreasPermissions?.filter(
                                                        (ite) =>
                                                            ite?.pageAccessId !==
                                                            i?._id
                                                    ) || [],
                                            },
                                        });
                                    }
                                }

                                if (
                                    isChecked &&
                                    !isEditGroupDrawer &&
                                    (isChecked?.isRead || isChecked?.isWrite)
                                ) {
                                    const checkList =
                                        pageAreaData &&
                                        pageAreaData.filter(
                                            (item) =>
                                                item?.pageAccessId !== i?._id
                                        );
                                    if (setPageAreaData) {
                                        setPageAreaData(checkList);
                                    }
                                } else if (
                                    (setPageAreaData && !isEditGroupDrawer) ||
                                    selectedGroup?.name === 'No-Groups'
                                ) {
                                    if (setPageAreaData) {
                                        setPageAreaData([
                                            ...pageAreaData,
                                            {
                                                pageAccessId: i?._id,
                                                isRead: true,
                                                isWrite: true,
                                            } as IPagePermissions,
                                        ]);
                                    }
                                }
                            }}
                        />
                        <div className="flex items-center text-sm">
                            {i?.name}
                        </div>
                    </div>
                );
            },
        },

        {
            key: 'read',
            width: 10,
            title: 'Read',
            render: (_, i) => {
                return (
                    <PrimaryInput
                        disabled={isDisabled}
                        checked={
                            isDisabled
                                ? (selectedGroup?.name !== 'Select group' &&
                                      selectedGroup?.permission.pageAreasPermissions?.find(
                                          (item: IPagePermissions) =>
                                              item?.pageAccessId === i?._id
                                      )?.isRead) ||
                                  (selectedGroup?.name !== 'Select group' &&
                                      permissionsData?.permission?.pageAreasPermissions?.find(
                                          (value) =>
                                              value?.pageAccessId === i?._id
                                      )?.isRead)
                                : (!isEditGroupDrawer &&
                                      selectedGroup?.name !== 'Select group' &&
                                      pageAreaData?.find(
                                          (item) =>
                                              item?.pageAccessId === i?._id
                                      )?.isRead) ||
                                  (isEditGroupDrawer &&
                                      editGroup?.permission?.pageAreasPermissions?.find(
                                          (items: IPagePermissions) =>
                                              items?.pageAccessId === i?._id
                                      )?.isRead) ||
                                  false
                        }
                        onChange={() => {
                            const record =
                                pageAreaData &&
                                pageAreaData.find(
                                    (item) => item?.pageAccessId === i?._id
                                );
                            const editRecord =
                                editGroup?.permission?.pageAreasPermissions?.find(
                                    (value: IPagePermissions) =>
                                        value?.pageAccessId === i?._id
                                );
                            if (isEditGroupDrawer) {
                                const editData =
                                    editGroup?.permission
                                        ?.pageAreasPermissions &&
                                    editGroup.permission?.pageAreasPermissions.map(
                                        (item: IPagePermissions) => {
                                            if (
                                                editRecord &&
                                                editRecord?.isRead &&
                                                item?.pageAccessId === i?._id &&
                                                !editRecord?.isWrite
                                            ) {
                                                return {
                                                    ...item,
                                                    pageAccessId: '',
                                                    isRead: false,
                                                    isWrite: false,
                                                } as IPagePermissions;
                                            }
                                            if (
                                                editRecord &&
                                                editRecord?.isRead &&
                                                item?.pageAccessId === i?._id &&
                                                editRecord?.isWrite
                                            ) {
                                                return {
                                                    ...item,
                                                    pageAccessId: i?._id,
                                                    isRead: false,
                                                    isWrite: true,
                                                } as IPagePermissions;
                                            }
                                            if (
                                                editRecord &&
                                                !editRecord?.isRead &&
                                                item?.pageAccessId === i?._id &&
                                                editRecord?.isWrite
                                            ) {
                                                return {
                                                    ...item,
                                                    pageAccessId: i?._id,
                                                    isRead: true,
                                                    isWrite: true,
                                                } as IPagePermissions;
                                            }
                                            return item;
                                        }
                                    );

                                if (
                                    setEditGroup &&
                                    isEditGroupDrawer &&
                                    editGroup
                                ) {
                                    setEditGroup({
                                        ...editGroup,
                                        permission: {
                                            ...editGroup.permission,
                                            pageAreasPermissions:
                                                editData?.filter(
                                                    (items) =>
                                                        items?.pageAccessId !==
                                                        ''
                                                ) as IPagePermissions[],
                                        },
                                    });
                                }
                                if (!editRecord && isEditGroupDrawer) {
                                    if (setEditGroup && editGroup) {
                                        setEditGroup({
                                            ...editGroup,
                                            permission: {
                                                ...editGroup.permission,
                                                pageAreasPermissions: [
                                                    ...editGroup.permission
                                                        .pageAreasPermissions,
                                                    {
                                                        pageAccessId: i?._id,
                                                        isRead: true,
                                                        isWrite: false,
                                                    },
                                                ],
                                            },
                                        });
                                    }
                                }
                            }
                            const updated =
                                !isEditGroupDrawer &&
                                pageAreaData &&
                                pageAreaData.map((ite) => {
                                    if (
                                        record &&
                                        record?.isRead &&
                                        ite?.pageAccessId ===
                                            record?.pageAccessId &&
                                        !record?.isWrite
                                    ) {
                                        return {
                                            ...record,
                                            pageAccessId: '',
                                            isRead: false,
                                            isWrite: false,
                                        } as IPagePermissions;
                                    }
                                    if (
                                        record &&
                                        record.isRead &&
                                        ite?.pageAccessId ===
                                            record?.pageAccessId
                                    ) {
                                        return {
                                            ...record,
                                            isRead: false,
                                        } as IPagePermissions;
                                    }
                                    if (
                                        record &&
                                        !record.isRead &&
                                        ite?.pageAccessId ===
                                            record?.pageAccessId
                                    ) {
                                        return {
                                            ...ite,
                                            isRead: true,
                                        } as IPagePermissions;
                                    }

                                    return ite;
                                });

                            if (setPageAreaData && !isEditGroupDrawer) {
                                setPageAreaData(
                                    (updated as IPagePermissions[]).filter(
                                        (item) => item?.pageAccessId !== ''
                                    )
                                );
                            }

                            if (!record) {
                                if (setPageAreaData) {
                                    setPageAreaData([
                                        ...pageAreaData,
                                        {
                                            pageAccessId: i?._id,
                                            isRead: true,
                                            isWrite: false,
                                        } as IPagePermissions,
                                    ]);
                                }
                            }
                        }}
                        value={i?.name}
                        name="read"
                        isCheckbox
                        type="checkbox"
                    />
                );
            },
        },
        {
            key: 'write',
            width: 10,
            title: 'write',
            render: (_, i) => (
                <PrimaryInput
                    disabled={isDisabled}
                    checked={
                        isDisabled
                            ? (selectedGroup?.name !== 'Select group' &&
                                  selectedGroup?.permission?.pageAreasPermissions?.find(
                                      (item: IPagePermissions) =>
                                          item?.pageAccessId === i?._id
                                  )?.isWrite) ||
                              (selectedGroup?.name !== 'Select group' &&
                                  permissionsData?.permission?.pageAreasPermissions?.find(
                                      (value) => value?.pageAccessId === i?._id
                                  )?.isWrite)
                            : (!isEditGroupDrawer &&
                                  pageAreaData?.find(
                                      (item) => item?.pageAccessId === i?._id
                                  )?.isWrite) ||
                              (isEditGroupDrawer &&
                                  editGroup?.permission?.pageAreasPermissions?.find(
                                      (item) => item?.pageAccessId === i?._id
                                  )?.isWrite) ||
                              false
                    }
                    onChange={() => {
                        const record =
                            pageAreaData &&
                            pageAreaData.find(
                                (item) => item?.pageAccessId === i?._id
                            );
                        const editRecords =
                            editGroup?.permission?.pageAreasPermissions?.find(
                                (value: IPagePermissions) =>
                                    value?.pageAccessId === i?._id
                            );
                        if (isEditGroupDrawer) {
                            const editGroupData =
                                editGroup?.permission?.pageAreasPermissions &&
                                editGroup.permission?.pageAreasPermissions.map(
                                    (item: IPagePermissions) => {
                                        if (
                                            editRecords &&
                                            editRecords?.isWrite &&
                                            item?.pageAccessId === i?._id &&
                                            !editRecords?.isRead
                                        ) {
                                            return {
                                                ...item,
                                                pageAccessId: '',
                                                isRead: false,
                                                isWrite: false,
                                            } as IPagePermissions;
                                        }
                                        if (
                                            editRecords &&
                                            editRecords?.isRead &&
                                            item?.pageAccessId === i?._id &&
                                            editRecords?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                pageAccessId: i?._id,
                                                isRead: true,
                                                isWrite: false,
                                            } as IPagePermissions;
                                        }
                                        if (
                                            editRecords &&
                                            editRecords?.isRead &&
                                            item?.pageAccessId === i?._id &&
                                            !editRecords?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                pageAccessId: i?._id,
                                                isRead: true,
                                                isWrite: true,
                                            } as IPagePermissions;
                                        }
                                        return item;
                                    }
                                );
                            if (
                                setEditGroup &&
                                isEditGroupDrawer &&
                                editGroup
                            ) {
                                setEditGroup({
                                    ...editGroup,
                                    permission: {
                                        ...editGroup.permission,
                                        pageAreasPermissions:
                                            editGroupData?.filter(
                                                (items) =>
                                                    items?.pageAccessId !== ''
                                            ) as IPagePermissions[],
                                    },
                                });
                            }
                            if (!editRecords && isEditGroupDrawer) {
                                if (setEditGroup && editGroup) {
                                    setEditGroup({
                                        ...editGroup,
                                        permission: {
                                            ...editGroup.permission,
                                            pageAreasPermissions: [
                                                ...editGroup.permission
                                                    .pageAreasPermissions,
                                                {
                                                    pageAccessId: i?._id,
                                                    isRead: false,
                                                    isWrite: true,
                                                },
                                            ],
                                        },
                                    });
                                }
                            }
                        }
                        const updated =
                            pageAreaData &&
                            pageAreaData.map((ite) => {
                                if (
                                    record &&
                                    record?.isWrite &&
                                    ite?.pageAccessId ===
                                        record?.pageAccessId &&
                                    !record.isRead
                                ) {
                                    return {
                                        ...record,
                                        pageAccessId: '',
                                        isRead: false,
                                        isWrite: false,
                                    } as IPagePermissions;
                                }
                                if (
                                    record &&
                                    record?.isWrite &&
                                    ite?.pageAccessId === record?.pageAccessId
                                ) {
                                    return {
                                        ...record,
                                        isWrite: false,
                                    } as IPagePermissions;
                                }
                                if (
                                    record &&
                                    !record.isWrite &&
                                    ite?.pageAccessId === record?.pageAccessId
                                ) {
                                    return {
                                        ...ite,
                                        isWrite: true,
                                    } as IPagePermissions;
                                }

                                return ite;
                            });
                        if (setPageAreaData) {
                            setPageAreaData(
                                updated.filter(
                                    (item) => item?.pageAccessId !== ''
                                )
                            );
                        }

                        if (!record) {
                            if (setPageAreaData) {
                                setPageAreaData([
                                    ...pageAreaData,
                                    {
                                        pageAccessId: i?._id,
                                        isRead: false,
                                        isWrite: true,
                                    } as IPagePermissions,
                                ]);
                            }
                        }
                    }}
                    value={i?.name}
                    name="write"
                    isCheckbox
                    type="checkbox"
                />
            ),
        },
    ];

    const sideBarSecondTableColumns: IColumnType<IGetAllBrandData>[] = [
        {
            key: 'name',
            width: 70,
            title: 'Access',
            render: (_, i) => (
                <div className="flex gap-x-1">
                    <PrimaryInput
                        disabled={isDisabled}
                        checked={
                            (selectedGroup?.name !== 'Select group' &&
                                accessAreaData
                                    ?.map((item) => item?.brandId)
                                    ?.includes(i?._id)) ||
                            false ||
                            (selectedGroup?.name !== 'Select group' &&
                                selectedGroup?.permission?.brandsPermissions
                                    .map(
                                        (item: IBrandsPermissions) =>
                                            item?.brandId
                                    )
                                    .includes(i?._id)) ||
                            false ||
                            (selectedGroup?.name !== 'No-Groups' &&
                                selectedGroup?.name !== 'Select group' &&
                                !isEditGroupDrawer &&
                                permissionsData?.permission?.brandsPermissions
                                    ?.map((value) => value?.brandId)
                                    ?.includes(i?._id)) ||
                            false ||
                            (isEditGroupDrawer &&
                                editGroup?.permission?.brandsPermissions
                                    ?.map(
                                        (item: IBrandsPermissions) =>
                                            item?.brandId
                                    )
                                    ?.includes(i?._id))
                        }
                        onChange={() => {
                            const isChecked = accessAreaData?.find(
                                (item) => item?.brandId === i?._id
                            );
                            const isEditBrandRecord =
                                editGroup?.permission?.brandsPermissions?.find(
                                    (item: IBrandsPermissions) =>
                                        item?.brandId === i?._id
                                );
                            if (
                                isEditGroupDrawer &&
                                !isEditBrandRecord &&
                                !isChecked
                            ) {
                                if (setEditGroup && editGroup) {
                                    setEditGroup({
                                        ...editGroup,
                                        permission: {
                                            ...editGroup.permission,
                                            brandsPermissions: [
                                                ...editGroup.permission
                                                    .brandsPermissions,
                                                {
                                                    brandId: i?._id,
                                                    isRead: true,
                                                    isWrite: true,
                                                },
                                            ],
                                        },
                                    });
                                }
                            }
                            if (
                                isEditGroupDrawer &&
                                isEditBrandRecord &&
                                isEditBrandRecord?.brandId === i?._id
                            ) {
                                if (setEditGroup && editGroup) {
                                    setEditGroup({
                                        ...editGroup,
                                        permission: {
                                            ...editGroup.permission,
                                            brandsPermissions:
                                                editGroup?.permission?.brandsPermissions?.filter(
                                                    (ite) =>
                                                        ite?.brandId !== i?._id
                                                ) || [],
                                        },
                                    });
                                }
                            }
                            if (
                                isChecked &&
                                !isEditGroupDrawer &&
                                (isChecked?.isRead || isChecked?.isWrite)
                            ) {
                                const checkList =
                                    accessAreaData &&
                                    accessAreaData.filter(
                                        (item) => item?.brandId !== i?._id
                                    );
                                if (setAccessAreaData) {
                                    setAccessAreaData(checkList);
                                }
                            } else if (
                                (setAccessAreaData && !isEditGroupDrawer) ||
                                selectedGroup?.name === 'No-Groups'
                            ) {
                                if (setAccessAreaData) {
                                    setAccessAreaData([
                                        ...accessAreaData,
                                        {
                                            brandId: i?._id,
                                            isRead: true,
                                            isWrite: true,
                                        } as IBrandsPermissions,
                                    ]);
                                }
                            }
                        }}
                        value={i?.name}
                        isCheckbox
                        name="title"
                        className="bor"
                        type="checkbox"
                    />
                    <div>{i.name}</div>
                </div>
            ),
        },

        {
            key: 'read',
            width: 10,
            title: 'Read',
            render: (_, i) => (
                <PrimaryInput
                    disabled={isDisabled}
                    checked={
                        isDisabled
                            ? (selectedGroup?.name !== 'Select group' &&
                                  selectedGroup?.permission?.brandsPermissions?.find(
                                      (item: IBrandsPermissions) =>
                                          item?.brandId === i?._id
                                  )?.isRead) ||
                              (selectedGroup?.name !== 'Select group' &&
                                  permissionsData?.permission?.brandsPermissions?.find(
                                      (value) => value?.brandId === i?._id
                                  )?.isRead)
                            : (!isEditGroupDrawer &&
                                  accessAreaData?.find(
                                      (item) => item?.brandId === i?._id
                                  )?.isRead) ||
                              (isEditGroupDrawer &&
                                  editGroup?.permission?.brandsPermissions?.find(
                                      (items: IBrandsPermissions) =>
                                          items?.brandId === i?._id
                                  )?.isRead) ||
                              false
                    }
                    onChange={() => {
                        const record =
                            accessAreaData &&
                            accessAreaData.find(
                                (item) => item?.brandId === i?._id
                            );
                        const brandRecord =
                            editGroup?.permission?.brandsPermissions?.find(
                                (value: IBrandsPermissions) =>
                                    value?.brandId === i?._id
                            );
                        if (isEditGroupDrawer) {
                            const editBrandData =
                                editGroup?.permission?.brandsPermissions &&
                                editGroup.permission?.brandsPermissions.map(
                                    (item) => {
                                        if (
                                            brandRecord &&
                                            brandRecord?.isRead &&
                                            item?.brandId === i?._id &&
                                            !brandRecord?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                brandId: '',
                                                isRead: false,
                                                isWrite: false,
                                            } as IBrandsPermissions;
                                        }
                                        if (
                                            brandRecord &&
                                            brandRecord?.isRead &&
                                            item?.brandId === i?._id &&
                                            brandRecord?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                brandId: i?._id,
                                                isRead: false,
                                                isWrite: true,
                                            } as IBrandsPermissions;
                                        }
                                        if (
                                            brandRecord &&
                                            !brandRecord?.isRead &&
                                            item?.brandId === i?._id &&
                                            brandRecord?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                brandId: i?._id,
                                                isRead: true,
                                                isWrite: true,
                                            } as IBrandsPermissions;
                                        }
                                        return item;
                                    }
                                );

                            if (
                                setEditGroup &&
                                isEditGroupDrawer &&
                                editGroup
                            ) {
                                setEditGroup({
                                    ...editGroup,
                                    permission: {
                                        ...editGroup.permission,
                                        brandsPermissions:
                                            editBrandData?.filter(
                                                (items) => items?.brandId !== ''
                                            ) as IBrandsPermissions[],
                                    },
                                });
                            }
                            if (
                                !brandRecord &&
                                isEditGroupDrawer &&
                                editGroup
                            ) {
                                if (setEditGroup) {
                                    setEditGroup({
                                        ...editGroup,
                                        permission: {
                                            ...editGroup.permission,
                                            brandsPermissions: [
                                                ...editGroup.permission
                                                    .brandsPermissions,
                                                {
                                                    brandId: i?._id,
                                                    isRead: true,
                                                    isWrite: false,
                                                },
                                            ],
                                        },
                                    });
                                }
                            }
                        }
                        const updated =
                            !isEditGroupDrawer &&
                            accessAreaData &&
                            accessAreaData.map((ite) => {
                                if (
                                    record &&
                                    record?.isRead &&
                                    ite.brandId === record?.brandId &&
                                    !record?.isWrite
                                ) {
                                    return {
                                        ...record,
                                        brandId: '',
                                        isRead: false,
                                        isWrite: false,
                                    } as IBrandsPermissions;
                                }
                                if (
                                    record &&
                                    record.isRead &&
                                    ite?.brandId === record?.brandId
                                ) {
                                    return {
                                        ...record,
                                        isRead: false,
                                    } as IBrandsPermissions;
                                }
                                if (
                                    record &&
                                    !record.isRead &&
                                    ite?.brandId === record?.brandId
                                ) {
                                    return {
                                        ...ite,
                                        isRead: true,
                                    } as IBrandsPermissions;
                                }

                                return ite;
                            });
                        if (setAccessAreaData && !isEditGroupDrawer) {
                            setAccessAreaData(
                                (updated as IBrandsPermissions[]).filter(
                                    (item) => item?.brandId !== ''
                                )
                            );
                        }

                        if (!record) {
                            if (setAccessAreaData) {
                                setAccessAreaData([
                                    ...accessAreaData,
                                    {
                                        brandId: i._id,
                                        isRead: true,
                                        isWrite: false,
                                    } as IBrandsPermissions,
                                ]);
                            }
                        }
                    }}
                    value={i?.name}
                    name="read"
                    isCheckbox
                    type="checkbox"
                />
            ),
        },
        {
            key: 'write',
            width: 10,
            title: 'write',
            render: (_, i) => (
                <PrimaryInput
                    disabled={isDisabled}
                    checked={
                        isDisabled
                            ? (selectedGroup?.name !== 'Select group' &&
                                  selectedGroup?.permission?.brandsPermissions?.find(
                                      (item) => item?.brandId === i?._id
                                  )?.isWrite) ||
                              (selectedGroup?.name !== 'Select group' &&
                                  permissionsData?.permission?.brandsPermissions?.find(
                                      (value) => value?.brandId === i?._id
                                  )?.isWrite)
                            : (!isEditGroupDrawer &&
                                  accessAreaData?.find(
                                      (item) => item?.brandId === i?._id
                                  )?.isWrite) ||
                              (isEditGroupDrawer &&
                                  editGroup?.permission?.brandsPermissions?.find(
                                      (item) => item?.brandId === i?._id
                                  )?.isWrite) ||
                              false
                    }
                    onChange={() => {
                        const record =
                            accessAreaData &&
                            accessAreaData.find(
                                (item) => item?.brandId === i._id
                            );
                        const isBrandExist =
                            editGroup?.permission?.brandsPermissions?.find(
                                (value) => value?.brandId === i?._id
                            );
                        if (isEditGroupDrawer) {
                            const editGroupData =
                                editGroup?.permission?.brandsPermissions &&
                                editGroup.permission.brandsPermissions.map(
                                    (item) => {
                                        if (
                                            isBrandExist &&
                                            isBrandExist?.isWrite &&
                                            item?.brandId === i?._id &&
                                            !isBrandExist?.isRead
                                        ) {
                                            return {
                                                ...item,
                                                brandId: '',
                                                isRead: false,
                                                isWrite: false,
                                            } as IBrandsPermissions;
                                        }
                                        if (
                                            isBrandExist &&
                                            isBrandExist?.isRead &&
                                            item?.brandId === i?._id &&
                                            isBrandExist?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                brandId: i?._id,
                                                isRead: true,
                                                isWrite: false,
                                            } as IBrandsPermissions;
                                        }
                                        if (
                                            isBrandExist &&
                                            isBrandExist?.isRead &&
                                            item?.brandId === i?._id &&
                                            !isBrandExist?.isWrite
                                        ) {
                                            return {
                                                ...item,
                                                brandId: i?._id,
                                                isRead: true,
                                                isWrite: true,
                                            } as IBrandsPermissions;
                                        }
                                        return item;
                                    }
                                );
                            if (
                                setEditGroup &&
                                isEditGroupDrawer &&
                                editGroup
                            ) {
                                setEditGroup({
                                    ...editGroup,
                                    permission: {
                                        ...editGroup?.permission,
                                        brandsPermissions:
                                            editGroupData?.filter(
                                                (items) => items?.brandId !== ''
                                            ) as IBrandsPermissions[],
                                    },
                                });
                            }
                            if (
                                !isBrandExist &&
                                isEditGroupDrawer &&
                                editGroup
                            ) {
                                if (setEditGroup) {
                                    setEditGroup({
                                        ...editGroup,
                                        permission: {
                                            ...editGroup.permission,
                                            brandsPermissions: [
                                                ...editGroup.permission
                                                    .brandsPermissions,
                                                {
                                                    brandId: i?._id,
                                                    isRead: false,
                                                    isWrite: true,
                                                },
                                            ],
                                        },
                                    });
                                }
                            }
                        }
                        const updated =
                            accessAreaData &&
                            accessAreaData.map((ite) => {
                                if (
                                    record &&
                                    record.isWrite &&
                                    ite?.brandId === record?.brandId &&
                                    !record.isRead
                                ) {
                                    return {
                                        ...record,
                                        brandId: '',
                                        isRead: false,
                                        isWrite: false,
                                    } as IBrandsPermissions;
                                }
                                if (
                                    record &&
                                    record.isWrite &&
                                    ite?.brandId === record?.brandId
                                ) {
                                    return {
                                        ...record,
                                        isWrite: false,
                                    } as IBrandsPermissions;
                                }
                                if (
                                    record &&
                                    !record.isWrite &&
                                    ite?.brandId === record?.brandId
                                ) {
                                    return {
                                        ...ite,
                                        isWrite: true,
                                    } as IBrandsPermissions;
                                }

                                return ite;
                            });
                        if (setAccessAreaData) {
                            setAccessAreaData(
                                updated.filter((item) => item?.brandId !== '')
                            );
                        }

                        if (!record) {
                            if (setAccessAreaData) {
                                setAccessAreaData([
                                    ...accessAreaData,
                                    {
                                        brandId: i?._id,
                                        isRead: false,
                                        isWrite: true,
                                    } as IBrandsPermissions,
                                ]);
                            }
                        }
                    }}
                    value={i?.name}
                    name="write"
                    isCheckbox
                    type="checkbox"
                />
            ),
        },
    ];

    return (
        <UserDrawer
            drawerSize={400}
            isOpen={isOpen}
            toggleDrawer={openDrawer}
            drawerDirection="right"
            className="bg-pink-100 max-h-[100vh] overflow-y-scroll"
        >
            {isCompany ? (
                <div className="p-5">
                    {' '}
                    <div className="flex items-center justify-between">
                        <div className="my-0 text-xl font-black text-green-100">
                            {isEditCompanyDrawer
                                ? 'Update Company'
                                : 'Create Company'}
                        </div>
                        <SvgIcon
                            style={{ cursor: 'pointer' }}
                            icon="CLOSE_BUTTON"
                            onClick={openDrawer}
                        />
                    </div>
                    <div className="mt-5">
                        <PrimaryInput
                            className={classNames(
                                'text-gray-400',
                                validationErrors?.companyName
                                    ? 'bg-red-100 border-0 '
                                    : 'text-gray-400 bg-gray-200'
                            )}
                            label={
                                <span
                                    className={classNames(
                                        'text-gray-400',
                                        validationErrors?.companyName
                                            ? 'text-red-200 border-0 '
                                            : 'text-gray-400 '
                                    )}
                                >
                                    Company Name
                                </span>
                            }
                            type="text"
                            placeholder="Enter Company Name"
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleOnChange ? handleOnChange(e, 'name') : ''
                            }
                            value={company?.name}
                            isError={isError}
                        />
                        <div className="mb-1 text-sm font-medium text-red-200">
                            {validationErrors
                                ? validationErrors?.companyName
                                : ''}
                        </div>
                        <div className="mt-5">
                            <PrimaryTextArea
                                className={classNames(
                                    'text-gray-400',
                                    validationErrors?.description
                                        ? '!bg-red-100 !border-0 '
                                        : 'text-gray-400 bg-gray-200'
                                )}
                                label={
                                    <span
                                        className={classNames(
                                            'text-gray-400',
                                            validationErrors?.description
                                                ? 'text-red-200 border-0 '
                                                : 'text-gray-400 '
                                        )}
                                    >
                                        Company Description
                                    </span>
                                }
                                type="text"
                                placeholder="Company Description"
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                    handleOnChange
                                        ? handleOnChange(e, 'description')
                                        : ''
                                }
                                value={company?.description}
                                isError={isError}
                                cols={3}
                                rows={4}
                            />
                        </div>
                        <div className="mb-1 text-sm font-medium text-red-200">
                            {validationErrors
                                ? validationErrors?.description
                                : ''}
                        </div>
                    </div>
                    <div className="mt-4">
                        <PrimaryButton
                            onClick={handleSubmit}
                            isDrawerButton
                            className="w-full"
                            color="#2E672F"
                            variant="filled"
                            name={
                                company?._id && isEditCompanyDrawer
                                    ? 'Update Company'
                                    : 'Create New Company'
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div className="my-0 text-xl font-black text-green-100">
                            {isUser
                                ? isEditUser
                                    ? 'Update User'
                                    : 'Add new users'
                                : isEditGroupDrawer
                                ? 'Update Groups'
                                : 'Create Groups'}
                        </div>
                        <SvgIcon
                            style={{ cursor: 'pointer' }}
                            icon="CLOSE_BUTTON"
                            onClick={openDrawer}
                        />
                    </div>
                    {isUser ? (
                        <>
                            <div className="mt-5">
                                <div>
                                    <PrimaryInput
                                        value={editUserData?.name}
                                        className={classNames(
                                            'text-gray-400',
                                            validationErrors?.name
                                                ? 'bg-red-100 border-0 '
                                                : 'text-gray-400 bg-gray-200'
                                        )}
                                        label={
                                            <span
                                                className={classNames(
                                                    'text-gray-400',
                                                    validationErrors?.name
                                                        ? ' !text-red-200'
                                                        : 'text-gray-400'
                                                )}
                                            >
                                                Full name
                                            </span>
                                        }
                                        type="text"
                                        placeholder="Enter Username"
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleOnChange
                                                ? handleOnChange(e, 'name')
                                                : ''
                                        }
                                        isError={isError}
                                    />
                                    <div className="mb-1 text-sm font-medium text-red-200">
                                        {validationErrors
                                            ? validationErrors?.name
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <div>
                                    <PrimaryInput
                                        value={editUserData?.email}
                                        className={classNames(
                                            'text-gray-400',
                                            validationErrors?.email
                                                ? 'bg-red-100 border-0 '
                                                : 'text-gray-400 bg-gray-200'
                                        )}
                                        label={
                                            <span
                                                className={classNames(
                                                    'text-gray-400',
                                                    validationErrors?.email
                                                        ? ' !text-red-200'
                                                        : 'text-gray-400 '
                                                )}
                                            >
                                                Enter Email
                                            </span>
                                        }
                                        type="email"
                                        placeholder="Enter Email"
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleOnChange
                                                ? handleOnChange(e, 'email')
                                                : ''
                                        }
                                        isError={isError}
                                    />
                                    <div className="mb-1 text-sm font-medium text-red-200">
                                        {validationErrors
                                            ? validationErrors?.email
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <div>
                                    <PrimaryInput
                                        value={editUserData?.phone}
                                        className={classNames(
                                            'text-gray-400',
                                            validationErrors?.phone
                                                ? 'bg-red-100 border-0 '
                                                : 'text-gray-400 bg-gray-200'
                                        )}
                                        label={
                                            <span
                                                className={classNames(
                                                    'text-gray-400',
                                                    validationErrors?.phone
                                                        ? ' !text-red-200'
                                                        : 'text-gray-400 '
                                                )}
                                            >
                                                Phone
                                            </span>
                                        }
                                        type="tel"
                                        placeholder="Phone"
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleOnChange
                                                ? handleOnChange(e, 'phone')
                                                : ''
                                        }
                                        isError={isError}
                                    />
                                    <div className="mb-1 text-sm font-medium text-red-200">
                                        {validationErrors
                                            ? validationErrors?.phone
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <div>
                                    <PrimaryInput
                                        value={editUserData?.job}
                                        className={classNames(
                                            'text-gray-400',
                                            validationErrors?.job
                                                ? 'bg-red-100 border-0 '
                                                : 'text-gray-400 bg-gray-200'
                                        )}
                                        label={
                                            <span
                                                className={classNames(
                                                    'text-gray-400',
                                                    validationErrors?.job
                                                        ? ' !text-red-200'
                                                        : 'text-gray-400 '
                                                )}
                                            >
                                                Job
                                            </span>
                                        }
                                        type="text"
                                        placeholder=" Select job Title"
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) =>
                                            handleOnChange
                                                ? handleOnChange(e, 'job')
                                                : ''
                                        }
                                        isError={isError}
                                    />
                                    <div className="mb-1 text-sm font-medium text-red-200">
                                        {validationErrors
                                            ? validationErrors?.job
                                            : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <Select
                                    editUser={editUserData?.group}
                                    isGroup
                                    placeHolder="Select Groups"
                                    options={(getOptions as IGroup[]) || []}
                                    handleOnSelect={(
                                        e: ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        if (e.target.value === '2') {
                                            setPermissionsData(null);
                                            if (setAccessAreaData) {
                                                setAccessAreaData([]);
                                            }
                                            if (setPageAreaData) {
                                                setPageAreaData([]);
                                            }
                                        }
                                        const group = groups?.find(
                                            (item) =>
                                                item._id === e.target.value
                                        );
                                        if (e.target.value === '1') {
                                            if (setAccessAreaData) {
                                                setAccessAreaData([]);
                                            }
                                            if (setPageAreaData) {
                                                setPageAreaData([]);
                                            }
                                        }

                                        // if (groupRecord) {
                                        //     setSelectedGroup(groupRecord);
                                        // }

                                        setSelectedGroup(group);
                                        if (handleOnChange) {
                                            handleOnChange(e, 'group');
                                        }
                                    }}
                                    label="userList"
                                    className="w-full"
                                />
                            </div>{' '}
                        </>
                    ) : (
                        !isEditUser && (
                            <div className="mt-5">
                                <div>
                                    <div>
                                        <PrimaryInput
                                            className={classNames(
                                                'text-gray-400',
                                                validationErrors?.groupName
                                                    ? 'bg-red-100 border-0 '
                                                    : 'text-gray-400 bg-gray-200'
                                            )}
                                            label={
                                                <span
                                                    className={classNames(
                                                        'text-gray-400',
                                                        validationErrors?.groupName
                                                            ? ' !text-red-200'
                                                            : 'text-gray-400 '
                                                    )}
                                                >
                                                    Name of Group
                                                </span>
                                            }
                                            type="text"
                                            value={
                                                isEditGroupDrawer
                                                    ? editGroup?.name
                                                    : isGroupName
                                            }
                                            placeholder="Customer Service.."
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                isEditGroupDrawer &&
                                                setEditGroup
                                                    ? setEditGroup({
                                                          ...(editGroup as IGroup),
                                                          name: e.target.value,
                                                      })
                                                    : setIsGroupName &&
                                                      setIsGroupName(
                                                          e.target.value
                                                      )
                                            }
                                            isError={isError}
                                        />
                                        <div className="mb-1 text-sm font-medium text-red-200">
                                            {validationErrors
                                                ? validationErrors?.groupName
                                                : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                    <div className="mt-5">
                        {isUser ? (
                            !allBrandData ? (
                                <LoadingSpinner />
                            ) : (
                                <Table
                                    isSidebarTable
                                    data={allBrandData || []}
                                    columns={sideBarSecondTableColumns}
                                    className="w-full"
                                />
                            )
                        ) : !allPageAreaData ? (
                            <LoadingSpinner />
                        ) : (
                            <div>
                                {' '}
                                <Table
                                    isSidebarTable
                                    data={allPageAreaData || []}
                                    columns={sideBarTableColumns}
                                    className="w-full"
                                />
                                <div className="mb-1 text-sm font-medium text-red-200">
                                    {validationErrors
                                        ? validationErrors?.pageAreasPermissions
                                        : ''}
                                </div>
                            </div>
                        )}
                    </div>{' '}
                    <div className="mt-3">
                        {isUser ? (
                            !allPageAreaData ? (
                                <LoadingSpinner />
                            ) : (
                                <Table
                                    isSidebarTable
                                    data={allPageAreaData || []}
                                    columns={sideBarTableColumns}
                                    className="w-full"
                                />
                            )
                        ) : !allBrandData ? (
                            <LoadingSpinner />
                        ) : (
                            <div>
                                <Table
                                    isSidebarTable
                                    data={allBrandData || []}
                                    columns={sideBarSecondTableColumns}
                                    className="w-full"
                                />
                                <div className="mb-1 text-sm font-medium text-red-200">
                                    {validationErrors
                                        ? validationErrors?.brandsPermissions
                                        : ''}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <PrimaryButton
                            onClick={() => handleSubmit()}
                            isDrawerButton
                            className="w-full"
                            color="#2E672F"
                            variant="filled"
                            name={
                                isUser
                                    ? isEditUser
                                        ? 'Update User'
                                        : 'Create a New User'
                                    : isEditGroupDrawer
                                    ? 'Update Group'
                                    : 'Create New Group'
                            }
                        />
                    </div>
                </div>
            )}
        </UserDrawer>
    );
};

export default AdminDrawer;
