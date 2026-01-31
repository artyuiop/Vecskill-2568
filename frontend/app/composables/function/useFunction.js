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

// export const useValidate = (form) => {
//   const requiredFields = ['indic_id', 'score']; 
//   const isInvalid = requiredFields.some((field) => {
//     const val = form[field];
//     return val === null || val === undefined || val === '';
//   });

//   if(isInvalid){
//      return false
//   }
//   return true
// };

export const resetForm = (formRef) => {
  Object.keys(formRef).forEach((key) => {
    delete formRef[key];
  });
};
