import { ChangeEvent, useMemo, useState } from 'react';
import {
    Layout,
    PrimaryButton,
    Select,
    Table,
    Pagination,
} from '../../components/Common';
import { IColumnType } from '../../components/Common/Table/Table';
import SvgIcon from '../../components/Common/Icon/SvgIcon';

interface IAuditData {
    id: string;
    time_stamp: string;
    user: string;
    merchant_id: string;
    session_id: string;
    page_modified: string;
    page_name: string;
    comment: string;
}

const auditData = [
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
    {
        id: '098756780',
        time_stamp: '1 Month Ago',
        user: 'felicia.reid@example.com',
        merchant_id: '098756780',
        session_id: '098756780',
        page_modified: 'George Daly',
        page_name: 'Groups',
        comment: 'Lorem ipsum dolor sit amet consectetur.',
    },
];
const options = [
    { id: '', name: 'Filter...' },
    { id: 'v1', name: 'Delete' },
];
const Audit = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState<number>(10);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * pageLimit;
        const lastPageIndex = firstPageIndex + pageLimit;
        return auditData?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, pageLimit]);

    const columns: IColumnType<IAuditData>[] = [
        {
            key: 'id',
            title: (
                <div className="flex justify-center items-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">ID</div>
                </div>
            ),
            width: 100,
        },
        {
            key: 'time_stamp',
            title: (
                <div className="flex justify-center items-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Time Stamp</div>
                </div>
            ),
            width: 80,
        },

        {
            key: 'user',
            title: (
                <div className="flex justify-center items-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">User</div>
                </div>
            ),
            width: 100,
        },
        {
            key: 'merchant_id',
            title: (
                <div className="flex justify-center items-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Merchant Id</div>
                </div>
            ),
            width: 80,
        },
        {
            key: 'session_id',
            title: (
                <div className="flex justify-center items-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Session ID</div>
                </div>
            ),
            width: 80,
        },
        {
            key: 'page_modified',
            title: (
                <div className="flex justify-center items-center">
                    <SvgIcon icon="SORT_ICON" />
                    <div className="ml-2">Page Modified</div>
                </div>
            ),
            width: 80,
        },
        {
            key: 'page_name',
            title: (
                <div className="flex justify-center">
                    <div>Page Name</div>
                </div>
            ),
            width: 70,
        },
        {
            key: 'comment',
            title: (
                <div className="flex  ">
                    <div>Comment</div>
                </div>
            ),
            width: 300,
        },
    ];

    const handleOnSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setPageLimit(parseInt(e.target.value));
    };
    return (
        <Layout>
            <div className="px-8 py-5">
                <div className="flex items-center justify-between w-full mb-8">
                    <div className="font-extrabold text-center text-2xl text-[#131119]">
                        Audit
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-[290px]">
                            <Select
                                isGroup
                                options={options}
                                handleOnSelect={(e) => {
                                    console.log(e);
                                }}
                                label="userList"
                                className="w-full max-w-[290px]"
                            />
                        </div>
                        <div className="w-[144px]">
                            <PrimaryButton
                                // onClick={openDrawer}
                                type="button"
                                name="Export"
                                color="#8FB131"
                                variant="filled"
                                className="w-full font-medium !h-[43px] "
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center w-full max-w-full max-h-[550px] !overflow-y-scroll !overflow-x-scroll">
                        <Table
                            data={currentTableData}
                            columns={columns}
                            className="w-full"
                        />
                    </div>
                    <div className="mt-2">
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={auditData?.length}
                            pageSize={pageLimit}
                            onPageChange={(page) => setCurrentPage(page)}
                            siblingCount={1}
                            setCurrentPage={setCurrentPage}
                            handleOnSelect={handleOnSelect}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default Audit;
