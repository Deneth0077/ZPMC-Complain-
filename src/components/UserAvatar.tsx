import React from "react";

interface UserAvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = "md",
  className = "",
}) => {
  const initial = name && name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : "U";

  const sizeClasses = {
    sm: "w-8 h-8 text-xs font-bold",
    md: "w-9 h-9 text-sm font-bold",
    lg: "w-16 h-16 text-2xl font-extrabold",
  };

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-[#0F4C81] to-[#0B3C68] text-white flex items-center justify-center shadow-sm border-2 border-slate-200 uppercase shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {initial}
    </div>
  );
};

export default UserAvatar;
