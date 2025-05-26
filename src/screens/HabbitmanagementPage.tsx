import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateNewhabbitForm from '../components/CreateNewhabbitForm';
import CompletedHabitsList from '../components/CompletedHabitsList';

interface Habit {
  id: string;
  title: string;
  type: string;
  completedDates?: string[];
}

const HabitManagementPage = () => {
  const navigation = useNavigation() as any;
  const [modalVisible, setModalVisible] = useState(false);
  const [darkModeOn, setDarkModeOn] = useState(false);
  const [completedHabits, setCompletedHabits] = useState<Habit[]>([]);

  const changeDarkMode = () => {
    setDarkModeOn(prev => !prev);
  };

  const loadCompletedHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      const parsed: Habit[] = stored ? JSON.parse(stored) : [];

      const completed = parsed.filter(
        habit =>
          habit.completedDates &&
          Array.isArray(habit.completedDates) &&
          habit.completedDates.length > 0,
      );

      setCompletedHabits(completed);
    } catch (e) {
      console.error('Error loading completed habits:', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCompletedHabits();
    }, []),
  );

  return (
    <View style={darkModeOn ? styles.darkContainer : styles.container}>
       <View style={styles.themeToggleContainer}>
        <Pressable onPress={changeDarkMode} style={styles.themeToggleButton}>
          <Text style={{color: darkModeOn ? '#fff' : '#000'}}>
            {darkModeOn ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, {color: darkModeOn ? '#fff' : '#222'}]}>
          Habit Management
        </Text>
        <Text
          style={[styles.description, {color: darkModeOn ? '#ddd' : '#555'}]}>
          Manage your habits effectively.
        </Text>
      </View>

     

      <ScrollView
        contentContainerStyle={{paddingBottom: 40, alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.cardButton, darkModeOn && styles.cardButtonDark]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HabitCalendar')}>
          <Text style={[styles.cardButtonText, darkModeOn && {color: '#fff'}]}>
            View Habit Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cardButton, darkModeOn && styles.cardButtonDark]}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}>
          <Text style={[styles.cardButtonText, darkModeOn && {color: '#fff'}]}>
            Create New Habit
          </Text>
        </TouchableOpacity>

        <View style={{width: '100%', marginTop: 20}}>
          <CompletedHabitsList />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              darkModeOn && {backgroundColor: '#222', borderColor: '#555'},
            ]}>
            <CreateNewhabbitForm />
            <TouchableOpacity
              style={[styles.closeButton, darkModeOn && {backgroundColor: '#bb86fc'}]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6fc',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  description: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '500',
  },
  themeToggleContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  themeToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B7DA',
  },
  cardButton: {
    width: '100%',
    backgroundColor: '#10B7DA',
    paddingVertical: 16,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#0a94b4',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  cardButtonDark: {
    backgroundColor: '#1f8ea1',
    shadowColor: '#135a6a',
  },
  cardButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HabitManagementPage;
