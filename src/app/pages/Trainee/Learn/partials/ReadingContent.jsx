// src\app\pages\Trainee\Learn\partials\ReadingContent.jsx

import { Button, Card, Progress } from "antd";
import { CheckCircle2, Clock } from "lucide-react";

export default function ReadingContent({
  title,
  completed = false,
  documentUrl,
  onMarkAsComplete,
  onMarkAsNotComplete
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="">
        <div className="">
          <div className="flex items-center justify-between mb-6">
            {completed && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Completed</span>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm h-[80vh]">
          <iframe
            src={`${documentUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            title={title}
            className="w-full h-full"
            style={{ border: "none" }}
          ></iframe>
        </div>

        <div className="mt-6 pt-6 border-t flex gap-4">
          {!completed ? (
            <Button type="primary" size="large" onClick={onMarkAsComplete}>
              Mark as Complete
            </Button>
          ) : (
            <Button danger size="large" onClick={onMarkAsNotComplete}>
              Mark as Incomplete
            </Button>
          )}
        </div>
      </Card>

      {completed && (
        <Card title="Reading Progress" className="mt-6">
          <Progress percent={100} status="success" />
          <p className="text-sm text-slate-600 mt-2">
            You have completed this reading material.
          </p>
        </Card>
      )}
    </div>
  );
}
