const checkValidatorRules = {
  orderPlaceValidation: {
    product_id: "required",
    user_id: "required",
    qty: "required",
    price: "required",
    grand_total:"required"
  },
  orderCancelValidation:{
    id: "required",
    status: "required"
  }
 
};

export default checkValidatorRules;
