import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  fetchCurrentUser,
  loginUserRequest,
  logoutUser,
  registerUserRequest,
  updateUserRequest,
  validateToken,
} from "../api/auth-api";
import { useAuthStore } from "../store/auth-store";
import { useToastStore } from "../store/toast-store";

export const useAuth = () => {
  const { setUser, setAuthenticated, setLoading, logout } = useAuthStore();

  // Validate token and fetch user data on app initialization
  const { isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        // First validate the token
        await validateToken();
        setAuthenticated(true);

        // Then fetch the user profile
        const userData = await fetchCurrentUser();
        setUser(userData);

        return userData;
      } catch {
        // If token validation fails, clear auth state
        logout();
        return null;
      } finally {
        setLoading(false);
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
    queryFn: fetchCurrentUser,
  });

  if (error) {
    showToast({ message: "Error fetching user.", type: "ERROR" });
  }

  return {
    currentUser,
    isLoading,
  };
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: registerUserRequest,
    onSuccess: async () => {
      showToast({ message: "Registration successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/customize-link");
    },
    onError: (error: Error) => {
      showToast({
        message: error.message || "Registration failed",
        type: "ERROR",
      });
    },
  });

  return { registerUser, isPending };
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: loginUserRequest,
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

  const {mutate: updateUserProfile, isPending} = useMutation({
    mutationFn: updateUserRequest,
    onSuccess: async () => {
      showToast({message: 'Profile updated successfully', type:'SUCCESS'});
      await queryClient.invalidateQueries({queryKey: ['auth']});
      await queryClient.invalidateQueries({queryKey: ['fetchCurrentUser']})
    },
    onError:(error: Error) => {
      showToast({message: error.message || 'Failed to update profile', type:'ERROR'})
    }
  })

  return {
    updateUserProfile,
    isPending
  }
}

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const showToast = useToastStore((state) => state.showToast);

  const { mutate, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      queryClient.clear();
      showToast({ message: "Logged out successfully", type: "SUCCESS" });
      navigate("/login");
    },
    onError: (error: Error) => {
      showToast({ message: error.message || "Logout failed", type: "ERROR" });
    },
  });

  return { logout: mutate, isPending };
};
