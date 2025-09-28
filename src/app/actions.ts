'use server';

import { revalidatePath } from 'next/cache';
import z from 'zod';

import { db } from '@/db';
import * as schema from '@/db/schema';

const { users, userProfiles } = schema;

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'bio' | 'avatarUrl', string>>;
};

const Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(500, 'Max 500 chars').optional(),
  avatarUrl: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export async function createUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // 1) Validate
  const parsed = Schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    bio: formData.get('bio'),
    avatarUrl: formData.get('avatarUrl'),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<'name' | 'email' | 'bio' | 'avatarUrl', string>> = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as 'name' | 'email' | 'bio' | 'avatarUrl';
      fieldErrors[k] = issue.message;
    }
    return { ok: false, fieldErrors, message: 'Please fix the errors.' };
  }

  const { name, email, bio, avatarUrl } = parsed.data;

  // 2) Mutate
  try {
    const [u] = await db.insert(users).values({ name, email }).returning({ id: users.id });

    if (u?.id !== undefined) {
      await db.insert(userProfiles).values({
        userId: u.id,
        bio: bio ?? null,
        avatarUrl: avatarUrl ?? null,
      });
    } else {
      return { ok: false, message: 'Failed to create user profile: user id is undefined.' };
    }

    // 3) Cache hygiene
    revalidatePath('/users');

    // 4) Return success (no redirect here, we show toast/clear form)
    return { ok: true, message: 'User created.' };
  } catch (err: unknown) {
    // Handle unique email, etc.
    console.error('CreateUserAction error:', err); // 👈 add this line
    const msg =
      err instanceof Error && /unique/i.test(err.message)
        ? 'Email already exists.'
        : 'Something went wrong.';
    return { ok: false, message: msg };
  }
}
