const checkValidatorRules = {
  addToCartValidation: {
    product_id: "required",
    user_id: "required",
    qty: "required",
    price: "required",
  },
  cartValidation:{
    user_id: "required",
  },
  removecartValidation:{
    id: "required",
  }
};

export default checkValidatorRules;
