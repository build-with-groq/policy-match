export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
    VERSION: "v1",
    ENDPOINTS: {
      HEALTH: "/health",
      DOCUMENT: "/document",
      POLICY: "/policy",
      POLICIES: "/policies",
      DOCUMENTS: "/documents",
    },
  } as const
  
  export const FILE_CONFIG = {
    ACCEPTED_TYPES: ".pdf,.doc,.docx,.txt",
    MAX_SIZE_MB: 10,
    SUPPORTED_EXTENSIONS: ["PDF", "DOC", "DOCX", "TXT"],
  } as const
  
  export const UI_CONFIG = {
    PAGINATION: {
      DEFAULT_PAGE_SIZE: 10,
      DEFAULT_PAGE: 1,
    },
    HEALTH_CHECK_INTERVAL: 30000,
  } as const
  