import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, Button, FlatList, View, StyleSheet } from 'react-native';
import axios from 'axios';
import open_api_key from './open_api_key';

const APIdemo = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getResponse = async () => {
    try {
      const url = 'https://api.openai.com/v1/chat/completions';
      const config = {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + open_api_key,
        },
      };
      const prompt = `How do I get from ${startLocation} to ${endLocation} using the NYC subway system?`;
      const msg_data = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      };
      const response = await axios.post(url, msg_data, config);

      const result = await response.data;
      setLoading(false);
      setData(result);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  const ChatResponse = ({ role, content }) => (
    <View style={styles.chatResponse}>
      <Text style={styles.responseText}>Your Route:</Text>
      <Text style={styles.responseContent}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Start Location:</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setStartLocation(text)}
        value={startLocation}
      />

      <Text style={styles.heading}>End Location:</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setEndLocation(text)}
        value={endLocation}
      />

      <Button
        onPress={() => {
          setLoading(true);
          setData([]);
          getResponse();
        }}
        title={loading ? 'Awaiting response' : 'Plan my route!'}
        color="red"
        accessibilityLabel="Send"
      />

      <FlatList
        data={data.choices}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ChatResponse {...item.message} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 30,
  },
  heading: {
    fontSize: 24,
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  chatResponse: {
    backgroundColor: 'lightblue',
    marginVertical: 10,
    padding: 20,
  },
  responseText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseContent: {
    backgroundColor: 'white',
  },
});

export default APIdemo;
