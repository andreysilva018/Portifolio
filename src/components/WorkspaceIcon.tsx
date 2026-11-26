export type IconName =
  | "overview"
  | "incident"
  | "infrastructure"
  | "terminal"
  | "projects"
  | "profile"
  | "arrow"
  | "external"
  | "menu"
  | "close";

export function WorkspaceIcon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "overview" && (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 15h7M14 20h7" />
        </>
      )}
      {name === "incident" && (
        <>
          <path d="M14 3H4v18h12M8 7h6M8 11h4M8 15h2" />
          <circle cx="17" cy="14" r="4" />
          <path d="m20 17 3 3" />
        </>
      )}
      {name === "infrastructure" && (
        <>
          <rect x="8" y="3" width="8" height="5" rx="1" />
          <path d="M12 8v5M4 17v-4h16v4M12 13v4" />
          <rect x="1" y="17" width="6" height="4" rx="1" />
          <rect x="9" y="17" width="6" height="4" rx="1" />
          <rect x="17" y="17" width="6" height="4" rx="1" />
        </>
      )}
      {name === "terminal" && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m6 9 4 3-4 3M13 15h5" />
        </>
      )}
      {name === "projects" && (
        <>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </>
      )}
      {name === "profile" && (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21v-3a8 8 0 0 1 16 0v3M9 19h6" />
        </>
      )}
      {name === "arrow" && <path d="M4 12h16m-5-5 5 5-5 5" />}
      {name === "external" && (
        <>
          <path d="M14 3h7v7m0-7L10 14M10 3H4v17h17v-6" />
        </>
      )}
      {name === "menu" && <path d="M3 6h18M3 12h18M3 18h18" />}
      {name === "close" && <path d="m5 5 14 14M19 5 5 19" />}
    </svg>
  );
}
