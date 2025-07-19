import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Role = 'user' | 'hr' | 'manager' | 'none';

export const Role = {
  User: 'user' as Role,
  HR: 'hr' as Role,
  Manager: 'manager' as Role,
  None: 'none' as Role,
};

interface AuthenticationState {
  role: Role;
}

const DEFAULT_CREDENTIALS = {
  user: { email: 'user@lloydsbanking.com', password: 'user@123' },
  hr: { email: 'hr@lloydsbanking.com', password: 'hr@123' },
  manager: { email: 'manager@lloydsbanking.com', password: 'manager@123' },
};

const initialState: AuthenticationState = {
  role: Role.None,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      console.log('redux');
      const { email, password } = action.payload;

      // Find role based on entered credentials
      for (const [role, creds] of Object.entries(DEFAULT_CREDENTIALS)) {
        if (creds.email === email && creds.password === password) {
          state.role = role as Role;
          return; // Exit once a match is found
        }
      }

      state.role = Role.None; // If no match, set role to None
    },
    logout: (state) => {
      state.role = Role.None;
    },
  },
});

export const { login, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
