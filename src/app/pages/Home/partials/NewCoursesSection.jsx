import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton, Empty, Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ChevronRight, BookOpen } from 'lucide-react';
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
    <section id="new-courses" className="py-16 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-yellow-500" />
              <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold">
                Mới nhất
              </span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              {t('home.courses.title')}
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>
          <a
            href="/course"
            className="inline-flex items-center gap-2 text-neutral-900 font-bold uppercase tracking-wider text-sm hover:text-yellow-600 transition-colors group"
          >
            Xem tất cả khóa học
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Courses carousel */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-2 border-neutral-200 bg-white p-4">
                <Skeleton.Image active className="!w-full !h-36 mb-4" />
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center">
            <Empty
              description={
                <span className="text-neutral-500">{t('home.courses.noCourses')}</span>
              }
            />
          </div>
        ) : (
          <div className="relative">
            <Carousel
              ref={carouselRef}
              autoplay
              size="large"
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
                <div key={course.id} className="px-3 py-4">
                  <div
                    onClick={() => {
                      try {
                        if (window && window.top) {
                          window.top.location.href = `/course/${course.id}`;
                          return;
                        }
                      } catch (e) { }
                      navigate(`/course/${course.id}`);
                    }}
                    className="cursor-pointer h-full"
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
              className="!absolute !left-0 top-1/2 !-translate-y-1/2 !-translate-x-1/2 z-10 !bg-white hover:!bg-yellow-400 !border-2 !border-neutral-900 hover:!border-yellow-400 !text-neutral-900 !rounded-none !w-12 !h-12"
              style={{ boxShadow: 'none' }}
            />
            <Button
              icon={<RightOutlined />}
              onClick={() => carouselRef.current?.next()}
              className="!absolute !right-0 top-1/2 !-translate-y-1/2 !translate-x-1/2 z-10 !bg-white hover:!bg-yellow-400 !border-2 !border-neutral-900 hover:!border-yellow-400 !text-neutral-900 !rounded-none !w-12 !h-12"
              style={{ boxShadow: 'none' }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
