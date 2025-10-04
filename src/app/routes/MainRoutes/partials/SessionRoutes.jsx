import React from 'react'
import { Route, Routes } from 'react-router'
import SessionLayout from '../../../layouts/SessionLayout/SessionLayout'
import LessonSessionPlaceholder from '../../../pages/Trainee/Session/LessonSessionPlaceholder'

export default function SessionRoutes() {
  return (
    <Routes>
      <Route element={<SessionLayout itemsLoading={false} items={[]} />}>
        <Route index element={<LessonSessionPlaceholder />} />
        <Route path=":activityId" element={<LessonSessionPlaceholder />} />
      </Route>
    </Routes>
  )
}
