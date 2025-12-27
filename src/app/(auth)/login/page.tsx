"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Eye, EyeOff, Heart } from "lucide-react";
import { authStore } from "@/store/authStore";
import Link from "next/link";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = authStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(data.username, data.password);
      // Redirect to the original destination or chat
      const redirect = searchParams.get("redirect") || "/chat";
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        {/* Logo/Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#20B2AA]">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Welcome Back!
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          We are here to listen and support you.
        </p>

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
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm text-[#20B2AA] hover:text-[#20B2AA]/80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-12 text-gray-900 placeholder-gray-400 focus:border-[#20B2AA] focus:outline-none focus:ring-2 focus:ring-[#20B2AA]/20"
                {...register("password")}
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#20B2AA] py-3 font-semibold text-white transition-colors hover:bg-[#20B2AA]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-[#20B2AA] hover:text-[#20B2AA]/80"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 flex justify-center gap-4 text-sm text-gray-400">
        <Link href="#" className="hover:text-gray-600">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="#" className="hover:text-gray-600">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="#" className="hover:text-gray-600">
          Help Center
        </Link>
      </div>
    </div>
  );
}

