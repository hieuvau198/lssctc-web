import React from 'react';
import { useParams } from 'react-router-dom';
import ClassMembers from './partials/ClassMembers';

export default function ClassDetailMembers() {
  const { classId } = useParams();
  return <ClassMembers classId={classId} />;
}
