import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () => {
  const [toDoList, setToDoList] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    getListFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveListToUserDevice(toDoList);
  }, [toDoList]);

  const addItem = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Empty imput');
    } else {
      const newToDoList = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setToDoList([...toDoList, newToDoList]);
      setTextInput('');
    }
  };

  const saveListToUserDevice = async toDoList => {
    try {
      const stringifyToDoList= JSON.stringify(toDoList);
      await AsyncStorage.setItem('toDoList', stringifyToDoList);
    } catch (error) {
      console.log(error);
    }
  };

  const getListFromUserDevice = async () => {
    try {
      const toDoList = await AsyncStorage.getItem('toDoList');
      if (toDoList != null) {
        setToDoList(JSON.parse(toDoList));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markItemComplete = toDoListId => {
    const newToDoListItem = toDoList.map(item => {
      if (item.id == toDoListId) {
        return {...item, completed: true};
      }
      return item;
    });

    setToDoList(newToDoListItem);
  };

  const deleteToDoList= toDoListId => {
    const newToDoListItem = toDoList.filter(item => item.id != toDoListId);
    setToDoList(newToDoListItem);
  };

  const clearList = () => {
    Alert.alert('Confirm', 'Clear your To Do List?', [
      {
        text: 'Yes',
        onPress: () => setToDoList([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const ListItem = ({toDoList}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: toDoList?.completed ? 'line-through' : 'none',
            }}>
            {toDoList?.task}
          </Text>
        </View>
        {!toDoList?.completed && (
          <TouchableOpacity onPress={() => markItemComplete(toDoList.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'lightgreen'}]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteToDoList(toDoList.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#d2f7ff',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 25,
            color: COLORS.primary,
          }}>
          MY TO DO LIST APP
        </Text>
        <Icon name="delete" size={28} color="red" onPress={clearList} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={toDoList}
        renderItem={({item}) => <ListItem toDoList={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add New Item"
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addItem}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: "lightgreen",
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor:'gray',
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
});

export default App;