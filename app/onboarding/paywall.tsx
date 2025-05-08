import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Paywall() {
  const router = useRouter();

  const handleSubscribe = () => {
    // In a real app, this would handle subscription logic with Supabase
    // For now, we'll just navigate to the dashboard
    router.push('/dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Unlock Friskly Premium</Text>
      <Text style={styles.subtitle}>Get full access to all features</Text>
      
      <View style={styles.card}>
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>AI-Powered Meal Recognition</Text>
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Personalized Nutrition Coaching</Text>
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Daily Missions & Rewards</Text>
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Detailed Progress Analytics</Text>
        </View>
        
        <View style={styles.featureRow}>
          <Text style={styles.checkmark}>✓</Text>
          <Text style={styles.featureText}>Unlimited Meal Logging</Text>
        </View>
      </View>
      
      <View style={styles.pricingCard}>
        <Text style={styles.pricingTitle}>Monthly Premium</Text>
        <Text style={styles.price}>$9.99<Text style={styles.perMonth}>/month</Text></Text>
        <Text style={styles.pricingSubtitle}>Cancel anytime</Text>
        
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pricingCard}>
        <Text style={styles.pricingTitle}>Annual Premium</Text>
        <Text style={styles.price}>$79.99<Text style={styles.perMonth}>/year</Text></Text>
        <Text style={styles.pricingSubtitle}>Save 33%</Text>
        
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/dashboard')}>
        <Text style={styles.skipButtonText}>Continue with Free Trial</Text>
      </TouchableOpacity>
      
      <Text style={styles.termsText}>
        By subscribing, you agree to our Terms of Service and Privacy Policy.
        Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f9f9f9',
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
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
  },
  pricingCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
    alignItems: 'center',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 10,
  },
  perMonth: {
    fontSize: 16,
    color: '#666',
  },
  pricingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    marginTop: 10,
    padding: 15,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});
