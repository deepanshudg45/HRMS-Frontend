import { useForm } from "react-hook-form";
import api from "../lib/api";

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    await api.post("/auth/register", data);
    alert("Registered successfully");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Work Email" {...register("workEmail")} />
      <input placeholder="Password" type="password" {...register("password")} />
      <input placeholder="Employee Code" {...register("employeeCode")} />

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterPage;