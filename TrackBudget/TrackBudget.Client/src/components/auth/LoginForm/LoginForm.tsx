import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { notify } from "../../../utils/toast";

import { login } from "../../../api/authApi";
import { Button } from "../../common/Button/Button";
import { Input } from "../../common/Input/Input";
import { useAuthStore } from "../../../store/authStore";
import { loginSchema, type LoginFromValues } from "../../../utils/authSchemas";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import styles from "./LoginForm.module.scss";

export function LoginForm() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFromValues>({
    // Shared Zod schema keeps client-side auth validation centralized.
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      // Persist token + user in auth store for protected routes and API interceptor.
      setSession(response.token, {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
      });

      notify.success("Login successful");

      navigate("/dashboard", {
        // Replace avoids returning to login with browser back button.
        replace: true,
      });
    },

    onError: (error) => {
      notify.error(getApiErrorMessage(error, "Login failed"));
    },
  });

  const onSubmit = (values: LoginFromValues) => {
    loginMutation.mutate(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="primary"
        className={styles.submitButton}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
