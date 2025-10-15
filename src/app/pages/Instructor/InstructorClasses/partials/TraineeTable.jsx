import React, { useState, useEffect } from 'react';
import { Table, Tag, Avatar, Input, Button, Skeleton, Pagination } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { getClassMembers } from '../../../../apis/Instructor/InstructorSectionApi';

// Mock data for trainees
const mockTrainees = [
  {
    id: 1,
    studentId: 'STU001',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    enrollmentDate: '2025-09-20T10:00:00',
    status: 'enrolled',
    progress: 75,
    avatar: null
  },
  {
    id: 2,
    studentId: 'STU002',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0102',
    enrollmentDate: '2025-09-21T14:30:00',
    status: 'enrolled',
    progress: 60,
    avatar: null
  },
  {
    id: 3,
    studentId: 'STU003',
    fullName: 'Michael Brown',
    email: 'michael.brown@email.com',
    phone: '+1-555-0103',
    enrollmentDate: '2025-09-22T09:15:00',
    status: 'completed',
    progress: 100,
    avatar: null
  },
  {
    id: 4,
    studentId: 'STU004',
    fullName: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '+1-555-0104',
    enrollmentDate: '2025-09-25T11:45:00',
    status: 'enrolled',
    progress: 45,
    avatar: null
  },
  {
    id: 5,
    studentId: 'STU005',
    fullName: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+1-555-0105',
    enrollmentDate: '2025-09-26T16:20:00',
    status: 'dropped',
    progress: 25,
    avatar: null
  },
  {
    id: 6,
    studentId: 'STU006',
    fullName: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '+1-555-0106',
    enrollmentDate: '2025-09-27T13:10:00',
    status: 'enrolled',
    progress: 80,
    avatar: null
  },
  {
    id: 7,
    studentId: 'STU007',
    fullName: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1-555-0107',
    enrollmentDate: '2025-09-28T08:30:00',
    status: 'enrolled',
    progress: 55,
    avatar: null
  },
  {
    id: 8,
    studentId: 'STU008',
    fullName: 'Jennifer Martinez',
    email: 'jennifer.martinez@email.com',
    phone: '+1-555-0108',
    enrollmentDate: '2025-09-29T15:45:00',
    status: 'enrolled',
    progress: 70,
    avatar: null
  }
];

export default function TraineeTable({ classId }) {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filteredTrainees, setFilteredTrainees] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchTrainees = async () => {
      setLoading(true);
      try {
        if (!classId) {
          // fallback to mock data when no classId provided
          setTrainees(mockTrainees);
          setFilteredTrainees(mockTrainees);
          return;
        }
        const res = await getClassMembers(classId, { page: 1, pageSize: 1000 });
        const items = Array.isArray(res.items) ? res.items : [];
        // Map API member items to the table row shape expected by this component
        const mapped = items.map((m) => ({
          id: m.trainee?.id || m.traineeId || m.id,
          studentId: m.trainee?.traineeCode || `TR${String(m.traineeId || m.id).padStart(3, '0')}`,
          fullName: m.trainee?.fullName || 'Unknown',
          email: m.trainee?.email || '-',
          phone: m.trainee?.phone || '-',
          enrollmentDate: m.assignedDate || m.trainee?.enrollmentDate || null,
          status: (() => {
            // Map numeric/string status codes to semantic statuses.
            // Assumption: '1' => enrolled, '2' => completed
            if (m.status === 1 || m.status === '1') return 'enrolled';
            if (m.status === 2 || m.status === '2') return 'completed';
            return m.status || 'unknown';
          })(),
          progress: (Array.isArray(m.trainingProgresses) && m.trainingProgresses.length)
            ? Math.round((m.trainingProgresses[0].progress || 0))
            : 0,
          avatar: null,
        }));

        setTrainees(mapped);
        setFilteredTrainees(mapped);
      } catch (err) {
        // on error, keep mock data
        console.error('Failed to fetch class members:', err);
        setTrainees(mockTrainees);
        setFilteredTrainees(mockTrainees);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainees();
  }, [classId]);

  useEffect(() => {
    // Filter trainees based on search
    if (searchValue.trim() === '') {
      setFilteredTrainees(trainees);
    } else {
      const filtered = trainees.filter(trainee =>
        trainee.fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
        trainee.studentId.toLowerCase().includes(searchValue.toLowerCase()) ||
        trainee.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredTrainees(filtered);
    }
    setPageNumber(1); // Reset to first page when searching
  }, [searchValue, trainees]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled': return 'blue';
      case 'completed': return 'green';
      case 'dropped': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'enrolled': return 'Enrolled';
      case 'completed': return 'Completed';
      case 'dropped': return 'Dropped';
      default: return 'Unknown';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#52c41a'; // green
    if (progress >= 60) return '#1890ff'; // blue
    if (progress >= 40) return '#faad14'; // orange
    return '#ff4d4f'; // red
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, __, index) => (
        <span className="font-medium text-gray-600 text-sm">
          {(pageNumber - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      title: 'Student',
      key: 'student',
      width: 150,
      render: (_, record) => {
        const avatarUrl = record.avatar
          ? record.avatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(record.fullName || 'User')}&background=random`;

        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              src={avatarUrl}
              icon={<UserOutlined />}
              className="flex-shrink-0"
            />
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate">
                {record.fullName}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 150,
      render: (_, record) => (
        <div className="space-y-1">
          <div className="text-sm text-gray-700 truncate">
            {record.email}
          </div>
          <div className="text-xs text-gray-500">
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      width: 130,
      render: (date) => (
        <div className="text-sm text-gray-600">
          {formatDate(date)}
        </div>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: 120,
      render: (progress) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: getProgressColor(progress)
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600 w-8">
            {progress}%
          </span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} className="text-center">
          {getStatusText(status)}
        </Tag>
      ),
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   width: 80,
    //   render: (_, record) => (
    //     <div className="flex justify-center">
    //       <Button 
    //         type="text" 
    //         size="small"
    //         onClick={() => {
    //           // Handle view trainee details
    //           console.log('View trainee:', record);
    //         }}
    //       >
    //         View
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3 whitespace-nowrap w-full">
              <Skeleton.Input style={{ width: 320, height: 40 }} active />
              <div className="ml-4">
                <Skeleton.Input style={{ width: 140, height: 20 }} active />
              </div>
            </div>
          </div>
          {/* Trainees Table or Skeleton */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-3">
              <Skeleton.Button style={{ width: 200, height: 28 }} active />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 last:border-b-0">
                <Skeleton.Avatar size={40} shape="circle" active />
                <div className="flex-1">
                  <Skeleton.Input style={{ width: '50%', height: 12, marginBottom: 6 }} active />
                  <Skeleton.Input style={{ width: '35%', height: 10 }} active />
                </div>
                <div className="w-20">
                  <Skeleton.Button size="small" active />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <Input
                placeholder="Search trainees..."
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                allowClear
                className="w-80"
              />
              <div className="text-sm text-gray-500 whitespace-nowrap">
                Total: {filteredTrainees.length} trainees
              </div>
            </div>
          </div>
          <div>
            <div style={{ height: 350 }} className="p-4 overflow-auto">
              <Table
                columns={columns}
                dataSource={filteredTrainees}
                rowKey="id"
                loading={false}
                pagination={false}
                size="middle"
              />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white flex justify-center">
              <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={filteredTrainees.length}
                onChange={(page, size) => { setPageNumber(page); setPageSize(size); }}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} trainees`}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}