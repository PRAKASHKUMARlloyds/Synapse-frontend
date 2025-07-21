import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Role = 'user' | 'hr' | 'manager' | 'none';

export const Role = {
  User: 'user' as Role,
  HR: 'hr' as Role,
  Manager: 'manager' as Role,
  None: 'none' as Role,
};

export interface User {
  name: string;
  email: string;
  role: Role;
}

interface AuthenticationState {
  email: string | null;
  password: string | null;
  role: Role;
  user: User | null;
}

const initialState: AuthenticationState = {
  email: null,
  password: null,
  role: Role.None,
  user: null,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; password: string; role: Role; name: string }>
    ) => {
      console.log('redux login');
      const { email, password, role, name } = action.payload;
      state.email = email;
      state.password = password;
      state.role = role;
      state.user = { name, email, role };
    },
    logout: (state) => {
      state.email = null;
      state.password = null;
      state.role = Role.None;
      state.user = null;
    },
  },
});

export const { login, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;