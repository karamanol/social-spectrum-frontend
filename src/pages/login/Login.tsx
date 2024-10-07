import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import SpinnerCircle from "../../components/SpinnerCircle";
import Swal from "sweetalert2";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { AxiosError } from "axios";

type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState } = useForm<LoginFormValues>();
  const { errors, isSubmitting } = formState;

  const onSubmitHandler: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      await login(data);
      navigate("/", { replace: true });
    } catch (err) {
      let errorMessage;
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage || getErrorMessage(err),
      });
    }
  };

  return (
    <div className="bg-[#EBE6FE] min-h-screen flex items-center justify-center">
      <div className="bg-violet-50 w-[92%] sm:w-[500px] py-8 px-4 sm:px-8 min-h-96 rounded-lg drop-shadow-xl m-3">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="font-semibold text-2xl text-gray-900 text-center">
            Welcome back to SocialSpectrum!
          </h1>
          <p className="font-semibold mt-2 text-gray-800">
            Please enter your details to sign in and connect with us.
          </p>

          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="w-full flex flex-col gap-4 mt-2">
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
                spellCheck="false"
                // type="email"
                id="email"
                className="form-input"
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /^\s*[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\s*$/,
                    message: "Please, enter a valid email address",
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
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  className="form-input w-full"
                  {...register("password", {
                    required: "Please enter your password!",
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

            <div className="flex flex-col sm:flex-row-reverse sm:items-center w-full sm:mt-5">
              <div className="mx-auto">
                <span>{"Don't have an account? "}</span>
                <Link to={"/register"} className="text-violet-700 font-medium">
                  Register
                </Link>
              </div>

              <div className="mt-6 sm:mt-0 mx-auto sm:mx-0 sm:mr-auto">
                <button
                  className="bg-violet-400 w-32 text-nowrap px-8 py-2 mx-auto rounded-md hover:bg-violet-400/90 transition-colors"
                  type="submit">
                  {isSubmitting ? (
                    <SpinnerCircle iconClassName="size-6" />
                  ) : (
                    <span className="font-semibold text-slate-700">
                      Sign in
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
