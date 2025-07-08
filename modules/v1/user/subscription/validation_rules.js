const checkValidatorRules = {
  addSubscriptionplansValidation: {
    name: "required",
    price: "required",

  },
  addProductRatingValidation: {
    rating: "required",
    user_id: "required",
    product_id: "required"
  }

};

export default checkValidatorRules;
