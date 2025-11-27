import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Minimal placeholder schema exports to avoid import errors in API routes.
// Replace these with your real Drizzle schema/table definitions.

export const resumes = {
  tableName: "resumes",
  // Replace with actual column helpers when switching to Drizzle
};

export const users = {
  tableName: "users",
};

export type Resume = {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
};
