import React from "react";

const StayWheelsLogo: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "auto",
        maxWidth: "150px",
        display: "block"
      }}
    >
      {/* House Outline with draw animation */}
      <path
        d="M100 120 L100 60 L150 30 L200 60 L200 120"
        stroke="#2563eb"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="300"
        strokeDashoffset="300"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="300"
          to="0"
          dur="1.5s"
          fill="freeze"
        />
      </path>
      {/* Window fade-in */}
      <rect x="135" y="60" width="25" height="25" rx="4" fill="#dbeafe">
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="1s"
          begin="1.2s"
          fill="freeze"
        />
      </rect>
      {/* Rotating Wheel */}
      <g>
        <circle cx="150" cy="140" r="25" stroke="#f59e42" strokeWidth="8" fill="none" />
        <line x1="150" y1="115" x2="150" y2="165" stroke="#f59e42" strokeWidth="4" />
        <line x1="125" y1="140" x2="175" y2="140" stroke="#f59e42" strokeWidth="4" />
        <line x1="132" y1="122" x2="168" y2="158" stroke="#f59e42" strokeWidth="4" />
        <line x1="132" y1="158" x2="168" y2="122" stroke="#f59e42" strokeWidth="4" />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 150 140"
          to="360 150 140"
          dur="3s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
};

export default StayWheelsLogo;
