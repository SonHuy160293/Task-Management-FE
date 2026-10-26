import { useMutation } from '@tanstack/react-query';
import { registerAccount } from '@/features/auth/api/registration';
import type { RegisterRequest } from '@/features/auth/types/auth';

export function useRegistration() {
  return useMutation({
    mutationFn: (values: RegisterRequest) => registerAccount(values),
    retry: false,
    gcTime: 0,
  });
}
