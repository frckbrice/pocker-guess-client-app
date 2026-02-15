"use client";

import React from "react";
type AvatarProps = {
  profilePicture: string;
  size: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Avatar = React.forwardRef<HTMLButtonElement, AvatarProps>(
  ({ profilePicture, size, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        style={{
          backgroundImage: `url(${profilePicture ||
            "https://i.pinimg.com/564x/a7/da/a4/a7daa4792ad9e6dc5174069137f210df.jpg"})`,
          width: `${size * 10}px`,
          height: `${size * 10}px`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          objectFit: "fill",
          borderRadius: "50%",
        }}
        className={`border-2 border-white shadow-sm ring-1 ring-gray-200 transition hover:ring-themecolor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-themecolor ${className || ""}`}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
