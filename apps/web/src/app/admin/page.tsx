import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1>NextAuth V4 and Next.js 15</h1>
      <p>User sign in with name {session?.user?.name}</p>
      <p>User sign in with email {session?.user?.email}</p>
      {session?.user?.image && (
        <Image
          src={session.user.image}
          width={48}
          height={48}
          alt={session.user.name ?? "Avatar"}
          className="rounded-full"
        />
      )}
    </div>
  );
}
