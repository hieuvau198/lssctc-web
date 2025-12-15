import React from 'react';
import HomeBanner from './partials/HomeBanner';
import CategoriesSection from './partials/CategoriesSection';
import MainCoursesSection from './partials/MainCoursesSection';
import NewCoursesSection from './partials/NewCoursesSection';
import ArticlesSection from './partials/ArticlesSection';
import InstructorsSection from './partials/InstructorsSection';
import AboutCenterSection from './partials/AboutCenterSection';

export default function Home() {
  return (
    <>
      <HomeBanner />
      <CategoriesSection />
      <MainCoursesSection />
      <NewCoursesSection />
      {/* <ArticlesSection /> */}
      {/* <InstructorsSection /> */}
      <AboutCenterSection />
    </>
  );
}
