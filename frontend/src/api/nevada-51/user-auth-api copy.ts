import { LoginFormData } from "../../pages/login-page";
import { RegisterFormData } from "../../pages/register-page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/auth-store";
import { useToastStore } from "../../store/toast-store";

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

  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: async (): Promise<IUser> => {
      const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching user.");
      }

      return response.json();
    },
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

  const { mutate: signupUser, isPending } = useMutation({
    mutationFn: async (formData: RegisterFormData) => {
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
    },

    onSuccess: async () => {
      showToast({ message: "Registration successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/customize-link");
    },
    onError: (error: Error) => {
      showToast({ message: error.message || "Signup failed", type: "ERROR" });
    },
  });

  return { signupUser, isPending };
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: async (formData: LoginFormData) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

      return responseBody;
    },
    onSuccess: async () => {
      showToast({ message: "Login successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/customize-link");
    },
    onError: (error: Error) => {
      showToast({ message: error.message || "Login failed", type: "ERROR" });
    },
  });

  return { loginUser, isPending };
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: updateUserProfile, isPending } = useMutation({
    mutationFn: async (profileFormData: {
      firstName: string;
      lastName: string;
      imageFile?: File;
    }) => {
      let userId;

      // Get current user ID
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error fetching user.");
        }

        const userData = await response.json();
        userId = userData._id;
      } catch {
        throw new Error("Unable to get user ID for profile update");
      }

      if (profileFormData.imageFile) {
        const formData = new FormData();

        formData.append("firstName", profileFormData.firstName);
        formData.append("lastName", profileFormData.lastName);
        formData.append("imageFile", profileFormData.imageFile);

        const response = await fetch(
          `${API_BASE_URL}/api/user/profile/${userId}`,
          {
            method: "PUT",
            credentials: "include",
            body: formData,
          },
        );

        const responseBody = await response.json();

        if (!response.ok) {
          throw new Error(responseBody.message || "Error updating profile");
        }

        return responseBody;
      }
    },
    onSuccess: async () => {
      showToast({ message: "Profile updated successfully", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      await queryClient.invalidateQueries({ queryKey: ["fetchCurrentUser"] });
    },
    onError: (error: Error) => {
      console.error("Profile update error:", error);
      showToast({
        message: error.message || "Failed to update profile",
        type: "ERROR",
      });
    },
  });

  return { updateUserProfile, isPending };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout: storeLogout } = useAuthStore();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error logging out.");
      }
    },
    onSuccess: () => {
      storeLogout();
      queryClient.clear();
      navigate("/login");
    },
    onError: (error: Error) => {
      throw new Error(error.message);
    },
  });

  return { logout, isPending };
};
