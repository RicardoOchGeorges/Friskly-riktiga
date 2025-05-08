import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './auth';

// This hook will protect the route access based on user authentication
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Skip protection during loading state
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    
    // If the user is not signed in and the initial segment is not in the auth or onboarding group
    if (!user && !inAuthGroup && !inOnboardingGroup) {
      // Redirect to the sign-in page
      router.replace('/auth/sign-in');
    } else if (user && inAuthGroup) {
      // If the user is signed in and the initial segment is in the auth group,
      // redirect to the dashboard
      router.replace('/dashboard');
    }
  }, [user, loading, segments, router]);
}

// Component to wrap the app with protected routes
export function ProtectedRouteProvider({ children }: { children: React.ReactNode }) {
  useProtectedRoute();
  return <>{children}</>;
}
