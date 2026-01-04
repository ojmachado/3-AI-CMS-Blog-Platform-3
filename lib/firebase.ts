
// Mock Firebase para ambiente de teste estático na Vercel
export const auth: any = {
  onAuthStateChanged: (callback: any) => {
    const user = localStorage.getItem('mock_user');
    callback(user ? JSON.parse(user) : null);
    return () => {};
  },
  currentUser: null,
  signInWithEmailAndPassword: async () => ({ user: { email: 'admin@test.com' } }),
  signOut: async () => { localStorage.removeItem('mock_user'); }
};

export const db: any = {};
export const storage: any = {};

export const getFirebaseConfigStatus = () => ({
  isValid: true,
  missingKeys: []
});
