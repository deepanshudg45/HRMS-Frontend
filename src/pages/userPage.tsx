import { useUsers } from "@/hooks/useUser";

export const UsersPage = () => {
  const { data, isLoading } = useUsers();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {data?.map((u: any) => (
        <p key={u.id}>{u.name}</p>
      ))}
    </div>
  );
};