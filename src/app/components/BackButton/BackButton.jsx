import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export default function BackButton({type, variant, size}) {
    const navigate = useNavigate();
    const { t } = useTranslation();
  return (
    <Button className='font-sans' size={size} type={type} variant={variant} icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
      {t('common.back')}
    </Button>
  )
}
