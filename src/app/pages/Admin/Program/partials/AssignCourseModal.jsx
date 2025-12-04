import React, { useState, useCallback } from 'react';
import { Button, Modal, App, Empty, Spin, Table, Tag, Pagination } from 'antd';
import { Plus } from 'lucide-react';
import { addCourseToProgram } from '../../../../apis/ProgramManager/ProgramManagerCourseApi';
import { fetchCoursesPaged, fetchCoursesByProgram } from '../../../../apis/ProgramManager/CourseApi';

const AssignCourseModal = ({ program, existingCourseIds = [], onAssigned }) => {
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
                message.info('All courses on this page are already assigned');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            message.error('Failed to load available courses');
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
            message.warning('Please select at least one course to assign');
            return;
        }

        setAssignLoading(true);
        try {
            // Assign each selected course one by one
            for (const courseId of selectedCourseIds) {
                await addCourseToProgram(program.id, courseId);
            }
            message.success(`Successfully assigned ${selectedCourseIds.length} course(s) to program`);
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

    // Table columns
    const columns = [
        {
            title: 'Course Name',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 280,
            render: (desc) => desc || '-',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            align: 'center',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
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

    return (
        <>
            <div className="flex justify-end mb-4">
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={handleOpen}
                >
                    Assign Course
                </Button>
            </div>
            <Modal
                title="Assign Courses to Program"
                open={isModalVisible}
                onCancel={handleClose}
                width={900}
                centered
                footer={[
                    <Button key="cancel" onClick={handleClose}>
                        Cancel
                    </Button>,
                    <Button
                        key="assign"
                        type="primary"
                        icon={<Plus size={16} />}
                        loading={assignLoading}
                        disabled={selectedCourseIds.length === 0}
                        onClick={handleAssign}
                    >
                        Assign Selected ({selectedCourseIds.length})
                    </Button>,
                ]}
            >
                {loading ? (
                    <div className="flex justify-center items-center h-[500px] py-8">
                        <Spin size="large" />
                    </div>
                ) : allCourses.length === 0 ? (
                    <Empty description="No available courses to assign. All courses are already assigned to this program." />
                ) : (
                    <div className="flex flex-col h-[500px]">
                        {/* Table with fixed height, scrollable */}
                        <div className="flex-1 overflow-hidden">
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={allCourses}
                                rowKey="id"
                                size="small"
                                pagination={false}
                                scroll={{ y: 400 }}
                            />
                        </div>
                        {/* Pagination fixed at bottom */}
                        <div className="border-t border-t-gray-400 pt-3 mt-3 flex justify-center">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalCount}
                                onChange={handlePageChange}
                                showTotal={(total) => `Total ${total} courses`}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default AssignCourseModal;
