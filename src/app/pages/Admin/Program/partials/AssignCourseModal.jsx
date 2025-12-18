import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, App, Empty, Table, Pagination } from 'antd';
import { Plus, X, BookOpen, Layers } from 'lucide-react';
import { addCourseToProgram } from '../../../../apis/ProgramManager/ProgramManagerCourseApi';
import { fetchCoursesPaged, fetchCoursesByProgram } from '../../../../apis/ProgramManager/CourseApi';

const AssignCourseModal = ({ program, existingCourseIds = [], onAssigned }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedCourseIds, setSelectedCourseIds] = useState([]);
    const [assignLoading, setAssignLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [assignedCourseIds, setAssignedCourseIds] = useState(new Set());

    // Fetch assigned courses once when modal opens
    const fetchAssignedCourses = useCallback(async () => {
        try {
            const assignedCoursesData = await fetchCoursesByProgram(program.id);
            const assignedCourses = assignedCoursesData.items || [];
            setAssignedCourseIds(new Set(assignedCourses.map((c) => c.id)));
        } catch (e) {
            console.log('No courses assigned to program yet');
            setAssignedCourseIds(new Set());
        }
    }, [program.id]);

    // Fetch available courses with pagination
    const fetchAvailableCourses = useCallback(async (page, size) => {
        setLoading(true);
        try {
            const allCoursesData = await fetchCoursesPaged({ pageNumber: page, pageSize: size });
            const allCoursesList = allCoursesData.items || [];

            // Filter out assigned courses
            const availableCourses = allCoursesList.filter(course => !assignedCourseIds.has(course.id));

            setAllCourses(availableCourses);
            setTotalCount(allCoursesData.totalCount || 0);

            if (availableCourses.length === 0 && allCoursesList.length > 0) {
                message.info(t('admin.programs.assignCourse.allAssigned'));
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            message.error(t('admin.programs.assignCourse.loadError'));
            setAllCourses([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [assignedCourseIds, message]);

    // Open modal and fetch courses
    const handleOpen = async () => {
        setIsModalVisible(true);
        setSelectedCourseIds([]);
        setCurrentPage(1);
        await fetchAssignedCourses();
        fetchAvailableCourses(1, pageSize);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchAvailableCourses(page, pageSize);
    };

    // Close modal
    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedCourseIds([]);
        setCurrentPage(1);
    };

    // Assign selected courses
    const handleAssign = async () => {
        if (selectedCourseIds.length === 0) {
            message.warning(t('admin.programs.assignCourse.selectWarning'));
            return;
        }

        setAssignLoading(true);
        try {
            // Assign each selected course one by one
            for (const courseId of selectedCourseIds) {
                await addCourseToProgram(program.id, courseId);
            }
            message.success(t('admin.programs.assignCourse.assignSuccess', { count: selectedCourseIds.length }));
            setIsModalVisible(false);
            setSelectedCourseIds([]);
            onAssigned?.(); // Callback to reload parent list
        } catch (e) {
            console.error('Error assigning courses:', e);
            let errorMsg = 'Failed to assign courses';
            if (e.response?.data?.error?.details?.exceptionMessage) {
                errorMsg = e.response.data.error.details.exceptionMessage;
            } else if (e.response?.data?.error?.message) {
                errorMsg = e.response.data.error.message;
            } else if (e.response?.data?.message) {
                errorMsg = e.response.data.message;
            } else if (e.message) {
                errorMsg = e.message;
            }
            message.error(errorMsg);
        } finally {
            setAssignLoading(false);
        }
    };

    // Table columns with Industrial styling
    const columns = [
        {
            title: t('admin.programs.assignCourse.columns.courseName'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (name) => (
                <span className="font-semibold text-black hover:text-yellow-600 transition-colors cursor-pointer">
                    {name}
                </span>
            ),
        },
        {
            title: t('admin.programs.assignCourse.columns.description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 280,
            render: (desc) => <span className="text-neutral-600">{desc || '-'}</span>,
        },
        {
            title: t('common.status'),
            dataIndex: 'isActive',
            key: 'isActive',
            width: 150,
            align: 'center',
            render: (isActive) => (
                <span className={`px-2 py-1 text-xs font-bold uppercase border ${isActive
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                    }`}>
                    {isActive ? t('common.active') : t('common.inactive')}
                </span>
            ),
        },
    ];

    // Row selection config
    const rowSelection = {
        selectedRowKeys: selectedCourseIds,
        onChange: (selectedRowKeys) => {
            setSelectedCourseIds(selectedRowKeys);
        },
    };

    if (!program) return null;

    // Custom Modal Title
    const modalTitle = (
        <div className="flex items-center gap-3 pb-3 border-b-2 border-yellow-400 -mx-6 px-6 -mt-1">
            <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                <Layers className="w-5 h-5 text-black" />
            </div>
            <div>
                <h3 className="text-lg font-bold uppercase tracking-wider m-0">
                    {t('admin.programs.assignCourse.modalTitle')}
                </h3>
                <p className="text-xs text-neutral-500 m-0">{program.name}</p>
            </div>
        </div>
    );

    // Custom Footer
    const modalFooter = (
        <div className="flex items-center justify-between pt-4 border-t-2 border-neutral-200 -mx-6 px-6 -mb-2">
            <span className="text-sm text-neutral-500">
                {selectedCourseIds.length > 0 && (
                    <span className="font-semibold text-yellow-600">
                        {selectedCourseIds.length} course(s) selected
                    </span>
                )}
            </span>
            <div className="flex items-center gap-3">
                <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-700 font-medium text-sm border border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 transition-all"
                >
                    <X className="w-4 h-4" />
                    {t('common.cancel')}
                </button>
                <button
                    onClick={handleAssign}
                    disabled={selectedCourseIds.length === 0 || assignLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold text-sm border border-yellow-500 hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                    {assignLoading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    {t('admin.programs.assignCourse.assignSelected', { count: selectedCourseIds.length })}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Industrial Modal Styles */}
            <style>{`
                .industrial-assign-modal .ant-modal-content {
                    border-radius: 0 !important;
                    border: 2px solid #000 !important;
                }
                .industrial-assign-modal .ant-modal-header {
                    border-radius: 0 !important;
                    border-bottom: none !important;
                    padding-bottom: 0 !important;
                }
                .industrial-assign-modal .ant-modal-close {
                    top: 16px !important;
                    right: 16px !important;
                }
                .industrial-assign-modal .ant-modal-close-x {
                    width: 32px !important;
                    height: 32px !important;
                    line-height: 32px !important;
                    border: 2px solid #000 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .industrial-assign-modal .ant-modal-close-x:hover {
                    background: #fef08a !important;
                }
                .industrial-assign-modal .ant-modal-footer {
                    border-top: none !important;
                    padding-top: 0 !important;
                }
                
                /* Table Industrial Styles */
                .industrial-assign-table .ant-table-thead > tr > th {
                    background: #fef08a !important;
                    border-bottom: 2px solid #000 !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    font-size: 11px !important;
                    letter-spacing: 0.05em !important;
                    color: #000 !important;
                    padding: 12px 16px !important;
                }
                .industrial-assign-table .ant-table-thead > tr > th::before {
                    display: none !important;
                }
                .industrial-assign-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #e5e5e5 !important;
                    padding: 12px 16px !important;
                    transition: all 0.2s ease !important;
                }
                .industrial-assign-table .ant-table-tbody > tr:hover > td {
                    background: #fef9c3 !important;
                }
                .industrial-assign-table .ant-table-tbody > tr.ant-table-row-selected > td {
                    background: #fef08a !important;
                }
                .industrial-assign-table .ant-checkbox-inner {
                    border-radius: 0 !important;
                    border: 2px solid #000 !important;
                }
                .industrial-assign-table .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: #facc15 !important;
                    border-color: #000 !important;
                }
                .industrial-assign-table .ant-checkbox-checked .ant-checkbox-inner::after {
                    border-color: #000 !important;
                }
                
                /* Pagination Industrial Styles */
                .industrial-pagination .ant-pagination-item {
                    border: 1px solid #d4d4d4 !important;
                    border-radius: 0 !important;
                }
                .industrial-pagination .ant-pagination-item:hover {
                    border-color: #000 !important;
                }
                .industrial-pagination .ant-pagination-item-active {
                    background: #facc15 !important;
                    border-color: #000 !important;
                    border-width: 2px !important;
                }
                .industrial-pagination .ant-pagination-item-active a {
                    color: #000 !important;
                    font-weight: 700 !important;
                }
                .industrial-pagination .ant-pagination-prev button,
                .industrial-pagination .ant-pagination-next button {
                    border: 1px solid #d4d4d4 !important;
                    border-radius: 0 !important;
                }
            `}</style>

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold text-sm border border-yellow-500 hover:bg-yellow-500 transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                    <Plus size={16} />
                    {t('admin.programs.assignCourse.button')}
                </button>
            </div>

            <Modal
                title={modalTitle}
                open={isModalVisible}
                onCancel={handleClose}
                width={900}
                centered
                footer={modalFooter}
                className="industrial-assign-modal"
                closeIcon={<X className="w-4 h-4" />}
            >
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-[500px] py-8">
                        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-neutral-500 font-medium">Loading courses...</p>
                    </div>
                ) : allCourses.length === 0 ? (
                    <div className="h-[500px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
                            <BookOpen className="w-10 h-10 text-neutral-400" />
                        </div>
                        <p className="text-neutral-600 font-bold uppercase">{t('admin.programs.assignCourse.noAvailable')}</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-[500px]">
                        {/* Table with fixed height, scrollable */}
                        <div className="flex-1 overflow-hidden industrial-assign-table">
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={allCourses}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 380 }}
                            />
                        </div>
                        {/* Pagination fixed at bottom */}
                        <div className="border-t-2 border-neutral-200 pt-4 mt-4 flex justify-center industrial-pagination">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalCount}
                                onChange={handlePageChange}
                                showTotal={(total) => (
                                    <span className="text-sm font-medium text-neutral-600">
                                        Total <span className="font-bold text-black">{total}</span> courses
                                    </span>
                                )}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AssignCourseModal;
