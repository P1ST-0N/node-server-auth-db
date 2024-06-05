const userModelConst = {
  emailRegExp:
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  subscriptionTypes: ["starter", "pro", "business"],
  passwordMinLength: 5,
};

export default userModelConst;
