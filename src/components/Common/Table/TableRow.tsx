import { get } from '../../../data/utils/common';

import { IColumnType } from './Table';
import './table.css';

interface Props<T> {
    data: T[];
    columns: IColumnType<T>[];
    isSidebarTable?: boolean;
    isAuditHistoryTable?: boolean;
    isTransactionDetailsTable?: boolean;
}

export function TableRow<T>({
                                data,
                                columns,
                                isSidebarTable,
                                isAuditHistoryTable,
                                isTransactionDetailsTable,
                            }: Props<T>): JSX.Element {
    return (
        <>
            {!!data?.length &&
            data.map((item: any, itemIndex) => (
                <tr
                    key={`table-body-${itemIndex}`}
                    className={`border border-solid border-l-0 border-t-0 last:border-b-0 border-r-0 border-[#E3E3E3] tableCell ${
                        isAuditHistoryTable
                            ? 'border border-solid border-l-0 border-t-0 last:border-b-0 border-r-0 border-[#BDD864] bg-[#F8FBEA] tableCell'
                            : ''
                    } `}
                >
                    {columns.map((column, columnIndex) => {
                        const value = get(item, column.key, {});

                        return (
                            <td
                                key={`table-row-cell-${columnIndex}`}
                                className={`!text-center ${
                                    isSidebarTable
                                        ? 'border-none pl-7 !text-start'
                                        : isAuditHistoryTable
                                        ? 'border border-solid border-l-0 border-t-0 last:border-r-0 border-b-0 border-[#BDD864] tableRow'
                                        : isTransactionDetailsTable
                                            ? 'border border-solid  border-[#E3E3E3] tableRow'
                                            : 'border border-solid border-l-0 border-t-0 last:border-r-0 border-b-0 border-[#E3E3E3] tableRow'
                                } `}
                            >
                                {column.render
                                    ? column.render(column, item)
                                    : value}
                            </td>
                        );
                    })}
                </tr>
            ))}
            {!data?.length && (
                <tr>
                    <td colSpan={6} className="py-4 text-center">
                        No Data Found
                    </td>
                </tr>
            )}
        </>
    );
}
