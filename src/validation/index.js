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
        username: yup
            .string()
            .required("Username is required")
            .min(5, "Username should be at least 5 characters."),
        email: yup
            .string()
            .required("Email is required")
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email not valid"),
        password: yup
            .string()
            .required("Password is required")
            .min(6, "Password should be at least 6 characters."),
        confirmPassword: yup
            .string()
            .required("Confirm Password is required")
            .oneOf([yup.ref("password")], "Passwords must match")
    })
    .required();
