import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd";
import React from "react";
import { useTranslation } from 'react-i18next';

// Color presets for theming
const colorPresets = {
  default: {
    bg: '',
    hover: '',
  },
  violet: {
    bg: '!bg-gradient-to-r !from-violet-500 !to-purple-600 !border-0',
    hover: 'hover:!from-violet-600 hover:!to-purple-700',
  },
  cyan: {
    bg: '!bg-gradient-to-r !from-cyan-500 !to-blue-600 !border-0',
    hover: 'hover:!from-cyan-600 hover:!to-blue-700',
  },
};

export default function ViewModeToggle({ viewMode, onViewModeChange, color = 'default' }) {
  const { t } = useTranslation();
  const colorStyle = colorPresets[color] || colorPresets.default;

  const getButtonClass = (isActive) => {
    if (!isActive || color === 'default') return '';
    return `${colorStyle.bg} ${colorStyle.hover}`;
  };

  return (
    <Space.Compact>
      <Tooltip title={t('common.tableView')}>
        <Button
          type={viewMode === "table" ? "primary" : "default"}
          icon={<TableOutlined />}
          onClick={() => onViewModeChange("table")}
          className={getButtonClass(viewMode === "table")}
        />
      </Tooltip>
      <Tooltip title={t('common.cardView')}>
        <Button
          type={viewMode === "card" ? "primary" : "default"}
          icon={<AppstoreOutlined />}
          onClick={() => onViewModeChange("card")}
          className={getButtonClass(viewMode === "card")}
        />
      </Tooltip>
    </Space.Compact>
  );
}