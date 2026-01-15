export const login = async (formLogin) => {
  try {
    await Insert('/api/auth/login', formLogin)
  } catch (e) {
    console.log(e);
  }
};

export const register = async (formRegister) => {
  try {
    await Insert('/api/auth/register', formRegister)
  } catch (e) {
    console.log(e);
  }
};
