import React, { useState, useRef } from "react";

interface AvatarProps {
  photoURL?: string;
  displayName?: string;
  email?: string;
  size?: number | string; // Optional: allow custom size
  className?: string;
}

function getInitials(name?: string, email?: string) {
  if (name && name.trim()) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email[0].toUpperCase();
  return 'U';
}

function stringToColor(str?: string) {
  if (!str) return '#888888';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

const Avatar: React.FC<AvatarProps> = ({ photoURL, displayName, email, size = 36, className = "" }) => {
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const initials = getInitials(displayName, email);
  const bgColor = stringToColor(displayName || email);

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center border border-zinc-700 shadow ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size, background: photoURL && !avatarError ? undefined : bgColor }}
    >
      {photoURL && !avatarError ? (
        <>
          {!avatarLoaded && (
            <span className="w-full h-full flex items-center justify-center text-white font-bold text-lg select-none">{initials}</span>
          )}
          <img
            ref={imgRef}
            src={photoURL}
            alt={displayName || email || 'User'}
            className={`w-full h-full object-cover ${avatarLoaded ? '' : 'hidden'}`}
            onLoad={() => setAvatarLoaded(true)}
            onError={() => setAvatarError(true)}
            draggable={false}
          />
        </>
      ) : (
        <span className="w-full h-full flex items-center justify-center text-white font-bold text-lg select-none">{initials}</span>
    )}
    </div>
  );
};

export default Avatar;
