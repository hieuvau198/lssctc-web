import React from 'react';
import { Button, Tooltip } from 'antd';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';

export default function ViewModeToggle({ viewMode, onViewModeChange }) {
    return (
        <Button.Group>
            <Tooltip title="Table View">
                <Button
                    type={viewMode === "table" ? "primary" : "default"}
                    icon={<UnorderedListOutlined />}
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
        </Button.Group>
    );
}