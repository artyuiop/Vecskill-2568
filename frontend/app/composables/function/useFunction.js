export const showModal = (id) => {
  document.getElementById(id).showModal();
};

export const CloseModal = (id) => {
  document.getElementById(id).close();
};

export const useValidate = (form) => {
  const values = Object.values(form)
  if(values.some((val) => !val)){
    showAlert('กรุณากรอกข้อมูลให้ครบ', 'error')
    return false
  }

  return true
};

export const resetForm = (formRef) => {
  Object.keys(formRef).forEach((key) => {
    delete formRef[key];
  });
};
