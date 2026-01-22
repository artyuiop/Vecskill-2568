export const showModal = (id) => {
  document.getElementById(id).showModal();
};

export const CloseModal = (id) => {
  document.getElementById(id).close();
};

export const useValidate = () => {};

export const resetForm = (formRef) => {
  Object.keys(formRef).forEach((key) => {
    delete formRef[key];
  });
};
