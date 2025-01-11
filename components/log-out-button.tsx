// app/components/LogoutButton.tsx
'use client';

import { signOut } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';
// import { useUser } from '@/app/context/UserContext';

export default function LogoutButton() {
	// const { setUser } = useUser();
	const { pending } = useFormStatus();

	return (
		<form action={signOut}>
			<button type="submit" disabled={pending} className="bg-red-500 hover:bg-red-700 text-xs text-white py-1 px-2 rounded">
				{pending ? '...' : 'Keluar'}
			</button>
		</form>
		
	);
}
