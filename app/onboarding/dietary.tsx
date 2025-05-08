import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function Dietary() {
  const router = useRouter();
  const [selectedDiet, setSelectedDiet] = useState('');

  const dietaryOptions = [
    { id: 'standard', label: 'Standard (No Restrictions)' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'gluten-free', label: 'Gluten-Free' },
  ];

  const handleContinue = () => {
    // In a real app, we would save this data to Supabase
    // For now, we'll just navigate to the next screen
    router.push('/onboarding/activity');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dietary Preferences</Text>
      <Text style={styles.subtitle}>Select your dietary lifestyle</Text>
      
      <View style={styles.card}>
        {dietaryOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.dietOption,
              selectedDiet === option.id && styles.selectedDiet
            ]}
            onPress={() => setSelectedDiet(option.id)}
          >
            <Text 
              style={[
                styles.dietOptionText,
                selectedDiet === option.id && styles.selectedDietText
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, !selectedDiet && styles.disabledButton]} 
        onPress={handleContinue}
        disabled={!selectedDiet}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      
      <Link href="/onboarding/goals" style={styles.backLink}>
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
  dietOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedDiet: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  dietOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedDietText: {
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
