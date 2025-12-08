import { useMutation } from "@tanstack/react-query";

import { toaster } from "@/components/ui/toaster";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTRPC } from "@/utils/trpc/client";
import type { RouterInput } from "@/utils/trpc/types";

export const useAuth = () => {
  const { authUser, signInEmailCallback, signOutCallback } = useAuthContext();
  const trpc = useTRPC();

  const signInEmailMutation = useMutation(trpc.user.singInEmail.mutationOptions({
    onSuccess: () => {
      toaster.create({
        title: 'User created',
        description: 'The user has been successfully created.',
        type: 'success',
        duration: 5000,
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Error creating user',
        description: error.message || 'An error occurred while logging in the user.',
        type: 'error',
        duration: 5000,
      });

      throw error;
    },
  }));

  const singInEmail = async (userData: RouterInput["user"]["singInEmail"]) => {
    const response = await signInEmailMutation.mutateAsync(userData);
    if (response) {
      signInEmailCallback(response);
    }
  };

  const singOutMutation = useMutation(trpc.user.signOut.mutationOptions({
    onSuccess: () => {
      toaster.create({
        title: 'Logged out',
        description: 'The user has been successfully logged out.',
        type: 'success',
        duration: 5000,
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Error logging out',
        description: error.message || 'An error occurred while logging out the user.',
        type: 'error',
        duration: 5000,
      });

      throw error;
    },
  }));

  const signOut = async () => {
    await singOutMutation.mutateAsync();
    signOutCallback();
  };

  return { authUser, singInEmail, signOut, isLoggedIn: !!authUser };
};