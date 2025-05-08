import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function Onboarding() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Let's Get Started</Text>
      <Text style={styles.subtitle}>Tell us about your health goals</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What are your fitness goals?</Text>
        <Text style={styles.cardText}>We'll customize your experience based on your goals</Text>
        
        <Link href="/onboarding/goals" style={styles.button}>
          <Text style={styles.buttonText}>Weight Loss</Text>
        </Link>
        
        <Link href="/onboarding/goals" style={styles.button}>
          <Text style={styles.buttonText}>Muscle Gain</Text>
        </Link>
        
        <Link href="/onboarding/goals" style={styles.button}>
          <Text style={styles.buttonText}>Maintenance</Text>
        </Link>
        
        <Link href="/onboarding/goals" style={styles.button}>
          <Text style={styles.buttonText}>Athletic Performance</Text>
        </Link>
        
        <Link href="/onboarding/goals" style={styles.button}>
          <Text style={styles.buttonText}>General Wellness</Text>
        </Link>
      </View>
      
      <Text style={styles.note}>You can change your goals anytime in settings</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  note: {
    fontSize: 14,
    color: '#999',
    marginTop: 20,
  },
});
