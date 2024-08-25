import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface UserCurrentState {
  profilePicture: string;
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserCurrentGoogleState {
  username: string;
  email: string;
  profilePicture: string;
  _id: string;
}
interface UserState {
  currentUser: UserCurrentState | null;
  currentUserGoogle: UserCurrentGoogleState | null;
  error: string | null;
  loading: boolean;
}

interface UpdateProfileState {
  typeUpdate: "google" | "db" | null;
  updateProfileError: string | null;
  updateProfileLoading: boolean;
}

const initialState: UserState & UpdateProfileState = {
  currentUser: null,
  currentUserGoogle: null,
  error: null,
  loading: false,
  updateProfileError: null,
  updateProfileLoading: false,
  typeUpdate: null,
};

// NOTE - Payload
interface UpdateProfilePayload {
  typeUpdate: "google" | "db";
  data: UserCurrentState | UserCurrentGoogleState;
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, actions: PayloadAction<UserCurrentState>) => {
      state.currentUser = actions.payload;
      state.currentUserGoogle = null;
      state.loading = false;
      state.error = null;
    },
    signInGoggleSuccess: (
      state,
      actions: PayloadAction<UserCurrentGoogleState>
    ) => {
      state.currentUser = null;
      state.currentUserGoogle = actions.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.updateProfileLoading = true;
      state.updateProfileError = null;
    },
    updateSuccess: (state, action: PayloadAction<UpdateProfilePayload>) => {
      const { typeUpdate, data } = action.payload;
      state.typeUpdate = typeUpdate;

      if (typeUpdate === "db") {
        state.currentUser = data as UserCurrentState;
      } else if (typeUpdate === "google") {
        state.currentUserGoogle = data as UserCurrentGoogleState;
      }

      state.updateProfileLoading = false;
      state.updateProfileError = null;
    },
    updateFailure: (state, action: PayloadAction<string | null>) => {
      state.updateProfileLoading = false;
      state.updateProfileError = action.payload;
    },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  signInGoggleSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} = userSlice.actions;

export default userSlice.reducer;
