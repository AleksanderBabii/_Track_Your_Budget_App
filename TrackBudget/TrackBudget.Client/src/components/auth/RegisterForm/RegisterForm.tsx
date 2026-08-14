import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { notify } from "../../../utils/toast";

import { register as registerUser } from "../../../api/authApi";
import { Button } from "../../common/Button/Button";
import { Input } from "../../common/Input/Input";
import { useAuthStore } from "../../../store/authStore";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../../utils/authSchemas";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import styles from "./RegisterForm.module.scss";

export function RegisterForm() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    // Registration schema validates password policy and confirmation match.
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: (response) => {
      // Auto-login right after successful registration.
      setSession(response.token, {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
      });

      notify.success("Registration successful");

      navigate("/dashboard", {
        replace: true,
      });
    },

    onError: (error) => {
      notify.error(getApiErrorMessage(error, "Registration failed"));
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Username"
        autoComplete="username"
        placeholder="Enter your username"
        error={errors.username?.message}
        {...register("username")}
      />

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
        autoComplete="new-password"
        placeholder="Enter your password"
        hint="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        className={styles.submitButton}
        isLoading={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
