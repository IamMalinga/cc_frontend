import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  name: string | null;
  roles: string[];
}

const initialState: AuthState = {
  isAuthenticated: false,
  username: null,
  name: null,
  roles: [],
};

export interface SetAuthenticatedPayload {
  username?: string | null;
  name?: string | null;
  roles?: string[];
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<SetAuthenticatedPayload>) {
      const { username, name, roles } = action.payload;
      state.isAuthenticated = true;
      state.username = username ?? null;
      state.name = name ?? null;
      state.roles = roles ?? [];
    },
    clearAuthenticated() {
      return initialState;
    },
  },
});

export const { setAuthenticated, clearAuthenticated } = authSlice.actions;
export const selectIsAdmin = (state: RootState): boolean => state.auth.roles.includes('ADMIN');
export default authSlice.reducer;
