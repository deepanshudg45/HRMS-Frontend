import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../lib/api";

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState("");

  const onSubmit = async (data: any) => {
    await api.post("/auth/register", data);
    setSuccess("Registered successfully");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-semibold text-slate-900">Signin</h1>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Work Email"
            {...register("workEmail")}
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            placeholder="Employee Code"
            {...register("employeeCode")}
          />

          {success ? <p className="text-sm text-green-600">{success}</p> : null}

          <button
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white"
            type="submit"
          >
            Signin
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
