import { useMutation } from "@tanstack/react-query";

import { RegisterFormData } from "../pages/register-page";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useRegisterUser = () => {
  const registerRequest = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error(responseBody.message);
    }
  };

  const { mutateAsync: registerUser, isPending } = useMutation({
    mutationFn: registerRequest,
  });

  return {
    registerUser,
    isPending,
  };
};
