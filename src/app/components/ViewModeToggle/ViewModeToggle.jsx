import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";
import { useTranslation } from 'react-i18next';

export default function ViewModeToggle({ viewMode, onViewModeChange }) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex">
      <Tooltip title={t('common.tableView')}>
        <button
          type="button"
          onClick={() => onViewModeChange("table")}
          className={`w-10 h-10 border-2 border-neutral-900 flex items-center justify-center transition-all ${viewMode === "table"
            ? "bg-yellow-400 border-yellow-400"
            : "bg-white hover:bg-neutral-100"
            }`}
        >
          <TableOutlined className="text-lg" />
        </button>
      </Tooltip>
      <Tooltip title={t('common.cardView')}>
        <button
          type="button"
          onClick={() => onViewModeChange("card")}
          className={`w-10 h-10 border-2 border-neutral-900 -ml-0.5 flex items-center justify-center transition-all ${viewMode === "card"
            ? "bg-yellow-400 border-yellow-400"
            : "bg-white hover:bg-neutral-100"
            }`}
        >
          <AppstoreOutlined className="text-lg" />
        </button>
      </Tooltip>
    </div>
  );
}