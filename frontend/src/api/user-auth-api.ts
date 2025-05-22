import { LoginFormData } from "../pages/login-page";
import { RegisterFormData } from "../pages/register-page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth-store";
import { useToastStore } from "../store/toast-store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface IUser {
  _id: string;
  email: string;
  profile?: {
    firstName: string | null;
    lastName: string | null;
    imageUrl?: string | null;
  };
}

export const useAuth = () => {
  const {
    setUser,
    setAuthenticated,
    setLoading,
    logout: storeLogout,
  } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        setLoading(true);

        // Validate token
        const tokenResponse = await fetch(
          `${API_BASE_URL}/api/auth/validate-token`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!tokenResponse.ok) {
          throw new Error("Token invalid.");
        }

        setAuthenticated(true);

        // Fetch user data
        const userResponse = await fetch(`${API_BASE_URL}/api/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error("Error fetching user.");
        }

        const userData = await userResponse.json();
        setUser(userData);
        setLoading(false);

        return userData;
      } catch {
        setAuthenticated(false);
        setUser(null);
        setLoading(false);
        storeLogout();

        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { isLoading };
};

export const useFetchCurrentUser = () => {
  const showToast = useToastStore((state) => state.showToast);

  const fetchCurrentUserRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error fetching user.");
    }

    return response.json();
  };

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: fetchCurrentUserRequest,
  });

  if (error) {
    console.error("Error fetching user:", error);
    showToast({ message: "Error fetching user.", type: "ERROR" });
  }

  return { currentUser, isLoading };
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const createUserRequest = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  };

  const {
    mutateAsync: createUser,
    isPending,
    isSuccess,
    error,
  } = useMutation({ mutationFn: createUserRequest });

  if (isSuccess) {
    showToast({ message: "Registration successful!", type: "SUCCESS" });
    queryClient.invalidateQueries({ queryKey: ["auth"] });
    navigate("/customize-link");
  }

  if (error) {
    showToast({ message: error.message || "Signup failed", type: "ERROR" });
  }

  return { createUser, isPending };
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const loginUserRequest = async (formData: LoginFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  };

  const {
    mutateAsync: loginUser,
    isPending,
    isSuccess,
    error,
  } = useMutation({ mutationFn: loginUserRequest });

  if (isSuccess) {
    showToast({ message: "Logged In", type: "SUCCESS" });
    queryClient.invalidateQueries({ queryKey: ["auth"] });
    navigate("/customize-link");
  }

  if (error) {
    showToast({ message: error.message || "Login failed", type: "ERROR" });
  }

  return { loginUser, isPending };
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const updateUserRequest = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user profile");
    }

    return response.json();
  };

  const {
    mutateAsync: updateUser,
    isPending,
    isSuccess,
    error,
  } = useMutation({ mutationFn: updateUserRequest });

  if (isSuccess) {
    showToast({ message: "User updated successfully", type: "SUCCESS" });
    queryClient.invalidateQueries({ queryKey: ["fetchCurrentUser"] });
  }

  if (error) {
    showToast({
      message: error.message || "Failed to update user",
      type: "ERROR",
    });
  }

  return { updateUser, isPending };
};

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const deleteProfileImageRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile/image`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete profile image");
    }

    return response.json();
  };

  const {
    mutateAsync: deleteProfileImage,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: deleteProfileImageRequest,
  });

  if (isSuccess) {
    showToast({
      message: "Profile image deleted successfully",
      type: "SUCCESS",
    });
    queryClient.invalidateQueries({ queryKey: ["fetchCurrentUser"] });
  }

  if (error) {
    showToast({
      message: error.message || "Failed to delete profile image",
      type: "ERROR",
    });
  }

  return { deleteProfileImage, isPending };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout: storeLogout } = useAuthStore();

  const logoutRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return response.json();
  };

  const {
    mutate: logout,
    isPending,
    isSuccess,
  } = useMutation({ mutationFn: logoutRequest });

  if (isSuccess) {
    queryClient.invalidateQueries({ queryKey: ["auth"] });
    storeLogout();
    queryClient.clear();
    navigate("/login");
  }

  return { logout, isPending };
};
