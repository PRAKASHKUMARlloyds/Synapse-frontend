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
  email: string | null;
  password: string | null;
  role: Role;
}

const initialState: AuthenticationState = {
  email: null,
  password: null,
  role: Role.None,
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ email: string; password: string; role: Role }>
    ) => {
      console.log('redux login');
      const { email, password, role } = action.payload;
      state.email = email;
      state.password = password;
      state.role = role;
    },
    logout: (state) => {
      state.email = null;
      state.password = null;
      state.role = Role.None;
    },
  },
});

export const { login, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
