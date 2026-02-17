/**
 * Application Configuration
 * Non-sensitive configuration values that can be committed to version control
 * 
 * For sensitive values, use environment variables via .env (gitignored)
 */

export const config = {
  // API Configuration
  api: {
    // Base URL for API requests
    // Can be overridden by VITE_API_URL environment variable
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8008',
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 1000,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },

  // UI Configuration
  ui: {
    defaultTheme: 'light',
    animationsEnabled: true,
  },

  // Feature flags
  features: {
    enableEmployeeSearch: true,
    enableEmployeeEdit: true,
    enableEmployeeDelete: true,
  },
};

export default config;
