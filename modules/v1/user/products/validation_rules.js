const checkValidatorRules = {
  productListingValidation: {
    user_id: "required",
   
  },
  addProductRatingValidation:{
    rating: "required",
    user_id:"required",
    product_id:"required"
  }
  
};

export default checkValidatorRules;
