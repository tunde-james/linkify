import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import { Button } from "../components/button";
import uploadImage from "/images/icon-upload-image.svg";
import { useUpdateUserProfile, useFetchCurrentUser } from "../hooks/use-auth";

const formSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().optional(),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "Image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
  });

export type UserFormData = z.infer<typeof formSchema>;

const ProfileDetailsPage = () => {
  const { currentUser, isLoading } = useFetchCurrentUser();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentUser?.profile?.imageUrl || null,
  );

  const { updateUserProfile, isPending } = useUpdateUserProfile();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: currentUser,
    mode: "onChange",
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        email: currentUser.email || "",
        firstName: currentUser.profile?.firstName || "",
        lastName: currentUser.profile?.lastName || "",
        imageUrl: currentUser.profile?.imageUrl || "",
      });

      // Also update the preview image when currentUser changes
      setPreviewImage(currentUser.profile?.imageUrl || null);
    }
  }, [currentUser, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedImage(file);
      setValue("imageFile", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: UserFormData) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);

    if (selectedImage) {
      formData.append("imageFile", selectedImage);
    }

    updateUserProfile(formData);
  };

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const isFormValid = !!firstName && !!lastName;

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 pt-4">
        <div className="container">
          <div className="rounded-xl bg-white">
            {isLoading ? (
              <div className="p-6 text-center">Loading profile data...</div>
            ) : (
              <>
                <div className="mb-6 p-6">
                  <h2 className="mb-2 text-2xl leading-[150%] font-bold text-black">
                    Profile Details
                  </h2>

                  <p className="text-gray mb-10 w-[295px] leading-[150%]">
                    Add your details to create a personal touch to your profile.
                  </p>

                  <div className="rounded-xl bg-gray-50 p-5">
                    <p className="text-gray mb-4 leading-[150%]">
                      Profile picture
                    </p>

                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <div className="mb-6">
                        {!previewImage ? (
                          <div className="bg-primary-50 flex h-[193px] w-[193px] flex-col items-center justify-center rounded-xl px-10 py-[60px]">
                            <img
                              src={uploadImage}
                              alt="Upload image icon"
                              className="object-cover"
                            />

                            <p className="text-primary mt-2 text-sm leading-[150%] font-semibold">
                              + Upload Image
                            </p>
                          </div>
                        ) : (
                          <div className="relative h-[193px] w-[193px]">
                            <img
                              src={previewImage}
                              alt="Profile image preview"
                              className="absolute inset-0 h-full w-full rounded-xl object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <p className="text-gray w-[255px] text-sm leading-[150%]">
                      Image must be below 1024x1024px. Use PNG or JPG format.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-5">
                  <div className="mx-auto space-y-6 rounded-xl bg-gray-50 p-5 md:max-w-[476px] md:bg-white md:px-10 md:py-10 lg:max-w-3xl">
                    <div className="relative flex w-full flex-col gap-1">
                      <label htmlFor="password" className="text-xs text-black">
                        First name<span>*</span>
                      </label>

                      <div
                        className={`group flex items-center gap-3 rounded-lg border border-gray-100 bg-inherit p-3 text-black transition-colors duration-200 ${errors.firstName ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:bg-white focus-within:ring-2 focus-within:shadow-2xs [&:not(:placeholder-shown)]:bg-white"}`}
                      >
                        <input
                          type="text"
                          id="firstName"
                          required
                          placeholder="At least 8 characters"
                          className="placeholder:text-gray-100 focus:outline-none"
                          aria-describedby="password-description"
                          {...register("firstName")}
                        />
                      </div>
                    </div>

                    <div className="relative flex w-full flex-col gap-1">
                      <label htmlFor="password" className="text-xs text-black">
                        Last name<span>*</span>
                      </label>

                      <div
                        className={`group flex items-center gap-3 rounded-lg border border-gray-100 bg-inherit p-3 text-black transition-colors duration-200 ${errors.lastName ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:bg-white focus-within:ring-2 focus-within:shadow-2xs [&:not(:placeholder-shown)]:bg-white"}`}
                      >
                        <input
                          type="text"
                          id="lastName"
                          placeholder="At least 8 characters"
                          className="placeholder:text-gray-100 focus:outline-none"
                          aria-describedby="password-description"
                          {...register("lastName")}
                        />
                      </div>
                    </div>

                    <div className="relative flex w-full flex-col gap-1">
                      <label htmlFor="email" className="text-xs text-black">
                        Email address
                      </label>

                      <div
                        className={`group flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-black transition-colors duration-200 ${errors.email ? "border-red" : "focus-within:ring-primary/20 focus-within:border-primary shadow-primary focus-within:bg-white focus-within:ring-2 focus-within:shadow-2xs [&:not(:placeholder-shown)]:bg-white"}`}
                      >
                        <input
                          type="email"
                          id="email"
                          disabled
                          placeholder="e.g. alex@email.com"
                          className="placeholder:text-gray-100 focus:bg-inherit focus:outline-none"
                          aria-describedby="email-description"
                          {...register("email")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="my-6">
                    <hr className="text-gray-100" />
                  </div>

                  <Button
                    type="submit"
                    disabled={!isFormValid || isPending}
                    className="w-full"
                  >
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDetailsPage;
