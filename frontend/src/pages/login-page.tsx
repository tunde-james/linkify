import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import iconEmail from "/images/icon-email.svg";
import iconPassword from "/images/icon-password.svg";
import { Button } from "../components/button";
// import { useLoginUser } from "../hooks/use-auth";
import Navbar from "../components/navbar";
import Container from "../components/container";
import { useLoginUser } from "../api/user-auth-api";

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
  const { loginUser, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (formData: LoginFormData) => {
    loginUser(formData);
  };

  return (
    <div className="min-h-full md:bg-gray-50">
      <Container>
        <div className="flex items-center justify-start pt-8 pb-12 md:justify-center">
          <Navbar />
        </div>

        <div className="flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:max-w-[476px] md:rounded-xl md:bg-white md:px-10 md:py-10 lg:max-w-3xl"
          >
            <div className="mb-10">
              <h1 className="mb-2 text-2xl leading-9 font-bold text-black md:text-[2rem] md:leading-12">
                Login
              </h1>
              <p className="text-gray leading-6">
                Add your details below to get back into the app
              </p>
            </div>

            <div className="relative flex w-full flex-col gap-1">
              <label htmlFor="email" className="text-xs text-black">
                Email address
              </label>

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
              <label htmlFor="password" className="text-xs text-black">
                password
              </label>

              <div
                className={`group flex items-center gap-3 rounded-lg border border-gray-100 bg-inherit p-3 text-black transition-colors duration-200 ${errors.password ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:ring-2 focus-within:shadow-2xs"}`}
              >
                <img
                  src={iconPassword}
                  alt="envelope icon"
                  className="h-4 w-4"
                />
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

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <div className="text-gray flex flex-col text-center leading-6 md:flex-row md:justify-center md:gap-0.5">
              <p>Don’t have an account?</p>{" "}
              <Link to="/register" className="text-primary">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
