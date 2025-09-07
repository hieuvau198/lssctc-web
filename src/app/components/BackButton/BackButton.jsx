import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function BackButton({type, variant}) {
    const navigate = useNavigate();
  return (
    <Button className='font-sans' type={type} variant={variant} icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
      Go Back
    </Button>
  )
}
