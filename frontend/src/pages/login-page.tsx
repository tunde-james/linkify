import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Navbar from "../components/navbar";
import iconEmail from "../assets/icon-email.svg";
import iconPassword from "../assets/icon-password.svg";
import { Button } from "../components/button";

const formSchema = z.object({
  email: z.string().min(1, "Can’t be empty").email("Inavlid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[0-9]/, "Password must contain at least one one number")
  // .regex(
  //   /[!@#$%^&*]/,
  //   "Password must contain at least one special character",
  // ),
});

export type LoginFormData = z.infer<typeof formSchema>;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <div className="container pt-8 pb-[126px]">
      <div className="flex items-center justify-center">
        <Navbar />
      </div>

      <div className="pt-16">
        <h1 className="mb-2 text-2xl leading-9 font-bold">Create account</h1>
        <p className="text-gray leading-6">
          Let’s get you started sharing your links!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-10">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email address</label>

          <div
            className={`group relative flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-black transition-colors duration-200 ${errors.email ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:ring-2 focus-within:shadow-2xs"}`}
          >
            <img src={iconEmail} alt="envelope icon" className="h-4 w-4" />
            <input
              type="text"
              id="email"
              placeholder="e.g. alex@email.com"
              className="placeholder:text-gray-100 focus:outline-none"
              aria-describedby="email-description"
              {...register("email")}
            />
          </div>

          {errors.email ? (
            <p className="text-red absolute top-[290px] right-12 block text-xs">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Create password</label>

          <div
            className={`group relative flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-black transition-colors duration-200 ${errors.password ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:ring-2 focus-within:shadow-2xs"}`}
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
            <p className="text-red absolute top-[390px] right-12 block text-xs">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>

        <div className="text-gray text-center leading-6">
          <p>Don’t have an account?</p>{" "}
          <Link to="/register" className="text-primary">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
