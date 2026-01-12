export const login = async (formLogin) => {
  try {
    const res = await api.post("/api/auth/login", formLogin);
  } catch (e) {
    console.log(e);
  }
};

export const register = async (formRegister) => {
  try {
    const res = await api.post("/api/auth/register", formRegister);
  } catch (e) {
    console.log(e);
  }
};
