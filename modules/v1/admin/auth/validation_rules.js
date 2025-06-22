const checkValidatorRules = {
  loginValidation: {
    email: "required",
    password: "required",
  },
  logoutValidation: {
    user_id: "required",
  },
  admindetailsValidation: {
    user_id: "required",
  },
  changepasswordValidation:{
    old_password: "required",
    new_password: "required",
  },
  editprofileValidation:{
    firstname:"required",
    lastname:"required",
    email:"required",
    mobile_number:"required",
    country_code:"required"
  },
  userDetasilsValidations : {
    id  : "required"
  },
  deleteUserValidation:{
    id  : "required"

  },


   userChangeActiveStatusValidation:{
    id: "required",
    status: "required"
  }
};

export default checkValidatorRules;
