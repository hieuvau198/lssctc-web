import { App } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import CreateQuizDrawer from './CreateQuizDrawer';
import { getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizEdit() {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getQuizDetail(id);
        setQuizData(data || null);
      } catch (e) {
        console.error('Failed to load quiz detail:', e);
        message.error(t('instructor.quizzes.messages.loadQuizFailed'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-sm text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <CreateQuizDrawer
        open={true}
        onClose={() => navigate(-1)}
        onSuccess={() => navigate(-1)}
        mode="edit"
        quizId={id}
        initialData={quizData}
      />
    </div>
  );
}
