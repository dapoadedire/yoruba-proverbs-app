import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

// Define the schema for form validation
export const SubscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(1, { message: "Name is required" }),
});

// Type inference from the schema
export type SubscriptionData = z.infer<typeof SubscribeSchema>;

type SubscriptionResponse = {
  message: string;
};

type SubscriptionError = {
  error: string;
  details?: Record<string, string>;
};

export const useSubscription = () => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const subscriptionMutation = useMutation<
    SubscriptionResponse,
    SubscriptionError,
    SubscriptionData
  >({
    mutationFn: async (data: SubscriptionData) => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // Update form errors state if validation errors are present
        if (errorData.details) {
          setFormErrors(errorData.details);
        }
        throw errorData;
      }

      setFormErrors({});
      return await response.json();
    },
  });

  return {
    subscribe: subscriptionMutation.mutate,
    isLoading: subscriptionMutation.isPending,
    isSuccess: subscriptionMutation.isSuccess,
    isError: subscriptionMutation.isError,
    error: subscriptionMutation.error,
    formErrors,
    resetFormErrors: () => setFormErrors({}),
  };
};
