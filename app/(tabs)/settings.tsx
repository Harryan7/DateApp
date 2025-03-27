import React, { useState } from 'react';
import { StyleSheet, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

// Available languages
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'العربية' },
  { code: 'tr', name: 'Türkçe' },
];

interface SettingsItemProps {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

interface SettingsHeaderProps {
  title: string;
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [activeDistance, setActiveDistance] = useState(50); // in miles/km
  const [ageRange, setAgeRange] = useState({ min: 18, max: 35 });
  const [showMen, setShowMen] = useState(false);
  const [showWomen, setShowWomen] = useState(true);
  const [globalMode, setGlobalMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const SettingsItem = ({ icon, title, value, onPress, isToggle = false, toggleValue = false, onToggle = () => {} }: SettingsItemProps) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} disabled={isToggle}>
      <ThemedView style={styles.settingsIcon}>
        <IconSymbol name={icon} size={20} color="#777" />
      </ThemedView>
      <ThemedView style={styles.settingsContent}>
        <ThemedText style={styles.settingsTitle}>{title}</ThemedText>
        {value && <ThemedText style={styles.settingsValue}>{value}</ThemedText>}
      </ThemedView>
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#EAEAEA', true: Colors[colorScheme ?? 'light'].tint }}
          thumbColor={'white'}
        />
      ) : (
        <IconSymbol name="chevron.right" size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  const SettingsHeader = ({ title }: SettingsHeaderProps) => (
    <ThemedView style={styles.settingsHeader}>
      <ThemedText style={styles.settingsHeaderText}>{title}</ThemedText>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>

      <ThemedView style={styles.accountContainer}>
        <ThemedView style={styles.accountImagePlaceholder}>
          <IconSymbol name="person.fill" size={40} color="white" />
        </ThemedView>
        <ThemedView style={styles.accountInfo}>
          <ThemedText style={styles.accountName}>John, 28</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.accountEdit}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <SettingsHeader title="Discovery Settings" />
      <ThemedView style={styles.settingsGroup}>
        <SettingsItem
          icon="location"
          title="Location"
          value="Current Location"
          onPress={() => {}}
        />
        <SettingsItem
          icon="globe"
          title="Global Mode"
          isToggle
          toggleValue={globalMode}
          onToggle={(value) => setGlobalMode(value)}
        />
        <SettingsItem
          icon="ruler"
          title="Maximum Distance"
          value={`${activeDistance} miles`}
          onPress={() => {}}
        />
        <SettingsItem
          icon="person.2"
          title="Show Me"
          value={showMen && showWomen ? "Everyone" : showMen ? "Men" : "Women"}
          onPress={() => {}}
        />
        <SettingsItem
          icon="calendar"
          title="Age Range"
          value={`${ageRange.min} - ${ageRange.max}`}
          onPress={() => {}}
        />
      </ThemedView>

      <SettingsHeader title="Notifications" />
      <ThemedView style={styles.settingsGroup}>
        <SettingsItem
          icon="bell"
          title="Email"
          isToggle
          toggleValue={notifications}
          onToggle={(value) => setNotifications(value)}
        />
        <SettingsItem
          icon="iphone"
          title="Push Notifications"
          isToggle
          toggleValue={notifications}
          onToggle={(value) => setNotifications(value)}
        />
      </ThemedView>

      <SettingsHeader title="Privacy" />
      <ThemedView style={styles.settingsGroup}>
        <SettingsItem
          icon="eye.slash"
          title="Block Contacts"
          value=""
          onPress={() => {}}
        />
        <SettingsItem
          icon="hand.raised"
          title="Hide Account"
          value=""
          onPress={() => {}}
        />
      </ThemedView>

      <SettingsHeader title="Language" />
      <ThemedView style={styles.settingsGroup}>
        <SettingsItem
          icon="text.bubble"
          title="App Language"
          value={LANGUAGES.find(lang => lang.code === selectedLanguage)?.name}
          onPress={() => setShowLanguageSelector(!showLanguageSelector)}
        />
        
        {showLanguageSelector && (
          <ThemedView style={styles.languageSelector}>
            {LANGUAGES.map(language => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.languageItemSelected
                ]}
                onPress={() => {
                  setSelectedLanguage(language.code);
                  setShowLanguageSelector(false);
                }}
              >
                <ThemedText style={[
                  styles.languageText,
                  selectedLanguage === language.code && styles.languageTextSelected
                ]}>
                  {language.name}
                </ThemedText>
                {selectedLanguage === language.code && (
                  <IconSymbol name="checkmark" size={16} color={Colors[colorScheme ?? 'light'].tint} />
                )}
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}
      </ThemedView>

      <SettingsHeader title="Support" />
      <ThemedView style={styles.settingsGroup}>
        <SettingsItem
          icon="questionmark.circle"
          title="Help & Support"
          value=""
          onPress={() => {}}
        />
        <SettingsItem
          icon="doc.text"
          title="Terms of Service"
          value=""
          onPress={() => {}}
        />
        <SettingsItem
          icon="lock"
          title="Privacy Policy"
          value=""
          onPress={() => {}}
        />
        <SettingsItem
          icon="info.circle"
          title="About"
          value="Version 1.0.0"
          onPress={() => {}}
        />
      </ThemedView>

      <TouchableOpacity style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>Delete Account</ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 15,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  accountImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountEdit: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  settingsHeader: {
    padding: 15,
    backgroundColor: '#F8F8F8',
  },
  settingsHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
  },
  settingsGroup: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsValue: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  languageSelector: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  languageItemSelected: {
    backgroundColor: '#F8F8F8',
  },
  languageText: {
    fontSize: 16,
  },
  languageTextSelected: {
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 15,
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textDecorationLine: 'underline',
  },
}); 