import { useState, useMemo } from "react";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const menuItems = [
  { key: "/instructor/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/instructor/quizzes", icon: <BookOutlined />, label: "Quản Lý Quiz" },
  { key: "/instructor/reports", icon: <BarChartOutlined />, label: "Báo Cáo" },
  { key: "/instructor/students", icon: <UserOutlined />, label: "Học Viên" },
  { key: "/instructor/settings", icon: <SettingOutlined />, label: "Cài Đặt" },
  { key: "/instructor/help", icon: <QuestionCircleOutlined />, label: "Trợ Giúp" },
];

export default function SidebarInstructor() {
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = (() => {
  let path = window.location.pathname || "/";

  if (path !== "/") path = path.replace(/\/+$/, "");

  let found = null;
  menuItems.forEach(item => { 
    if (item.key == path) {
      found = item;
    }
  });

  return found?.key ?? menuItems[0].key;
})();

  const handleNavigate = (key) => {
    // Nếu có router thì navigate, còn không thì reload URL
    window.location.href = key;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={256}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: "#141414",
        borderRight: "1px solid #262626",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid #262626",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "#1677ff",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>Q</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 18, color: "#f1f5f9" }}>
              QuizMaster
            </span>
          </div>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed((v) => !v)}
          style={{ color: "#f1f5f9" }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => handleNavigate(key)}
        style={{ marginTop: 8, background: "transparent", borderInlineEnd: "none" }}
      />
    </Sider>
  );
}
