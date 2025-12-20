import React from "react";
import { Table, Pagination } from "antd";

/**
 * IndustrialTable - Reusable table component with Industrial Theme styling
 * 
 * Uses yellow header background with black text (consistent with User Management)
 * 
 * @param {Object} props
 * @param {Array} columns - Ant Design Table columns array
 * @param {Array} dataSource - Data array for the table
 * @param {boolean} loading - Loading state
 * @param {Object} pagination - Pagination config { current, pageSize, total, onChange }
 * @param {string} rowKey - Key for each row
 * @param {React.ReactNode} emptyContent - Custom empty state content
 * @param {number} scrollY - Vertical scroll height
 * @param {string} className - Additional className
 */
const IndustrialTable = ({
  columns,
  dataSource = [],
  loading = false,
  pagination,
  rowKey = "key",
  emptyContent,
  scrollY = 400,
  className = "",
  ...rest
}) => {
  const isEmpty = !dataSource.length && !loading;

  return (
    <div className={`industrial-table-wrapper ${className}`}>
      {/* Industrial Table Styles */}
      <style>{`
        .industrial-table-wrapper .ant-table {
          border: none !important;
        }
        .industrial-table-wrapper .ant-table-thead > tr > th {
          background: #fef08a !important;
          border-bottom: 2px solid #000 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
          letter-spacing: 0.05em !important;
          color: #000 !important;
        }
        .industrial-table-wrapper .ant-table-thead > tr > th::before {
          display: none !important;
        }
        .industrial-table-wrapper .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e5e5e5 !important;
        }
        .industrial-table-wrapper .ant-table-tbody > tr:hover > td {
          background: #fef9c3 !important;
        }
        .industrial-table-wrapper .ant-pagination-item-active {
          background: #facc15 !important;
          border-color: #000 !important;
          border-width: 2px !important;
        }
        .industrial-table-wrapper .ant-pagination-item-active a {
          color: #000 !important;
          font-weight: 700 !important;
        }
        .industrial-table-wrapper .ant-pagination-item {
          border: 1px solid #d4d4d4 !important;
          border-radius: 0 !important;
        }
        .industrial-table-wrapper .ant-pagination-item:hover {
          border-color: #000 !important;
        }
        .industrial-table-wrapper .ant-pagination-prev button,
        .industrial-table-wrapper .ant-pagination-next button {
          border: 1px solid #d4d4d4 !important;
          border-radius: 0 !important;
        }
        .industrial-table-wrapper .ant-pagination-prev:hover button,
        .industrial-table-wrapper .ant-pagination-next:hover button {
          border-color: #000 !important;
        }
      `}</style>

      <div className="min-h-[350px] overflow-auto">
        {isEmpty && emptyContent ? (
          emptyContent
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey={rowKey}
            loading={loading}
            scroll={rest.scroll || { y: scrollY }}
            {...rest}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="pt-4 pb-4 border-t-2 border-neutral-200 bg-white flex justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "50"]}
            showTotal={(total, range) => (
              <span className="text-sm font-medium text-neutral-600">
                {range[0]}-{range[1]} / {total}{pagination.label ? ` ${pagination.label}` : ''}
              </span>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default IndustrialTable;

