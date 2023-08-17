import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import './table.css';

export interface IColumnType<T> {
    key: string;
    title?: string | JSX.Element;
    width?: string | number;
    render?: (column: IColumnType<T>, item: T) => void;
}

interface Props<T> {
    data: T[];
    columns: any;
    className?: string;
    isSidebarTable?: boolean;
    isAuditHistoryTable?: boolean;
    isTransactionDetailsTable?: boolean;
}
export default function Table<T>({
                                     data,
                                     columns,
                                     className,
                                     isSidebarTable,
                                     isAuditHistoryTable,
                                     isTransactionDetailsTable,
                                 }: Props<T>): JSX.Element {
    return (
        <div className={`${isTransactionDetailsTable ? '' : 'w-[100%]'}`}>
            <table
                className={`${isSidebarTable ? '' : 'tableSection'} ${
                    className as string
                }`}
            >
                <thead className="sticky top-0 z-10">
                <TableHeader
                    isTransactionDetailsTable={isTransactionDetailsTable}
                    isAuditHistoryTable={isAuditHistoryTable}
                    isSidebarTable={isSidebarTable}
                    columns={columns}
                />
                </thead>
                <tbody className="relative">
                <TableRow
                    isTransactionDetailsTable={isTransactionDetailsTable}
                    isAuditHistoryTable={isAuditHistoryTable}
                    isSidebarTable={isSidebarTable}
                    data={data}
                    columns={columns}
                />
                </tbody>
            </table>
        </div>
    );
}
