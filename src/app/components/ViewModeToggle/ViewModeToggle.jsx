import { AppstoreOutlined, TableOutlined } from "@ant-design/icons";
import { Button, Tooltip, Space } from "antd"; // 1. Import Space
import React from "react";

export default function ViewModeToggle({ viewMode, onViewModeChange }) {
  return (
    // 2. Replace Button.Group with Space.Compact
    <Space.Compact> 
      <Tooltip title="Table View">
        <Button
          type={viewMode === "table" ? "primary" : "default"}
          icon={<TableOutlined />}
          onClick={() => onViewModeChange("table")}
        />
      </Tooltip>
      <Tooltip title="Card View">
        <Button
          type={viewMode === "card" ? "primary" : "default"}
          icon={<AppstoreOutlined />}
          onClick={() => onViewModeChange("card")}
        />
      </Tooltip>
    </Space.Compact> // 3. Close Space.Compact
  );
}