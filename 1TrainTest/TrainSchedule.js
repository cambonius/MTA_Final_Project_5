import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TrainSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-1`,
          {
            headers: {
              'x-api-key': '0VlUhA1XW871Lrm1n2Zhc7yE6bPhMdZ0apSjhILE',
            },
          }
        );

        const data = await response.json();
        const { entity } = data;
        const trainSchedule = entity.filter(
          (item) => item.id && item.id.startsWith('1')
        );

        setSchedule(trainSchedule);
      } catch (error) {
        console.error('Error fetching train schedule:', error);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1 Train Schedule</Text>
      <View style={styles.scheduleContainer}>
        {schedule.map((item) => (
          <Text key={item.id} style={styles.scheduleItem}>
            {item.id}: {item.vehicle?.current_status}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scheduleContainer: {
    alignItems: 'center',
  },
  scheduleItem: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default TrainSchedule;
