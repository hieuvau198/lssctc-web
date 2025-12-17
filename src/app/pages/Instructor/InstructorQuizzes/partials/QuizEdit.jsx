import { App, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import CreateQuizDrawer from './CreateQuizDrawer';
import { getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizEdit() {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getQuizDetail(id);
        setQuizData(data || null);
      } catch (e) {
        console.error('Failed to load quiz detail:', e);
        setError(e?.message || t('instructor.quizzes.messages.loadQuizFailed'));
        message.error(t('instructor.quizzes.messages.loadQuizFailed'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Loading State - Industrial Theme
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('instructor.quizzes.backToQuizzes')}
        </button>

        <div className="bg-black border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-black" />
            </div>
            <Skeleton.Button style={{ width: 300, height: 32 }} active className="bg-neutral-800" />
          </div>
        </div>

        <div className="bg-white border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border-2 border-black p-4">
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>

        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('instructor.quizzes.backToQuizzes')}
        </button>

        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold uppercase">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
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
