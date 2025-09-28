import UserForm from '@/components/UserForm.client';

function HomePage() {
  return (
    <main className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create user</h1>
      <UserForm />
    </main>
  );
}

export default HomePage;
