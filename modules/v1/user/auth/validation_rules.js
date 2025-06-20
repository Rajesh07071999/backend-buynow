const checkValidatorRules = {
  loginValidation: {
    email: "required",
    password: "required",
  },
  registerValidation: {
    email: "required",
    password: "required",
    full_name:"required",
    mobile_number:"required",
    country_code:"required",
    
  },
  logoutValidation: {
    user_id: "required",
  },
  userdetailsValidation: {
    user_id: "required",
  },
  changepasswordValidation:{
    old_password: "required",
    new_password: "required",
  },
  editProfileValidation: {
    email: "required",
    password: "required",
    full_name:"required",
    mobile_number:"required",
    country_code:"required",
    id:"required"
  },
};

export default checkValidatorRules;
