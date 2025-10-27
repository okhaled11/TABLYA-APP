import * as yup from "yup";
export const LoginSchema = yup
  .object({
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email not valid"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters."),
  })
  .required();

export const registerSchema = yup
  .object({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name should contain only letters")
      .min(3, "First name should be at least 3 characters."),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name should contain only letters")
      .min(3, "Last name should be at least 3 characters."),
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email not valid"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^01[0-9]{9}$/,
        "Phone number must be a valid Egyptian number (e.g., 01012345678)"
      ),
    address: yup
      .string()
      .required("Address is required")
      .min(5, "Address should be at least 5 characters."),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters."),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();
