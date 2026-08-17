import * as React from "react";

export interface DirectMessageUser {
  id: string;
  name: string;
  avatar: string;
  online?: boolean;
}

export interface DirectMessageButtonProps {
  user: DirectMessageUser;
  onSelect?: (userId: string) => void;
}

export const DirectMessageButton: React.FC<DirectMessageButtonProps> = ({
  user,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect?.(user.id)}
      className="w-full px-6 py-1.5 flex items-center space-x-3 text-foreground-muted hover:bg-background-hover transition-colors cursor-pointer"
    >
      <div className="relative shrink-0">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-6 h-6 rounded-full object-cover border border-border"
        />
        {user.online && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-status-success rounded-full border border-background-card" />
        )}
      </div>
      <span className="font-bold text-xs truncate">{user.name}</span>
    </button>
  );
};

export default DirectMessageButton;
