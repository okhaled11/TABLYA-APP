import * as yup from "yup";
export const LoginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email not valid"),
    password: yup
      .string()
      .trim()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters."),
  })
  .required();

export const registerSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name should contain only letters")
      .min(3, "First name should be at least 3 characters."),
    lastName: yup
      .string()
      .trim()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name should contain only letters")
      .min(3, "Last name should be at least 3 characters."),
    email: yup
      .string()
      .trim()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email not valid"),
    phone: yup
      .string()
      .trim()
      .required("Phone number is required")
      .matches(
        /^01[0-9]{9}$/,
        "Phone number must be a valid Egyptian number (e.g., 01012345678)"
      ),
    password: yup
      .string()
      .trim()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters."),
    confirmPassword: yup
      .string()
      .trim()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

export const registerSchemaPersonaChef = yup
  .object({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name should contain only letters")
      .min(3, "First name should be at least 3 characters.")
      .trim(),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(/^[A-Za-z\s]+$/, "Last name should contain only letters")
      .min(3, "Last name should be at least 3 characters.")
      .trim(),
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Email not valid")
      .trim(),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^01[0-9]{9}$/,
        "Phone number must be a valid Egyptian number (e.g., 01012345678)"
      )
      .trim(),
    selfie_with_id_url: yup
      .string()
      .url()
      .required("Upload selfie with your ID card"),
    id_card_front_url: yup
      .string()
      .url()
      .required("Upload National ID (Front Side)"),
    id_card_back_url: yup
      .string()
      .url()
      .required("Upload National ID (back Side)"),

  })
  .required();
export const registerSchemaKitchenChef = yup
  .object({
    KitchenName: yup
      .string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "First name should contain only letters")
      .min(3, "First name should be at least 3 characters.")
      .trim(),
    StartTime: yup
      .string()
      .required("Start time is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
      .trim(),

    EndTime: yup
      .string()
      .required("End time is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
      .test(
        "is-after-start",
        "End time must be after start time",
        function (value) {
          const { StartTime } = this.parent;
          if (!StartTime || !value) return true;
          return value > StartTime;
        }
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password should be at least 6 characters.")
      .trim(),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords must match")
      .trim(),


  })
  .required();
