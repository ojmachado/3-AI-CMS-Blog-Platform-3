
// Mock Firebase para ambiente de desenvolvimento local sem backend
export const auth: any = {
  onAuthStateChanged: (callback: any) => {
    const user = localStorage.getItem('mock_user');
    callback(user ? JSON.parse(user) : null);
    return () => {};
  },
  currentUser: null
};

export const db: any = {};
export const storage: any = {};

export const getFirebaseConfigStatus = () => ({
  isValid: true,
  missingKeys: []
});
