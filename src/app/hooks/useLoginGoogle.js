import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { App } from "antd";
import { loginGoogle } from "../apis/Auth/LoginApi";
import { setAuthToken } from "../libs/cookies";

export default function useLoginGoogle() {
  const [isPendingGoogle, setIsPendingGoogle] = useState(false);
  const { message } = App.useApp();


  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsPendingGoogle(true);
      try {
        const res = await loginGoogle(tokenResponse?.access_token);
        const { accessToken, expiresIn, userName } = res;
        setAuthToken(accessToken, {
            expires: expiresIn
        });
        // Redirect to main page after successful Google login
        if (typeof window !== "undefined") {
          window.location.replace("/");
        }
        console.log(accessToken, expiresIn, userName);
      } catch (error) {
        try {
          message.error(error?.response?.data?.message || error?.message || 'Đăng nhập bằng Google thất bại');
        } catch (e) {
          // ignore message API errors
        }
        console.error("Google login error:", error);
      } finally {
        setIsPendingGoogle(false);
      }
    },
    onError: () => {
      setIsPendingGoogle(false);
      try {
        message.error('Đăng nhập bằng Google thất bại');
      } catch (e) {}
      console.error("Google login failed");
    },
  });


    return { handleLoginGoogle, isPendingGoogle };
}
