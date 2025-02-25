import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Navbar from "../components/navbar";
import iconEmail from "../assets/icon-email.svg";
import iconPassword from "../assets/icon-password.svg";
import { Button } from "../components/button";
import { useRegisterUser } from "../api/user-api";
import { useAuthStore } from "../store/auth-store";
import { useToastStore } from "../store/toast-store";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(8, "must be at least 8 characters long"),
    // .regex(/[A-Z]/, "must contain at least one uppercase letter")
    // .regex(/[0-9]/, "must contain at least one one number")
    // .regex(
    //   /[!@#$%^&*]/,
    //   "must contain at least one special character",
    // ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser, isPending } = useRegisterUser();
  const setUser = useAuthStore((state) => state.setUser);
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      await registerUser(formData);
      setUser({ email: formData.email });
      showToast({ message: "Registration successful", type: "SUCCESS" });
      navigate("/customize-link");
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : "Registration failed",
        type: "ERROR",
      });
    }
  };

  return (
    <div className="container py-12 md:bg-gray-50">
      <div className="mb-16 flex items-center justify-start md:justify-center">
        <Navbar />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto space-y-6 md:max-w-[476px] md:rounded-xl md:bg-white md:px-10 md:py-10 lg:max-w-3xl"
      >
        <div className="mb-10">
          <h1 className="mb-2 text-2xl leading-9 font-bold">Create account</h1>
          <p className="text-gray leading-6">
            Let’s get you started sharing your links!
          </p>
        </div>

        <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="email">Email address</label>

          <div
            className={`group flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-black transition-colors duration-200 ${errors.email ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:ring-2 focus-within:shadow-2xs"}`}
          >
            <img src={iconEmail} alt="envelope icon" className="h-4 w-4" />
            <input
              type="text"
              id="email"
              placeholder="e.g. alex@email.com"
              className="placeholder:text-gray-100 focus:bg-inherit focus:outline-none"
              aria-describedby="email-description"
              {...register("email")}
            />
          </div>

          {errors.email ? (
            <p className="text-red text-xs md:absolute md:top-[60%] md:right-6">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="password">Create password</label>

          <div
            className={`group flex items-center gap-3 rounded-lg border border-gray-100 bg-inherit p-3 text-black transition-colors duration-200 ${errors.password ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:ring-2 focus-within:shadow-2xs"}`}
          >
            <img src={iconPassword} alt="envelope icon" className="h-4 w-4" />
            <input
              type="password"
              id="password"
              placeholder="At least 8 characters"
              className="placeholder:text-gray-100 focus:outline-none"
              aria-describedby="password-description"
              {...register("password")}
            />
          </div>

          {errors.password ? (
            <p className="text-red text-xs md:absolute md:top-[60%] md:right-6">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="relative flex w-full flex-col gap-1">
          <label htmlFor="confirmPassword">Confirm password</label>

          <div
            className={`group flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-black transition-colors duration-200 ${errors.password ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:ring-2 focus-within:shadow-2xs"}`}
          >
            <img src={iconPassword} alt="envelope icon" className="h-4 w-4" />
            <input
              type="password"
              id="confirmPassword"
              placeholder="At least 8 characters"
              className="placeholder:text-gray-100 focus:outline-none"
              aria-describedby="password-description"
              {...register("confirmPassword")}
            />
          </div>

          {errors.confirmPassword ? (
            <p className="text-red text-xs md:absolute md:top-[60%] md:right-6">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <p className="text-gray text-xs leading-[18px]">
          Password must contain at least 8 characters
        </p>

        <Button disabled={isPending} type="submit" className="w-full">
          {isPending ? "Please wait..." : "Create new account"}
        </Button>

        <div className="text-gray text-center leading-6">
          <p>Already have an account?</p>{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
