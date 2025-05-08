import { Slot } from 'expo-router';
import { View, StyleSheet, Image } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo-placeholder.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
});
