import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton, Empty, Card } from 'antd';
import { fetchPrograms } from '../../../apis/Trainee/TraineeProgramApi';
import ProgramCard from '../../../components/ProgramCard';

export default function MainCoursesSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchPrograms({ PageNumber: 1, PageSize: 10, IsActive: true })
      .then((res) => {
        if (cancelled) return;
        const items = res?.items || res?.data || [];
        setPrograms(items.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPrograms([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="programs" className="py-14 md:py-18 bg-slate-50">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{t('home.programs.title')}</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-lg">
                <Skeleton.Image active className="!w-full !h-40 mb-4" />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <Empty description={t('home.programs.noPrograms')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {programs.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onClick={() => navigate(`/program/${prog.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
