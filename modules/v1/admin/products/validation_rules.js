const checkValidatorRules = {
  addproductValidation: {
    name: "required",
    price: "required|numeric",
    description: "required",
    image: "required",
    category: "required",
    stock_count: "required"
  },
  editproductValidation: {
    name: "required",
    price: "required|numeric",
    description: "required",
    image: "required",
    category: "required",
    stock_count: "required",
    id: "required"
  },
  deleteproductValidation: {
    id: "required"
  }
};

export default checkValidatorRules;
