import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/auth';

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'No email available',
    goal: 'Weight Loss',
    startWeight: '85 kg',
    currentWeight: '80 kg',
    targetWeight: '75 kg',
    dietaryPreference: 'Standard',
    activityLevel: 'Moderately Active',
    joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown',
  });

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.userInitials}>{userProfile.name.charAt(0)}</Text>
        </View>
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <Text style={styles.userJoinDate}>Member since {userProfile.joinDate}</Text>
      </View>

      {/* Health Goals Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Health Goals</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Goal Type</Text>
          <Text style={styles.infoValue}>{userProfile.goal}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Starting Weight</Text>
          <Text style={styles.infoValue}>{userProfile.startWeight}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Current Weight</Text>
          <Text style={styles.infoValue}>{userProfile.currentWeight}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Target Weight</Text>
          <Text style={styles.infoValue}>{userProfile.targetWeight}</Text>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Goals</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Dietary Preference</Text>
          <Text style={styles.infoValue}>{userProfile.dietaryPreference}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Activity Level</Text>
          <Text style={styles.infoValue}>{userProfile.activityLevel}</Text>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
      </View>

      {/* App Settings Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="notifications-outline" size={22} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
            thumbColor={notifications ? '#4CAF50' : '#f5f5f5'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="moon-outline" size={22} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
            thumbColor={darkMode ? '#4CAF50' : '#f5f5f5'}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="cloud-offline-outline" size={22} color="#333" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Offline Mode</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={setOfflineMode}
            trackColor={{ false: '#e0e0e0', true: '#a5d6a7' }}
            thumbColor={offlineMode ? '#4CAF50' : '#f5f5f5'}
          />
        </View>
      </View>

      {/* Account Information */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>User ID</Text>
          <Text style={styles.infoValue}>{user?.id ? user.id.substring(0, 8) + '...' : 'Not available'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || 'Not available'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email Verified</Text>
          <Text style={styles.infoValue}>{user?.email_confirmed_at ? 'Yes' : 'No'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Created</Text>
          <Text style={styles.infoValue}>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</Text>
        </View>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
      
      {/* Support & About */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Support & About</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={22} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={22} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="shield-outline" size={22} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="information-circle-outline" size={22} color="#333" style={styles.menuIcon} />
          <Text style={styles.menuLabel}>About Friskly</Text>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Friskly v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userCard: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userJoinDate: {
    fontSize: 14,
    color: '#999',
  },
  sectionCard: {
    margin: 15,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  editButtonText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuLabel: {
    fontSize: 16,
    flex: 1,
  },
  logoutButton: {
    margin: 15,
    marginTop: 0,
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
});
