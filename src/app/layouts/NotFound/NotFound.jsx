import React from "react";
import BackButton from "../../components/BackButton/BackButton";
import img from "../../assets/404.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      {/* Hình minh họa */}
      <img
        src={img}
        alt="404 illustration"
        className="mx-auto w-auto max-w-md select-none"
        draggable={false}
      />

      {/* Tiêu đề */}
      <h2 className="text-4xl font-sans text-blue-500 mb-5">404 Not Found</h2>

      {/* Mô tả */}
      <h1 className="text-5xl font-sans text-gray-800 mb-5">
        Whoops! That page doesn’t exist
      </h1>

      {/* Nút quay lại */}
      <BackButton type="primary" variant="solid" />
    </div>
  );
}
