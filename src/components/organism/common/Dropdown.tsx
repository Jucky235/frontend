import * as React from "react";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  width?: string; // e.g., "w-48" or "w-56"
}

export default function Dropdown({
  trigger,
  items,
  align = "right",
  width = "w-48",
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger element */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 ${width} bg-white border border-neutral-200/80 rounded-2xl shadow-lg z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100`}
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && (
                <div className="my-1 border-t border-neutral-100" />
              )}
              <button
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center space-x-2 transition-colors ${
                  item.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {item.icon && (
                  <span
                    className={
                      item.danger ? "text-red-500" : "text-neutral-400"
                    }
                  >
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
