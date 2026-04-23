import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';


// Async Thunks
export const sendOtp = createAsyncThunk('user/sendOtp', async (mobile, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/send-otp', { mobile });
        // Return entire response data which includes { success, message, otp (dev), isNewUser }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const verifyOtp = createAsyncThunk('user/verifyOtp', async ({ mobile, otp }, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/verify-otp', { mobile, otp });
        // Returns user info + token if existing user, OR message + isNewUser if new
        if (response.data.token) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const registerUser = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/register', userData);
        if (response.data.token) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const loginWithPassword = createAsyncThunk('user/loginWithPassword', async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (emailOrMobile, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/forgot-password', { emailOrMobile });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, password }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/api/users/reset-password/${token}`, { password });
        if (response.data.token) {
            localStorage.setItem('userInfo', JSON.stringify(response.data)); // Auto login after reset?
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const googleLogin = createAsyncThunk('user/googleLogin', async (idToken, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/users/google-login', { idToken });
        if (response.data.token) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});

export const getProfile = createAsyncThunk('user/getProfile', async (_, { getState, rejectWithValue }) => {
    try {
        const { user: { userInfo } } = getState();
        const response = await api.get('/api/users/profile');
        // Merge fresh data with existing token
        const updatedInfo = { ...userInfo, ...response.data };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        return updatedInfo;
    } catch (error) {
        return rejectWithValue(error.response && error.response.data.message ? error.response.data.message : error.message);
    }
});


const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
        loading: false,
        error: null,
        otpSent: false,
        otpVerified: false,
        isNewUser: false,
        tempMobile: null, // Store mobile temporarily during OTP flow
        tempOtp: null, // Store received OTP (Dev purposes)
        forgotPasswordSuccess: false,
        resetPasswordSuccess: false,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userInfo');
            state.userInfo = null;
            state.otpSent = false;
            state.otpVerified = false;
            state.isNewUser = false;
            state.tempMobile = null;
        },
        resetAuthFlow: (state) => {
            state.otpSent = false;
            state.otpVerified = false;
            state.isNewUser = false;
            state.tempMobile = null;
            state.tempOtp = null;
            state.error = null;
            state.forgotPasswordSuccess = false;
            state.resetPasswordSuccess = false;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        }
    },
    extraReducers: (builder) => {
        builder
            // SEND OTP
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                state.tempMobile = action.meta.arg; // We passed mobile as argument
                state.tempOtp = action.payload.otp; // For dev display
                state.isNewUser = action.payload.isNewUser;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // VERIFY OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpVerified = true;
                state.isNewUser = action.payload.isNewUser;
                if (!action.payload.isNewUser && action.payload.token) {
                    state.userInfo = action.payload; // Logged in
                    localStorage.setItem('userInfo', JSON.stringify(action.payload));
                }
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // REGISTER
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // LOGIN PASSWORD
            .addCase(loginWithPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(loginWithPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // FORGOT PASSWORD
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.forgotPasswordSuccess = true;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // RESET PASSWORD
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.resetPasswordSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // GOOGLE LOGIN
            .addCase(googleLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // GET PROFILE
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, resetAuthFlow, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
