// app/components/Navbar.tsx
import LogoutButton from '@/components/log-out-button';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Navbar() {

  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  return (
    <nav className="h-full w-full p-2 px-2 bg-[#ccffbc]">
      <div className="flex flex-col justify-center items-center gap-3 text-black">
        <span>{user.data.user?.email}</span>
        <p>Ahmad Yovan Ardiansyah</p>
        <LogoutButton /> {/* Komponen Client */}
      </div>
    </nav>
  );
}
