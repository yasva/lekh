import { Sun, Moon, Monitor } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
  { value: "auto", label: "Automatic theme", Icon: Monitor },
];

function ThemeSwitcher({ theme, onThemeChange }) {
  return (
    <div className="theme-switcher" role="group" aria-label="Color theme">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={
            theme === value ? "theme-option theme-active" : "theme-option"
          }
          aria-label={label}
          aria-pressed={theme === value}
          title={label}
          onClick={() => onThemeChange(value)}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
