import axios, { AxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { cn } from "../../utils/cn";
import { getErrorMessage } from "../../utils/getErrorMessage";
import SpinnerCircle from "../../components/SpinnerCircle";
import { termsAndConditions } from "./termsAndCondText";

type RegisterFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  termsAccept: boolean;
};

function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { register, handleSubmit, getValues, formState } =
    useForm<RegisterFormValues>();
  const { errors, isSubmitting } = formState;

  const navigate = useNavigate();

  const onSubmitHandler: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      await axios.post("/auth/register", data);
      Swal.fire({
        title: "You have been successfully registered!",
        showConfirmButton: true,
        confirmButtonText: "Sign in",
        confirmButtonColor: "#a78bfa",
      }).then(() => {
        navigate("/login", { replace: true });
      });
    } catch (err) {
      let errorMessage;
      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message === "ER_DUP_ENTRY"
            ? "Username has to be unique"
            : err.response?.data?.message;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage || getErrorMessage(err),
      });
    }
  };

  return (
    <div className="bg-[#EBE6FE] min-h-screen py-8 flex items-center justify-center">
      <div className="bg-violet-50 w-[92%] sm:w-[500px] lg:w-[600px] py-8 px-4 sm:px-8 min-h-96 rounded-lg drop-shadow-xl">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="font-semibold text-3xl text-gray-900 text-center">
            {"We're excited to have you on board!"}
          </h1>
          <p className="font-semibold mt-2 text-gray-800">
            Please fill out the form below to create your account.
          </p>

          <form
            className="w-full flex flex-col gap-4 mt-2"
            onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <label htmlFor="name">Name</label>
                {errors.name?.message && (
                  <span className="text-red-600 ml-2">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <input
                spellCheck="false"
                id="name"
                type="text"
                className="form-input"
                {...register("name", { required: "This field is required!" })}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <label htmlFor="email">Email</label>
                {errors.email?.message && (
                  <span className="text-red-600 ml-2">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <input
                id="email"
                spellCheck="false"
                // type="email"
                className="form-input"
                {...register("email", {
                  required: "This field is required!",
                  pattern: {
                    value: /^\s*[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\s*$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <label htmlFor="username">Username</label>
                {errors.username?.message && (
                  <span className="text-red-600 ml-2">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <input
                spellCheck="false"
                id="username"
                type="text"
                className="form-input"
                {...register("username", {
                  required: "This field is required!",
                  pattern: {
                    value: /^\S+$/,
                    message: "No whitespaces allowed",
                  },
                })}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <label htmlFor="password">Password</label>
                {errors.password?.message && (
                  <span className="text-red-600 ml-2">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  spellCheck="false"
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  className="form-input w-full"
                  {...register("password", {
                    required: "Please enter your password!",
                    minLength: {
                      value: 8,
                      message: "Password must contain at least 8 characters",
                    },
                  })}
                />

                <label className="absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer hover:scale-110 transition-transform">
                  <input
                    type="checkbox"
                    className="hidden"
                    onChange={() => {
                      setIsPasswordVisible((bool) => !bool);
                    }}
                  />
                  {isPasswordVisible ? (
                    <VscEye className="size-5" />
                  ) : (
                    <VscEyeClosed className="size-5" />
                  )}
                </label>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between mb-1">
                <label htmlFor="passwordConfirm">Password confirmation</label>
                {errors.passwordConfirm?.message && (
                  <span className="text-red-600 ml-2">
                    {errors.passwordConfirm.message}
                  </span>
                )}
              </div>
              <input
                spellCheck="false"
                id="passwordConfirm"
                type={isPasswordVisible ? "text" : "password"}
                className="form-input"
                {...register("passwordConfirm", {
                  required: "This field is required!",
                  validate: (value) => {
                    return (
                      value === getValues().password ||
                      "Passwords need to match"
                    );
                  },
                })}
              />
            </div>

            <div className="ml-1">
              <input
                id="termsAccept"
                type="checkbox"
                className={cn(
                  "h-3 w-3",
                  errors.termsAccept?.message ? "ring-2 ring-red-500" : ""
                )}
                {...register("termsAccept", {
                  required: "This field is required!",
                })}
              />
              <label
                htmlFor="termsAccept"
                className="text-gray-600 text-sm ml-2">
                {" "}
                I confirm that I have read and understood{" "}
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Terms and Conditions Agreement",
                      html: `<div style='text-align:start'>${termsAndConditions}</div>`,
                      icon: "info",
                      width: "clamp(50%, 800px, 90%)",
                      confirmButtonColor: "#a78bfa",
                      iconColor: "#a78bfa",
                    });
                  }}
                  className="text-violet-600 font-semibold">
                  the terms and conditions
                </button>
                , and I consent to abide by them.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row-reverse sm:items-center w-full sm:mt-5">
              <div className="mx-auto sm:mx-0 sm:ml-auto">
                <span>{"Already have an account? "}</span>
                <Link to={"/login"} className="text-violet-700 font-medium">
                  Sign in
                </Link>
              </div>

              <div className="mt-6 sm:mt-0 mx-auto sm:mx-0 sm:mr-auto">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-violet-400 h-10 w-32 px-10 py-2 mx-auto rounded-md hover:bg-violet-400/90 transition-colors">
                  <span className="font-semibold text-slate-700">
                    {isSubmitting ? (
                      <SpinnerCircle iconClassName="size-6" />
                    ) : (
                      "Register"
                    )}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
