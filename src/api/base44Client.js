import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68b046ea4c10618b1b91c84d", 
  requiresAuth: true // Ensure authentication is required for all operations
});
