import { Drawer } from 'antd';
import { ExternalLink, FileText, Video } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function DrawerView({ visible, onClose, material }) {
  const { t } = useTranslation();

  if (!material) return null;

  const isVideo = Number(material.typeId) === 1;
  const isDoc = Number(material.typeId) === 2;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYouTubeId(material.url);

  const content = isVideo ? (
    youtubeId ? (
      <div className="border-2 border-black overflow-hidden h-full bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={material.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      // render HTML5 video player if url is a direct video
      <div className="border-2 border-black overflow-hidden h-full bg-black flex items-center justify-center">
        <video controls style={{ width: '100%', maxHeight: '100%' }} src={material.url}>
          Your browser does not support the video tag.
        </video>
      </div>
    )
  ) : isDoc ? (
    // embed pdf in iframe when possible
    <div className="border-2 border-black overflow-hidden h-full">
      <iframe title={material.name} src={material.url} style={{ width: '100%', height: '100%', border: 0 }} />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
        <ExternalLink className="w-8 h-8 text-neutral-400" />
      </div>
      <a
        href={material.url}
        target="_blank"
        rel="noreferrer"
        className="px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:scale-[1.02] transition-transform inline-flex items-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        {t('instructor.materials.openResource')}
      </a>
    </div>
  );

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center border-2 border-black ${isVideo ? 'bg-black' : 'bg-yellow-400'}`}>
            {isVideo ? (
              <Video className="w-5 h-5 text-yellow-400" />
            ) : (
              <FileText className="w-5 h-5 text-black" />
            )}
          </div>
          <span className="font-black text-black uppercase tracking-tight">{material.name}</span>
        </div>
      }
      placement="right"
      width={800}
      onClose={onClose}
      open={visible}
      destroyOnClose={true}
      styles={{
        header: {
          borderBottom: '2px solid #000',
          padding: '16px 24px',
        },
        body: {
          padding: 24,
          height: 'calc(100vh - 108px)',
        },
      }}
      extra={(
        <a
          href={material.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold text-sm uppercase tracking-wider border-2 border-black hover:scale-[1.02] transition-transform"
        >
          <ExternalLink className="w-4 h-4" />
          {t('instructor.materials.openInNewTab')}
        </a>
      )}
    >
      <div style={{ height: '100%', overflow: 'hidden' }}>
        {content}
      </div>
    </Drawer>
  );
}
