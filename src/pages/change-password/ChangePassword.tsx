import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { checkUserPassword } from "../../services/apiUsers";
import Swal from "sweetalert2";
import { forceUserToLogIn } from "../../hooks/useHandleJwtExpiration";
import axios, { AxiosError } from "axios";
import { cn } from "../../utils/cn";
import SpinnerCircle from "../../components/SpinnerCircle";

type PasswordUpdateFormValues = {
  oldPassword?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
};

function ChangePassword() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isOldPasswordConfirmed, setIsOldPasswordConfirmed] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState, getValues, trigger } =
    useForm<PasswordUpdateFormValues>();
  const { errors } = formState;

  const onSubmitHandler: SubmitHandler<PasswordUpdateFormValues> = async (
    data
  ) => {
    setIsUpdating(true);
    try {
      const res = await axios.patch("/users/password-update", data);
      if (res.data.success) {
        forceUserToLogIn(navigate);
      }
    } catch (err) {
      Swal.fire({
        title: "Something went wrong while updating password",
        icon: "error",
        background: document.documentElement.classList.contains("dark")
          ? "#20232a"
          : undefined,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckCurrentPassword = async () => {
    const oldPassword = getValues("oldPassword");
    trigger("oldPassword");
    if (!oldPassword || oldPassword.length < 8) return;
    setIsUpdating(true);
    try {
      const res = await checkUserPassword(oldPassword);
      if (res?.success) setIsOldPasswordConfirmed(true);
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response?.data?.message === "jwt_error"
      ) {
        forceUserToLogIn(navigate);
      } else {
        Swal.fire({
          title: "Incorrect password. Try again.",
          icon: "error",
          background: document.documentElement.classList.contains("dark")
            ? "#20232a"
            : undefined,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col items-center max-w-7xl mx-auto text-inherit bg-white dark:bg-[#20232a] rounded-lg px-3 mt-4 sm:px-7 pb-20 pt-16 dark:text-gray-300 drop-shadow-sm">
      {/* 1-ST STEP - Checking old password */}
      {!isOldPasswordConfirmed && (
        <div className="flex flex-col items-center w-full">
          <span className="text-2xl">Enter your current password</span>
          <div className="flex items-end gap-5 mt-14 my-8">
            <label className="mb-0.5" htmlFor="oldPassword">
              Password:
            </label>
            <div className="relative">
              {errors.oldPassword && (
                <span className="text-red-600 absolute -top-5 text-sm text-nowrap right-0">
                  {errors.oldPassword.message}
                </span>
              )}
              <div>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  spellCheck="false"
                  id="oldPassword"
                  {...register("oldPassword", {
                    required: "Please enter your password!",
                    minLength: {
                      value: 8,
                      message: "Password must contain at least 8 characters",
                    },
                  })}
                  className={cn(
                    "w-60 px-2 h-8 border rounded bg-gray-50/70 dark:bg-gray-100 focus:bg-slate-50 dark:text-slate-900",
                    errors.oldPassword ? "border-red-300" : null
                  )}
                />
                <label className="text-gray-700 absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer hover:scale-110 transition-transform">
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
          </div>
          <div className="px-24 text-gray-900 flex basis-10 justify-center gap-14 w-full">
            <button
              type="button"
              onClick={handleCheckCurrentPassword}
              className="min-w-24 px-3 py-1 rounded drop-shadow-sm bg-indigo-300 hover:bg-indigo-400"
              disabled={isUpdating}>
              {isUpdating ? (
                <SpinnerCircle iconClassName="size-6" />
              ) : (
                "Confirm"
              )}
            </button>
            <button
              className="min-w-24 px-3 py-1 bg-red-400 rounded drop-shadow-sm hover:bg-red-500"
              type="button"
              onClick={() => {
                navigate(-1);
              }}>
              Back
            </button>
          </div>
        </div>
      )}

      {/* 2-ND STEP - Setting new password */}
      {isOldPasswordConfirmed && (
        <div className="flex flex-col items-center w-full">
          <span className="text-2xl">Enter your new password</span>
          <div className="flex flex-col items-end">
            <div className="flex items-end gap-5 mt-14 mb-6">
              <label className="mb-0.5" htmlFor="newPasword">
                New password:
              </label>
              <div className="relative">
                {errors.newPassword && (
                  <span className="text-red-600 absolute -top-5 text-nowrap right-0 text-sm">
                    {errors.newPassword.message}
                  </span>
                )}
                <div>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    spellCheck="false"
                    id="newPasword"
                    {...register("newPassword", {
                      required: "Please enter your new password!",
                      minLength: {
                        value: 8,
                        message: "Password must contain at least 8 characters",
                      },
                    })}
                    className={cn(
                      "w-60 px-2 h-8 border rounded bg-gray-50/70 dark:bg-gray-100 focus:bg-slate-50 dark:text-slate-900",
                      errors.newPassword ? "border-red-300" : null
                    )}
                  />
                  <label className="text-gray-700 absolute top-1/2 -translate-y-1/2 right-2 hover:cursor-pointer hover:scale-110 transition-transform">
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
            </div>

            <div className="flex items-end gap-5 mb-8">
              <label className="mb-0.5" htmlFor="newPasswordConfirmation">
                Confirm password:
              </label>
              <div className="relative">
                {errors.newPasswordConfirmation && (
                  <span className="text-red-600 absolute -top-5 text-nowrap right-0 text-sm">
                    {errors.newPasswordConfirmation.message}
                  </span>
                )}
                <div>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    spellCheck="false"
                    id="newPasswordConfirmation"
                    {...register("newPasswordConfirmation", {
                      required: "Please confirm your new password!",
                      validate: (value, allValues) =>
                        value === allValues.newPassword ||
                        "Passwords need to match",
                    })}
                    className={cn(
                      "w-60 px-2 h-8 border rounded bg-gray-50/70 dark:bg-gray-100 focus:bg-slate-50 dark:text-slate-900",
                      errors.newPasswordConfirmation ? "border-red-300" : null
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-24 text-gray-900 flex basis-10 justify-evenly w-full">
            <button
              className="basis-24 px-3 py-1 rounded drop-shadow-sm bg-indigo-300 hover:bg-indigo-400"
              disabled={isUpdating}>
              {isUpdating ? (
                <SpinnerCircle iconClassName="size-6" />
              ) : (
                "Confirm"
              )}
            </button>
            <button
              className="basis-24 px-3 py-1 bg-red-400 rounded drop-shadow-sm hover:bg-red-500"
              type="button"
              onClick={() => {
                navigate(-1);
              }}>
              Back
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default ChangePassword;
