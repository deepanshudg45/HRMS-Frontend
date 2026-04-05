import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

type LoginFormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth) {
      setError("Authentication is unavailable right now.");
      return;
    }

    try {
      setError("");
      await auth.login(data);
      navigate("/app");
    } catch {
      setError("Unable to log in.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Email" {...register("email")} />
      <input type="password" placeholder="Password" {...register("password")} />
      {error ? <p>{error}</p> : null}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
