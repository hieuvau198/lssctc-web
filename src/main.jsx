import { createRoot } from 'react-dom/client'
import { App as AntdApp, ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs' // Import this
import 'antd/dist/reset.css'
import './index.css'
import './app/i18n'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StyleProvider layer> {/* Wrap everything in StyleProvider with 'layer' prop */}
    <ConfigProvider>
      <AntdApp component={false}>
        <GoogleOAuthProvider clientId="43773848859-fbh2pd77m355pf6arit59rinhvuh4l0u.apps.googleusercontent.com">
          <App />
        </GoogleOAuthProvider>
      </AntdApp>
    </ConfigProvider>
  </StyleProvider>
);