import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Activity() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState('');

  const activityOptions = [
    { id: 'sedentary', label: 'Sedentary (Little to no exercise)' },
    { id: 'light', label: 'Lightly Active (1-3 days/week)' },
    { id: 'moderate', label: 'Moderately Active (3-5 days/week)' },
    { id: 'very', label: 'Very Active (6-7 days/week)' },
    { id: 'extreme', label: 'Extremely Active (Athletes, 2x/day)' },
  ];

  const handleContinue = () => {
    // In a real app, we would save this data to Supabase
    // For now, we'll just navigate to the next screen
    router.push('/onboarding/paywall');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activity Level</Text>
      <Text style={styles.subtitle}>How active are you on a weekly basis?</Text>
      
      <View style={styles.card}>
        {activityOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.activityOption,
              selectedActivity === option.id && styles.selectedActivity
            ]}
            onPress={() => setSelectedActivity(option.id)}
          >
            <Text 
              style={[
                styles.activityOptionText,
                selectedActivity === option.id && styles.selectedActivityText
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, !selectedActivity && styles.disabledButton]} 
        onPress={handleContinue}
        disabled={!selectedActivity}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      
      <Link href="/onboarding/dietary" style={styles.backLink}>
        <Text style={styles.backLinkText}>Back</Text>
      </Link>
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
  activityOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedActivity: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  activityOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedActivityText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
    marginTop: 20,
    padding: 10,
  },
  backLinkText: {
    color: '#666',
    fontSize: 16,
  },
});
