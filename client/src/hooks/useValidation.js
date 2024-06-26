import { useEffect, useState } from "react";

function useValidation(fieldValues, validationType) {
  const [errors, setErrors] = useState({
    email: "",
    pass: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    beginning: "",
    general: "",
  });

  const [disableSubmit, setDisableSubmit] = useState(false);

  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const isPassword = (password) =>
    password.length > 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);
  const isAddress = (address = "") => address.includes("street");
  const isName = (name) => /^[A-Z][a-z]+$/.test(name);

  function checkFollowingEmptyFields(current) {
    const keys = Object.keys(fieldValues);
    const currentIndex = keys.indexOf(current);
    const keysAfterCurrent = keys.slice(currentIndex + 1);

    return keysAfterCurrent.some((key) => fieldValues[key] !== "");
  }

  const errorObj = {
    register: [
      {
        errorCond:
          !isEmail(fieldValues.email) && checkFollowingEmptyFields("email"),
        errorType: "email",
        message: "Email must be in the format example@mail.com",
      },
      {
        errorCond:
          !isPassword(fieldValues.pass) && checkFollowingEmptyFields("pass"),
        errorType: "pass",
        message:
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
      },
      {
        errorCond:
          !isName(fieldValues.firstName) &&
          checkFollowingEmptyFields("firstName"),
        errorType: "firstName",
        message:
          "First name must start with a capital letter and contain only letters",
      },
      {
        errorCond:
          !isName(fieldValues.lastName) &&
          checkFollowingEmptyFields("lastName"),
        errorType: "lastName",
        message:
          "Last name must start with a capital letter and contain only letters",
      },
      {
        errorCond:
          !/^\d{10}$/.test(fieldValues.phone) &&
          checkFollowingEmptyFields("phone"),
        errorType: "phone",
        message: "Phone number must contain 10 digits",
      },
      {
        errorCond:
          !isAddress(fieldValues.address) &&
          checkFollowingEmptyFields("address"),
        errorType: "address",
        message: "Address must contaion the word 'street'",
      },
      {
        errorCond: Object.values(fieldValues).some(
          (value) => value.length === 0
        ),
        errorType: "general",
        message: "",
      },
    ],
    login: [
      {
        errorCond:
          !isEmail(fieldValues.email) && checkFollowingEmptyFields("email"),
        errorType: "email",
        message: "Email must be in the format example@mail.com",
      },
      //rezolva asta cu specificitatea
      {
        errorCond:
          !isPassword(fieldValues.pass) &&
          Object.values(fieldValues).every((value) => value.length > 0),
        errorType: "pass",
        message:
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
      },
      {
        errorCond: Object.values(fieldValues).some(
          (value) => value.length === 0
        ),
        errorType: "general",
        message: "",
      },
    ],
  };

  useEffect(() => {
    const isError = errorObj[validationType].find((error) => error.errorCond);
    if (isError) {
      setErrors({ [isError.errorType]: isError.message });
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
      setErrors({});
    }
  }, [fieldValues]);

  return { errors, disableSubmit };
}

export default useValidation;
