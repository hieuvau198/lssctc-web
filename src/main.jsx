import { createRoot } from 'react-dom/client'
import { App as AntdApp, ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import './index.css'
import './app/i18n'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <ConfigProvider>
    <AntdApp component={false}>
      <GoogleOAuthProvider clientId="43773848859-fbh2pd77m355pf6arit59rinhvuh4l0u.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AntdApp>
  </ConfigProvider>
);