
// Re-export types
export * from './types';

// Export auth functions
export {
  loginUser,
  logoutUser,
  getCurrentUser,
  resetPassword,
  updatePassword,
} from './auth';

// Export profile functions
export {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from './profiles';

// Export admin functions
export {
  createAdminUser,
} from './admin';

// Export registration functions
export * from './registration';

// Export verification functions
export {
  uploadTeacherDemo,
  getPendingTeachers,
  getTeacherDemoUrl,
  updateTeacherVerification,
  isVerificationAuthorized,
  getVerificationStats,
} from './verification';
