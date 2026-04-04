import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    await login(data);
    navigate("/app");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Email" {...register("email")} />
      <input type="password" placeholder="Password" {...register("password")} />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;