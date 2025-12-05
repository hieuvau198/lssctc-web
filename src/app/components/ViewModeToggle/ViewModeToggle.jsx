import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd";
import React from "react";
import { useTranslation } from 'react-i18next';

export default function ViewModeToggle({ viewMode, onViewModeChange }) {
  const { t } = useTranslation();
  return (
    <Space.Compact> 
      <Tooltip title={t('common.tableView')}>
        <Button
          type={viewMode === "table" ? "primary" : "default"}
          icon={<TableOutlined />}
          onClick={() => onViewModeChange("table")}
        />
      </Tooltip>
      <Tooltip title={t('common.cardView')}>
        <Button
          type={viewMode === "card" ? "primary" : "default"}
          icon={<AppstoreOutlined />}
          onClick={() => onViewModeChange("card")}
        />
      </Tooltip>
    </Space.Compact>
  );
}