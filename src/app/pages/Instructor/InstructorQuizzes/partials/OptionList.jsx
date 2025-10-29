import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { App, Button, Input, InputNumber, Switch, Table, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { getQuizQuestionOptions, updateQuizQuestionOption } from '../../../../apis/Instructor/InstructorQuiz';

export default function OptionList({ questionId }) {
  const { message } = App.useApp();
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
      message.error('Failed to load options');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Option',
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
      title: 'Correct',
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
          <Tag color="success" icon={<CheckCircleOutlined />}>Correct</Tag>
        ) : (
          <Tag color="default" icon={<CloseCircleOutlined />}>Wrong</Tag>
        ),
    },
    {
      title: 'Score',
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
      title: 'Actions',
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
                  message.success('Option updated');
                  await fetchOptions(questionId);
                  setEditingOptionId(null);
                  setEditingOptionValues((prev) => {
                    const copy = { ...prev };
                    delete copy[opt.id];
                    return copy;
                  });
                } catch (e) {
                  console.error('Failed to update option:', e);
                  message.error('Failed to update option');
                } finally {
                  setSavingOptions((s) => ({ ...s, [opt.id]: false }));
                }
              }}
            >
              Save
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
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Edit option inline">
              <Button
                type="text"
                icon={<EditOutlined />}
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
