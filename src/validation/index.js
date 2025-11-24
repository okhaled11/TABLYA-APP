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
      .min(
        8,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
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
    specialty: yup.string().required("specialty  is required").trim(),
    password: yup
      .string()
      .required("Password is required")
      .min(
        8,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      )
      .trim(),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("password")], "Passwords must match")
      .trim(),
  })
  .required();

export const cookerProfileSchema = yup
  .object({
    kitchenName: yup
      .string()
      .required("Kitchen name is required")
      .matches(/^[A-Za-z\s]+$/, "Kitchen name should contain only letters")
      .min(3, "Kitchen name should be at least 3 characters.")
      .trim(),
    startTime: yup
      .string()
      .required("Start time is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
      .trim(),
    endTime: yup
      .string()
      .required("End time is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
      .test(
        "is-after-start",
        "End time must be after start time",
        function (value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true;
          return value > startTime;
        }
      ),
    specialty: yup.string().required("Specialty is required").trim(),
    chefDescription: yup
      .string()
      .max(300, "Description should not exceed 300 characters")
      .nullable()
      .trim(),
  })
  .required();

export const addMealSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Meal name is required")
      .min(3, "Meal name should be at least 3 characters")
      .max(50, "Meal name should not exceed 50 characters"),
    price: yup
      .number()
      .typeError("Meal price is required")
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? undefined : value
      )
      .required("Meal price is required")
      .positive("Price must be a positive number")
      .min(1, "Price must be at least 1 LE")
      .max(3000, "Price should not exceed 3,000 LE"),
    description: yup
      .string()
      .trim()
      .required("Meal description is required")
      .min(10, "Description should be at least 10 characters")
      .max(500, "Description should not exceed 500 characters"),
    isEditing: yup.boolean().notRequired(),
    image: yup
      .mixed()
      .test("requiredWhenCreate", "Meal image is required", function (value) {
        const isEditing = this?.parent?.isEditing;
        if (isEditing) return true; // optional in edit mode
        return !!value; // required in create mode
      })
      .test(
        "fileSize",
        "File size is too large (max 5MB)",
        (value) => !value || (value && value.size <= 5 * 1024 * 1024)
      )
      .test(
        "fileType",
        "Unsupported file format (only jpg, jpeg, png, webp allowed)",
        (value) =>
          !value ||
          (value &&
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
              value.type
            ))
      ),
    category: yup
      .string()
      .transform((value, originalValue) => {
        let v = originalValue;
        if (Array.isArray(v)) v = v[0];
        if (typeof v === "string") {
          v = v.replace(/^\"|\"$/g, "");
        }
        return v === "" || v == null ? undefined : v;
      })
      .required("Category is required")
      .oneOf(
        ["main dishes", "drinks", "desserts"],
        "Invalid category selected"
      ),
    stock: yup
      .number()
      .typeError("Stock quantity is required")
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? undefined : value
      )
      .required("Stock quantity is required")
      .integer("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .max(1000, "Stock should not exceed 1000 items"),
    preparation_time: yup
      .number()
      .typeError("Preparation time is required")
      .transform((value, originalValue) =>
        originalValue === "" || originalValue === null ? undefined : value
      )
      .required("Preparation time is required")
      .integer("Preparation time must be a whole number")
      .min(1, "Preparation time must be at least 1 minute")
      .max(300, "Preparation time should not exceed 300 minutes"),
  })
  .required();
