/* eslint-disable prettier/prettier */
import { BlogHeader } from "@/components/blog-card";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          
          <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const title = "Admin Yield Management Dashboard";
  const description = "Welcome " + session?.user.name + " to the yield management dashboard.";

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
      </div>
    </main>
  );
}
