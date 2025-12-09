import { Drawer, Button, Space } from 'antd';
import { ExternalLink } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DrawerView({ visible, onClose, material }) {
  const { t } = useTranslation();

  if (!material) return null;

  const isVideo = Number(material.typeId) === 2;
  const isDoc = Number(material.typeId) === 1;

  const content = isVideo ? (
    // render HTML5 video player if url is a direct video
    <video controls style={{ width: '100%' }} src={material.url} />
  ) : isDoc ? (
    // embed pdf in iframe when possible
    <iframe title={material.name} src={material.url} style={{ width: '100%', height: '100%', border: 0 }} />
  ) : (
    <div>
      <a href={material.url} target="_blank" rel="noreferrer">{t('instructor.materials.openResource')}</a>
    </div>
  );

  return (
    <Drawer
      title={material.name}
      placement="right"
      width={800}
      onClose={onClose}
      open={visible}
      bodyStyle={{ padding: 16, height: 'calc(100vh - 108px)' }}
      extra={(
        <Space>
          <Button icon={<ExternalLink size={16} />} href={material.url} target="_blank" rel="noreferrer">{t('instructor.materials.openInNewTab')}</Button>
        </Space>
      )}
    >
      <div style={{ height: '100%', overflow: 'none' }}>
        {content}
      </div>
    </Drawer>
  );
}
