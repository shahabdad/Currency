import { StyleSheet, Text, View, useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#151718' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#ECEDEE' : '#11181C' }]}>
        Profile
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#9BA1A6' : '#687076' }]}>
        Manage your personal settings and preferences.
      </Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});
