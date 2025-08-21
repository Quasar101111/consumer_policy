//utils/userValidations.ts
import * as yup from 'yup';




export const userSchema = yup.object().shape({
    userName: yup.string().required("Username is required")
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
.matches(/^\S+$/, "Username cannot contain spaces"),


    email: yup.string().email("Invalid email format")
    .required("Email is required"),

    password: yup.string().required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, "Password must include at least one letter, one number, and one special character"),

    confirmPassword : yup.string().required("Confirm password is required")
    .oneOf([yup.ref('password')],"passwords must match")


})

export type userValues = yup.InferType<typeof userSchema>;