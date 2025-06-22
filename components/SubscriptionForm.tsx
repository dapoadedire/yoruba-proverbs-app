"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubscribeSchema,
  useSubscription,
  type SubscriptionData,
} from "../hooks/useSubscription";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function SubscriptionForm() {
  const { subscribe, isLoading, isError, error } = useSubscription();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionData>({
    resolver: zodResolver(SubscribeSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: SubscriptionData) => {
    subscribe(data, {
      onSuccess: () => {
        toast.success("You've been subscribed to weekly Yoruba proverbs!");
        setShowSuccess(true);
        reset();
      },
      onError: (error) => {
        toast.error(error.error || "Failed to subscribe. Please try again.");
      },
    });
  };

  if (showSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Subscription Confirmed!
        </h3>
        <p className="text-green-700 mb-4">
          You&apos;ll receive Yoruba proverbs in your inbox every weekend.
        </p>
        <button
          onClick={() => setShowSuccess(false)}
          className="text-green-700 underline font-medium"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-amber-900 mb-2">
        Subscribe to Weekly Proverbs
      </h3>
      <p className="text-amber-800 mb-4">
        Receive a new Yoruba proverb in your inbox every weekend.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-amber-800 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            {...register("name")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.name
                ? "border-red-300 focus:ring-red-200"
                : "border-amber-200 focus:ring-amber-200"
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-amber-800 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="your.email@example.com"
            {...register("email")}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              errors.email
                ? "border-red-300 focus:ring-red-200"
                : "border-amber-200 focus:ring-amber-200"
            }`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Subscribe Now</span>
            </>
          )}
        </button>

        {isError && (
          <div className="mt-3 text-center text-red-600 text-sm">
            {error?.error || "An error occurred. Please try again."}
          </div>
        )}
      </form>
    </div>
  );
}
