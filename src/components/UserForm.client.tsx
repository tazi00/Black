'use client';

import { useActionState, useEffect, useRef } from 'react';

import { createUserAction, type ActionState } from '@/app/actions';

import { SubmitButton } from './SubmitButton.client';

function UserForm() {
  const formRef = useRef<HTMLFormElement>(null);

  // wire up the action with initial state
  const [state, formAction] = useActionState<ActionState, FormData>(createUserAction, {
    ok: false,
  });

  // reset form on success
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" className="border rounded w-full p-2" />
        {state.fieldErrors?.name && (
          <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" name="email" className="border rounded w-full p-2" />
        {state.fieldErrors?.email && (
          <p className="text-sm text-red-600">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Bio</label>
        <textarea name="bio" rows={3} className="border rounded w-full p-2" />
        {state.fieldErrors?.bio && <p className="text-sm text-red-600">{state.fieldErrors.bio}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Avatar URL</label>
        <input name="avatarUrl" className="border rounded w-full p-2" />
        {state.fieldErrors?.avatarUrl && (
          <p className="text-sm text-red-600">{state.fieldErrors.avatarUrl}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
        {state.message && (
          <span className={state.ok ? 'text-green-700 text-sm' : 'text-red-700 text-sm'}>
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

export default UserForm;
