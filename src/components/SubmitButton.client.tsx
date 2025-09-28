'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded px-4 py-2 border">
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
