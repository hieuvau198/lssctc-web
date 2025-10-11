import React, { useState, useEffect } from 'react';
import { Table, Tag, Avatar, Input, Button } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';

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
    // Simulate API call
    const fetchTrainees = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setTrainees(mockTrainees);
      setFilteredTrainees(mockTrainees);
      setLoading(false);
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
    <div>
      {/* Search and Controls */}
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

      {/* Trainees Table */}
      <Table
        columns={columns}
        dataSource={filteredTrainees}
        rowKey="id"
        loading={loading}
        scroll={{ y: 280 }}
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: filteredTrainees.length,
          onChange: (page, size) => {
            setPageNumber(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} trainees`,
        }}
        size="middle"
      />
    </div>
  );
}