"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, AtSign } from "lucide-react";
import { authStore } from "@/store/authStore";
import Link from "next/link";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const register = authStore((state) => state.register);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await register(data.username, data.email, data.password);
      router.push("/chat");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#20B2AA]"></div>
            <p className="text-sm text-gray-600">Start your wellness journey.</p>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="text-sm text-gray-600">
            Join our supportive community. Safe, private, and always here for you.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <div className="relative">
              <AtSign className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                type="text"
                placeholder="e.g. johndoe"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...registerField("username")}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Nguyen Van A"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...registerField("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              School Email
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="student@university.edu.vn"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...registerField("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute right-12 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...registerField("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute right-12 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...registerField("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#20B2AA] py-3 font-semibold text-white transition-colors hover:bg-[#20B2AA]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already part of Tâm An?{" "}
          <Link
            href="/login"
            className="font-medium text-[#20B2AA] hover:text-[#20B2AA]/80"
          >
            Login here
          </Link>
        </div>

        {/* Terms */}
        <div className="mt-4 text-center text-xs text-gray-500">
          By registering, you agree to our{" "}
          <Link href="#" className="text-[#20B2AA] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#20B2AA] hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

