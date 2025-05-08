import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '../lib/auth';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // If user is already authenticated, redirect to dashboard
  const handleGetStarted = () => {
    if (user) {
      router.replace('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/logo-placeholder.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={styles.title}>Welcome to Friskly</Text>
      <Text style={styles.subtitle}>Your AI-powered calorie tracking companion</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      
      <View style={styles.authLinks}>
        <Text style={styles.authText}>Already have an account? </Text>
        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity>
            <Text style={styles.authLink}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authLinks: {
    flexDirection: 'row',
    marginTop: 20,
  },
  authText: {
    color: '#666',
    fontSize: 16,
  },
  authLink: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  // Keep for backward compatibility
  link: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  linkText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
