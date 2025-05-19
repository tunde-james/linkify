import { LoginFormData } from "../../pages/login-page";
import { RegisterFormData } from "../../pages/register-page";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

import { IUser } from "../../types";

export const fetchCurrentUser = async (): Promise<IUser> => {
  const response = await fetch(`${API_BASE_URL}/api/user/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching user.");
  }

  return response.json();
};

export const signupUserRequest = async (formData: RegisterFormData) => {
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

  return responseBody;
};

export const loginUserRequest = async (formData: LoginFormData) => {
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
};

// export const updateUserRequest = async (
//   userProfileFormData: FormData | { firstName: string; lastName: string },
// ) => {
//   let userId;

//   try {
//     const userData = await fetchCurrentUser();
//     userId = userData._id;
//   } catch {
//     throw new Error("Unable to get user ID for profile update");
//   }

//   // Determine if we're handling FormData or JSON data
//   const isFormData = userProfileFormData instanceof FormData;

//   // Use the same endpoint for both cases
//   const url = `${API_BASE_URL}/api/user/profile/${userId}`;

//   const requestOptions: RequestInit = {
//     method: "PUT",
//     credentials: "include",
//     body: isFormData
//       ? userProfileFormData
//       : JSON.stringify(userProfileFormData),
//   };

//   // Only add Content-Type header for JSON requests
//   // For FormData, let the browser set it with the correct boundary
//   if (!isFormData) {
//     requestOptions.headers = {
//       "Content-Type": "application/json",
//     };
//   }

//   const response = await fetch(url, requestOptions);
//   const responseBody = await response.json();

//   if (!response.ok) {
//     throw new Error(responseBody.message || "Error updating profile");
//   }

//   return responseBody;
// };

export const updateUserRequest = async (formData: FormData) => {
  let userId;

  try {
    const userData = await fetchCurrentUser();
    userId = userData._id;
  } catch {
    throw new Error("Unable to get userID for profile update");
  }

  const response = await fetch(`${API_BASE_URL}/api/user/profile/${userId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid.");
  }

  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error logging out.");
  }
};
