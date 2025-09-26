import React, { useState, useCallback, Suspense } from 'react';
import SidebarInstructor from './partials/SidebarInstructor';
import { Outlet } from 'react-router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { ConfigProvider, theme } from "antd";

export default function InstructorLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = useCallback(() => setCollapsed(c => !c), []);
    const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
    const closeMobile = useCallback(() => setMobileOpen(false), []);

    return (
        <Suspense fallback={null}>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: "#6366f1",
                colorBgContainer: "#1f1f23",
                colorBgElevated: "#2a2a2e",
                colorBorder: "#404040",
                colorText: "#f1f5f9",
                colorTextSecondary: "#a1a1aa",
                borderRadius: 8,
                fontFamily: "var(--font-geist-sans)",
              },
              components: {
                Layout: {
                  siderBg: "#18181b",
                  headerBg: "#1f1f23",
                  bodyBg: "#0f0f11",
                },
                Menu: {
                  darkItemBg: "#18181b",
                  darkItemSelectedBg: "#6366f1",
                  darkItemHoverBg: "#2a2a2e",
                },
              },
            }}
          >
            <div className="flex min-h-screen">
              <SidebarInstructor collapsed={collapsed} mobileOpen={mobileOpen} onClose={closeMobile} />
              <main className="flex-1 ml-64">
                <Outlet />
              </main>
            </div>
          </ConfigProvider>
        </Suspense>
    );
}
