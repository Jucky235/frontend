import * as React from "react";
import { createPortal } from "react-dom";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownContextType {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const DropdownContext = React.createContext<DropdownContextType>({
  activeId: null,
  setActiveId: () => {},
});

export function DropdownProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleOutsideClick = () => setActiveId(null);
    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("scroll", handleOutsideClick, true);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("scroll", handleOutsideClick, true);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </DropdownContext.Provider>
  );
}

interface DropdownProps {
  id?: string;
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  width?: string;
}

export default function Dropdown({
  id,
  trigger,
  items,
  align = "right",
  width = "w-44",
}: DropdownProps) {
  const dropdownId = React.useId();
  const uniqueId = id || dropdownId;

  const { activeId, setActiveId } = React.useContext(DropdownContext);
  const isOpen = activeId === uniqueId;

  const [coords, setCoords] = React.useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 176;

      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left:
          align === "right"
            ? rect.right + window.scrollX - menuWidth
            : rect.left + window.scrollX,
      });
      setActiveId(uniqueId);
    } else {
      setActiveId(null);
    }
  };

  return (
    <div className="inline-block" ref={triggerRef}>
      <div onClick={toggleDropdown}>{trigger}</div>

      {isOpen &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className={`z-[9999] ${width} bg-background-card rounded-xl shadow-lg border border-border py-1.5 text-xs font-medium text-foreground-muted animate-in fade-in-50 zoom-in-95 duration-100`}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider && index > 0 && (
                  <div className="my-1 border-t border-border-subtle" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setActiveId(null);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center space-x-2 transition-colors cursor-pointer ${
                    item.danger
                      ? "text-status-danger hover:bg-status-danger-bg"
                      : "hover:bg-background-subtle-hover text-foreground-muted"
                  }`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
