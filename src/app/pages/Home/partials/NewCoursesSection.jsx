import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton, Empty, Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { fetchCourses } from '../../../apis/ProgramManager/CourseApi';
import CourseCard from '../../../components/CourseCard/CourseCard';

export default function NewCoursesSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const carouselRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchCourses({ pageNumber: 1, pageSize: 10, isActive: true })
      .then((res) => {
        if (cancelled) return;
        const items = res?.items || res?.data || [];
        setCourses(items.slice(0, 10));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCourses([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="new-courses" className="py-10 md:py-14 bg-white">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">{t('home.courses.title')}</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                <Skeleton.Image active className="!w-full !h-36 mb-4" />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <Empty description={t('home.courses.noCourses')} />
        ) : (
          <div className="relative">
            <Carousel
              ref={carouselRef}
              autoplay
              autoplaySpeed={3000}
              slidesToShow={5}
              slidesToScroll={1}
              dots={true}
              draggable
              infinite={true}
              speed={600}
              responsive={[
                {
                  breakpoint: 1280,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                  },
                },
              ]}
            >
            {courses.map((course) => (
              <div key={course.id} className="px-3">
                <div
                  onClick={() => {
                    try {
                      if (window && window.top) {
                        window.top.location.href = `/course/${course.id}`;
                        return;
                      }
                    } catch (e) {}
                    navigate(`/course/${course.id}`);
                  }}
                  className="cursor-pointer"
                >
                  <CourseCard
                    course={{
                      id: course.id,
                      title: course.name || course.title,
                      provider: 'LSSCTC Academy',
                      level: course.levelName || course.level,
                      duration: course.durationHours,
                      thumbnail: course.imageUrl,
                      tags: course.tags || course.keywords || [course.category].filter(Boolean),
                      price: course.price,
                    }}
                  />
                </div>
              </div>
            ))}
          </Carousel>
          
          {/* Navigation Buttons */}
          <Button
            icon={<LeftOutlined />}
            onClick={() => carouselRef.current?.prev()}
            className="!absolute !left-0 top-1/2 !-translate-y-1/2 !-translate-x-1/2 z-10 !bg-white hover:!bg-gray-50"
            shape="circle"
            size="large"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => carouselRef.current?.next()}
            className="!absolute !right-0 top-1/2 !-translate-y-1/2 !translate-x-1/2 z-10 !bg-white hover:!bg-gray-50"
            shape="circle"
            size="large"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          />
        </div>
        )}
      </div>
    </section>
  );
}
