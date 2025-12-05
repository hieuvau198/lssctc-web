import { CheckCircle, XCircle, Pencil } from 'lucide-react';
import { App, Button, Input, InputNumber, Switch, Table, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getQuizQuestionOptions, updateQuizQuestionOption } from '../../../../apis/Instructor/InstructorQuiz';

export default function OptionList({ questionId }) {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [editingOptionValues, setEditingOptionValues] = useState({});
  const [savingOptions, setSavingOptions] = useState({});

  useEffect(() => {
    if (questionId) fetchOptions(questionId);
  }, [questionId]);

  const fetchOptions = async (qId) => {
    setLoading(true);
    try {
      const resp = await getQuizQuestionOptions(qId);
      setOptions(resp.items || []);
    } catch (e) {
      console.error('Failed to load options:', e);
      message.error(t('instructor.quizzes.messages.loadOptionsFailed'));
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('instructor.quizzes.table.index'),
      key: 'index',
      width: 56,
      align: 'center',
      render: (_, __, idx) => idx + 1,
    },
    {
      title: t('instructor.quizzes.options.option'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name, opt) =>
        editingOptionId === opt.id ? (
          <Input
            maxLength={100}
            showCount
            value={editingOptionValues[opt.id]?.name}
            onChange={(e) =>
              setEditingOptionValues((prev) => ({
                ...prev,
                [opt.id]: { ...prev[opt.id], name: e.target.value },
              }))
            }
          />
        ) : (
          <span className="font-medium">{name}</span>
        ),
    },
    {
      title: t('instructor.quizzes.options.correct'),
      dataIndex: 'isCorrect',
      key: 'isCorrect',
      width: 120,
      align: 'center',
      render: (isCorrect, opt) =>
        editingOptionId === opt.id ? (
          <Switch
            checked={!!editingOptionValues[opt.id]?.isCorrect}
            onChange={(val) =>
              setEditingOptionValues((prev) => ({
                ...prev,
                [opt.id]: { ...prev[opt.id], isCorrect: val },
              }))
            }
          />
        ) : isCorrect ? (
          <Tag color="success" icon={<CheckCircle className="w-3.5 h-3.5" />}>{t('instructor.quizzes.options.correct')}</Tag>
        ) : (
          <Tag color="default" icon={<XCircle className="w-3.5 h-3.5" />}>{t('instructor.quizzes.options.wrong')}</Tag>
        ),
    },
    {
      title: t('instructor.quizzes.options.score'),
      dataIndex: 'optionScore',
      key: 'optionScore',
      width: 100,
      align: 'center',
      render: (score, opt) =>
        editingOptionId === opt.id ? (
          <InputNumber
            min={0}
            step={0.1}
            value={editingOptionValues[opt.id]?.optionScore}
            onChange={(val) =>
              setEditingOptionValues((prev) => ({
                ...prev,
                [opt.id]: { ...prev[opt.id], optionScore: val },
              }))
            }
            className="w-2"
          />
        ) : (
          score !== null ? score : 0
        ),
    },
    {
      title: t('instructor.quizzes.table.actions'),
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, opt) => {
        const isEditing = editingOptionId === opt.id;
        return isEditing ? (
          <div className="flex gap-2 justify-center">
            <Button
              type="primary"
              size="small"
              loading={!!savingOptions[opt.id]}
              onClick={async () => {
                try {
                  setSavingOptions((s) => ({ ...s, [opt.id]: true }));
                  const payload = {
                    name: editingOptionValues[opt.id]?.name,
                    description: opt.description || '',
                    isCorrect: !!editingOptionValues[opt.id]?.isCorrect,
                    displayOrder: opt.displayOrder || 0,
                    explanation: opt.explanation || '',
                    optionScore: Number(editingOptionValues[opt.id]?.optionScore) || 0,
                  };
                  await updateQuizQuestionOption(opt.id, payload);
                  message.success(t('instructor.quizzes.messages.optionUpdateSuccess'));
                  await fetchOptions(questionId);
                  setEditingOptionId(null);
                  setEditingOptionValues((prev) => {
                    const copy = { ...prev };
                    delete copy[opt.id];
                    return copy;
                  });
                } catch (e) {
                  console.error('Failed to update option:', e);
                  message.error(t('instructor.quizzes.messages.optionUpdateFailed'));
                } finally {
                  setSavingOptions((s) => ({ ...s, [opt.id]: false }));
                }
              }}
            >
              {t('common.save')}
            </Button>
            <Button
              size="small"
              onClick={() => {
                setEditingOptionId(null);
                setEditingOptionValues((prev) => {
                  const copy = { ...prev };
                  delete copy[opt.id];
                  return copy;
                });
              }}
            >
              {t('common.cancel')}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <Tooltip title={t('instructor.quizzes.tooltip.editOption')}>
              <Button
                type="text"
                icon={<Pencil className="w-4 h-4" />}
                size="small"
                onClick={() => {
                  setEditingOptionId(opt.id);
                  setEditingOptionValues((prev) => ({
                    ...prev,
                    [opt.id]: {
                      name: opt.name,
                      isCorrect: !!opt.isCorrect,
                      optionScore: opt.optionScore,
                    },
                  }));
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={options}
      rowKey="id"
      loading={loading}
      pagination={false}
      size="small"
      className="ml-8"
    />
  );
}
