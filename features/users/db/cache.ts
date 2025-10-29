import { getGlobalTag, getUserTag } from '@/lib/dataCache';
import { revalidateTag } from 'next/cache';

export function getUserGlobalTag() {
  return getGlobalTag('users');
}

export function getUserIdTag(userId: string) {
  return getUserTag('users', userId);
}

export function revalidateUserCache(userId: string) {
  revalidateTag(getUserIdTag(userId), 'max');
  revalidateTag(getUserGlobalTag(), 'max');
}
