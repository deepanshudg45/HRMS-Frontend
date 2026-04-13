import { useState } from "react";

const RegisterPage = () => {
  const [message] = useState(
    "The current WITS backend only exposes asset APIs. Registration is not available yet."
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-semibold text-slate-900">
          Registration Unavailable
        </h1>

        <div className="space-y-4 text-sm text-slate-700">
          <p>{message}</p>
          <p>
            Use the login page for the current local role-based mock flow, or add auth endpoints
            in the backend before enabling registration here.
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
