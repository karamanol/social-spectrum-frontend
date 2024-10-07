import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegQuestionCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { cn } from "../../utils/cn";
import { useUpdateUser } from "../../hooks/reactQueryHooks/users/useUpdateUser";
import { useQueryClient } from "@tanstack/react-query";
import SpinnerCircle from "../../components/SpinnerCircle";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useHandleJwtExpiration } from "../../hooks/useHandleJwtExpiration";

export type ProfileUpdateFormValues = {
  name: string;
  username: string;
  email: string;
  country?: string;
  statusText?: string;
  languages?: string;
  bgPicture?: FileList;
  profilePicture?: FileList;
};

function UpdateProfile() {
  const { currentUser, refreshUserData } = useAuth();

  const { register, handleSubmit, formState } =
    useForm<ProfileUpdateFormValues>({
      defaultValues: {
        name: currentUser?.name,
        username: currentUser?.username,
        email: currentUser?.email,
        country: currentUser?.country,
        languages: currentUser?.languages,
        statusText: currentUser?.statusText,
      },
    });
  const { errors } = formState;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isUpdatingUser, error: updatingUserError } = useUpdateUser();

  useHandleJwtExpiration(updatingUserError);

  const onSubmitHandler: SubmitHandler<ProfileUpdateFormValues> = async (
    data
  ) => {
    mutate(data, {
      onSuccess: () => {
        refreshUserData(`${currentUser?.id}`);
        queryClient.refetchQueries();
        navigate(`/profile/${currentUser?.id}`);
        Swal.fire({
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          titleText: "Profile updated",
          scrollbarPadding: false,
          background: document.documentElement.classList.contains("dark")
            ? "#20232a"
            : undefined,
        });
      },
      onError: (err) => {
        Swal.fire({
          title:
            err instanceof AxiosError &&
            err.response?.data?.message === "ER_DUP_ENTRY"
              ? "Check if your username or email is unique"
              : "Error while updating profile",
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
          icon: "error",
          scrollbarPadding: false,
          background: document.documentElement.classList.contains("dark")
            ? "#20232a"
            : undefined,
        });
      },
    });
  };

  return (
    <div className="flex flex-col items-center max-w-7xl mx-auto text-inherit bg-white dark:bg-[#20232a] rounded-lg px-3 mt-4 sm:px-7 pt-10 pb-12 dark:text-gray-300 drop-shadow-sm">
      <span className="inline-block text-center text-2xl md:text-3xl w-full mb-3">
        Account settings
      </span>

      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col w-[330px] min-[400px]:w-[355px] min-[450px]:w-[380px] md:w-[450px] lg:w-[550px]">
        <div className="flex justify-between items-end">
          <label
            htmlFor="name"
            className="font-semibold text-sm md:text-base after:content-['*'] after:ml-0.5 after:text-red-400">
            Name
          </label>
          <div className="flex flex-col items-end justify-end h-14 text-sm md:text-base">
            {errors.name && (
              <span className="text-red-600 dark:text-red-500 mb-0.5 text-sm">
                {errors.name.message}
              </span>
            )}
            <input
              {...register("name", {
                required: "This field is required!",
                maxLength: {
                  value: 50,
                  message: "Name cannot take more than 50 characters",
                },
              })}
              spellCheck={false}
              disabled={isUpdatingUser}
              id="name"
              type="text"
              className={cn(
                "border rounded w-52 sm:w-56 lg:w-96 h-8 px-2 bg-gray-50/70 dark:bg-gray-200 focus:bg-slate-50 dark:text-slate-900",
                errors.name?.message ? "border-red-300" : ""
              )}
            />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <label
            htmlFor="username"
            className="font-semibold text-sm md:text-base after:content-['*'] after:ml-0.5 after:text-red-400">
            Username
          </label>
          <div className="flex flex-col items-end justify-end h-14 text-sm md:text-base">
            {errors.username && (
              <span className="text-red-600 dark:text-red-500 mb-0.5 text-sm">
                {errors.username.message}
              </span>
            )}
            <input
              {...register("username", {
                required: "This field is required!",
                maxLength: {
                  value: 50,
                  message: "Username cannot take more than 50 characters",
                },
                pattern: {
                  value: /^\S+$/,
                  message: "No whitespaces allowed",
                },
              })}
              spellCheck={false}
              disabled={isUpdatingUser}
              id="username"
              type="text"
              className={cn(
                "border rounded w-52 sm:w-56 lg:w-96 h-8 px-2 bg-gray-50/70 dark:bg-gray-200 focus:bg-slate-50 dark:text-slate-900",
                errors.username?.message ? "border-red-300" : ""
              )}
            />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <label
            htmlFor="email"
            className="font-semibold text-sm md:text-base after:content-['*'] after:ml-0.5 after:text-red-400"
            spellCheck={false}>
            E-mail
          </label>
          <div className="flex flex-col items-end justify-end h-14 text-sm md:text-base">
            {errors.email && (
              <span className="text-red-600 dark:text-red-500 mb-0.5 text-sm">
                {errors.email.message}
              </span>
            )}
            <input
              {...register("email", {
                required: "This field is required!",
                maxLength: {
                  value: 50,
                  message: "Email cannot take more than 50 characters",
                },
                pattern: {
                  value: /^\s*[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]+\s*$/,
                  message: "Please enter a valid email address",
                },
              })}
              disabled={isUpdatingUser}
              id="email"
              spellCheck={false}
              type="text"
              className={cn(
                "border rounded w-52 sm:w-56 lg:w-96 h-8 px-2 bg-gray-50/70 dark:bg-gray-200 focus:bg-slate-50 dark:text-slate-900",
                errors.email?.message ? "border-red-300" : ""
              )}
            />
          </div>
        </div>

        <div className="flex justify-between items-end mt-6">
          <label
            htmlFor="country"
            className="font-semibold text-sm md:text-base">
            Country
          </label>
          <input
            {...register("country", {
              maxLength: {
                value: 50,
                message: "Countries list cannot take more than 50 characters",
              },
            })}
            disabled={isUpdatingUser}
            type="text"
            id="country"
            className="w-52 sm:w-56 lg:w-96 border text-sm md:text-base rounded h-8 px-2 bg-gray-50/70 dark:bg-gray-200 focus:bg-slate-50 dark:text-slate-900"
          />
        </div>

        <div className="flex justify-between items-end">
          <label
            htmlFor="statusText"
            className="font-semibold text-nowrap text-sm md:text-base">
            Status text
          </label>
          <div className="w-96 flex flex-col items-end justify-end h-14 text-sm md:text-base">
            {errors.statusText && (
              <span className="text-red-600 dark:text-red-500 mb-0.5 text-sm">
                {errors.statusText.message}
              </span>
            )}
            <input
              maxLength={100}
              {...register("statusText", {
                maxLength: {
                  value: 100,
                  message: "Status should contain less than 100 symbols",
                },
              })}
              disabled={isUpdatingUser}
              id="statusText"
              spellCheck={false}
              type="text"
              className="w-52 sm:w-56 lg:w-96 border rounded h-8 px-2 bg-gray-50/70 dark:bg-gray-200 focus:bg-slate-50 dark:text-slate-900"
            />
          </div>
        </div>

        <div className="flex justify-between items-end mt-6">
          <div className="relative">
            <label
              htmlFor="languages"
              className="font-semibold text-sm md:text-base">
              Languages
            </label>
            {/* Tooltip */}
            <div className="group z-50">
              <FaRegQuestionCircle className="absolute right-0 top-0 translate-y-[35%] translate-x-6 text-gray-700 dark:text-gray-500 hover:cursor-pointer" />
              <div className="drop-shadow invisible absolute -top-[92px] -left-4 group-hover:visible text-slate-700 bg-gray-100 w-56 text-sm px-5 pt-3 pb-4 rounded-md after:block after:absolute after:translate-x-[72px] md:after:translate-x-[82px] after:rotate-45 after:translate-y-1 after:size-4 after:bg-gray-100 ">
                Comma-separated values. For example: English, Spanish, Chinese
              </div>
            </div>
          </div>
          <input
            {...register("languages", {
              maxLength: {
                value: 100,
                message: "Language list cannot take more than 100 characters",
              },
              pattern: {
                value: /^(\s*\w+\s*)(,\s*\w+\s*)*$/,
                message: "Values don't satisfy the pattern",
              },
            })}
            disabled={isUpdatingUser}
            type="text"
            id="languages"
            className={cn(
              "w-52 sm:w-56 lg:w-96 border text-sm md:text-base rounded h-8 px-2 bg-gray-50/70 dark:bg-gray-200 focus:bg-slate-50 dark:text-slate-900",
              errors.languages?.message ? "border-red-300 dark:border-2" : null
            )}
          />
        </div>

        <div className="flex justify-between items-end">
          <div className="relative">
            <span className="font-semibold text-nowrap text-sm md:text-base min-[400px]:after:content-['image']">
              {"Background "}
            </span>
            {/* Tooltip */}
            <div className="group z-50">
              <FaRegQuestionCircle className="absolute right-0 top-0 translate-y-[35%] translate-x-6 text-gray-700 dark:text-gray-500 hover:cursor-pointer" />
              <div className="drop-shadow invisible absolute -top-[53px] min-[400px]:left-8 -left-2 group-hover:visible text-slate-700 bg-gray-100 w-36 text-sm px-5 pt-3 pb-4 rounded-md after:block after:absolute after:translate-x-[4.7rem] md:after:translate-x-[5.7rem] after:rotate-45 after:translate-y-1 after:size-4 after:bg-gray-100">
                Max size: 500KB
              </div>
            </div>
          </div>
          <div className="w-96 flex flex-col items-end justify-end h-[3.6rem]">
            {errors.bgPicture && (
              <span className="text-red-600 dark:text-red-500 mb-0.5 text-sm">
                {errors.bgPicture.message}
              </span>
            )}
            <input
              accept="image/png, image/jpeg"
              {...register("bgPicture", {
                validate: (img) =>
                  (img && (img?.[0]?.size ?? 0) < 500000) ||
                  "Image size exceeded. Max size is 500KB",
              })}
              disabled={isUpdatingUser}
              type="file"
              className="border bg-gray-50/70 p-[1px] rounded w-52 sm:w-56 lg:w-96 dark:bg-gray-200 text-gray-600"
            />
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="relative">
            <span className="font-semibold text-nowrap text-sm md:text-base">
              Profile image
            </span>
            {/* Tooltip */}
            <div className="group z-50">
              <FaRegQuestionCircle className="absolute right-0 top-0 translate-y-[35%] translate-x-6 text-gray-700 dark:text-gray-500 hover:cursor-pointer" />
              <div className="drop-shadow invisible absolute -top-[53px] left-4 group-hover:visible text-slate-700 bg-gray-100 w-36 text-sm px-5 pt-3 pb-4 rounded-md after:block after:absolute after:translate-x-[3.5rem] md:after:translate-x-[4.1rem] after:rotate-45 after:translate-y-1 after:size-4 after:bg-gray-100">
                Max size: 500KB
              </div>
            </div>
          </div>
          <div className="w-96 flex flex-col items-end justify-end h-[3.6rem]">
            {errors.profilePicture && (
              <span className="text-red-600 dark:text-red-500 mb-0.5 text-sm">
                {errors.profilePicture.message}
              </span>
            )}
            <input
              accept="image/png, image/jpeg"
              {...register("profilePicture", {
                validate: (img) =>
                  (img && (img?.[0]?.size ?? 0) < 500000) ||
                  "Image size exceeded. Max size is 500KB",
              })}
              disabled={isUpdatingUser}
              type="file"
              className="border bg-gray-50/70 p-[1px] rounded w-52 sm:w-56 lg:w-96 dark:bg-gray-200 text-gray-600"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={"/profile/change-password"}
            className="mt-5 md:mt-3 underline text-blue-900 dark:text-blue-800 text-sm sm:text-base">
            Want to change password?
          </Link>
        </div>

        <div className="flex text-slate-800 justify-around md:justify-end gap-3 mt-5">
          <button
            className="flex items-center justify-center w-32 px-3 py-1 rounded drop-shadow-sm bg-indigo-300 hover:bg-indigo-400"
            type="submit"
            disabled={isUpdatingUser}>
            {isUpdatingUser ? (
              <SpinnerCircle
                iconClassName="size-5"
                containerClassName="w-32"
                loadingMessage="Saving..."
              />
            ) : (
              "Save changes"
            )}
          </button>
          <button
            className="px-3 py-1 bg-red-400 rounded drop-shadow-sm hover:bg-red-500"
            type="button"
            onClick={() => {
              navigate(-1);
            }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
