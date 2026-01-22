import { jwtDecode } from "jwt-decode";
import { authStore } from "~/stores/authStore";

export const Fetch = async (endpoint) => {
  try {
    const res = await api.get(endpoint);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const Update = async (endpointID, formUpdate) => {
  try {
    const res = await api.put(endpointID, formUpdate);
    return showAlert("อัพเดทข้อมูลสำเร็จ", "success");
  } catch (e) {
    console.log(e);
  }
};

export const Insert = async (endpoint, formInsert, IsloginRegister = "") => {
  try {
    const res = await api.post(endpoint, formInsert);
    if (IsloginRegister === "login") {
      const auth = authStore();
      const token = res.data.token;
      auth.setToken(token);
      if (auth.token) {
        const user = jwtDecode(auth.token);
        switch (user.payload.role) {
          case "admin":
            return navigateTo("/admin");
          case "evaluatee":
            return navigateTo("/evaluatee");
          case "evaluator":
            return navigateTo("/evaluator");
        }
      }

      return showAlert("เข้าสู่ระบบสำเร็จ", "success");
    } else if (IsloginRegister === "register") {
      resetForm(formInsert);
      return showAlert("สมัครสมาชิก", "success");
    }

    showAlert("ดำเนินการสำเร็จ", "success");
    return res.data
  } catch (e) {
    console.log(e)
    const error = e.response.data.msg || e.response.data.message
    return showAlert(error, "error");
  }
};

export const Delete = async (endpointID) => {
  try {
    if (confirm("คุณต้องการลบหรือไม่?")) {
      const res = await api.delete(endpointID);
      return showAlert("ดำเนินการลบข้อมูลสำเร็จ", "success");
    }
  } catch (e) {
    console.log(e);
    return showAlert("เกิดข้อผิดพลาด", "error");
  }
};
