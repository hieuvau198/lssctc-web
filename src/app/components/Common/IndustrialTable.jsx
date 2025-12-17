/**
 * IndustrialTable - Industrial Theme Table Wrapper
 * Table with yellow header, sharp borders and industrial styling
 */
import React from 'react';
import { Table, Pagination, Empty } from 'antd';
import { useTranslation } from 'react-i18next';

export default function IndustrialTable({
    columns,
    dataSource,
    rowKey = 'id',
    loading = false,
    pagination = true,
    page = 1,
    pageSize = 10,
    total,
    onPageChange,
    emptyText,
    scroll,
    size = 'middle',
    className = '',
}) {
    const { t } = useTranslation();

    if (!loading && (!dataSource || dataSource.length === 0)) {
        return (
            <div className="py-12">
                <Empty
                    description={emptyText || t('common.noData', 'No data available')}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div className={`industrial-table ${className}`}>
            <style>{`
                .industrial-table .ant-table {
                    border: 2px solid #000 !important;
                }
                .industrial-table .ant-table-thead > tr > th {
                    background: #fef08a !important;
                    border-bottom: 2px solid #000 !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    font-size: 12px !important;
                    letter-spacing: 0.05em !important;
                    color: #000 !important;
                }
                .industrial-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #e5e5e5 !important;
                }
                .industrial-table .ant-table-tbody > tr:hover > td {
                    background: #fef9c3 !important;
                }
                .industrial-table .ant-table-tbody > tr:last-child > td {
                    border-bottom: none !important;
                }
                .industrial-table .ant-pagination-item-active {
                    background: #facc15 !important;
                    border-color: #000 !important;
                }
                .industrial-table .ant-pagination-item-active a {
                    color: #000 !important;
                    font-weight: 700 !important;
                }
            `}</style>

            <div className="overflow-auto">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={rowKey}
                    loading={loading}
                    pagination={false}
                    scroll={scroll || { y: 400 }}
                    size={size}
                />
            </div>

            {pagination && total > 0 && (
                <div className="pt-4 border-t-2 border-neutral-200 flex justify-center mt-4">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '50']}
                        onChange={(p, ps) => onPageChange?.(p, ps)}
                        showTotal={(total, range) => (
                            <span className="text-sm font-medium text-neutral-600">
                                {range[0]}-{range[1]} / {total}
                            </span>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
