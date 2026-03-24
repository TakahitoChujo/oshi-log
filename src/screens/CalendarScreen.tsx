import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useOshiStore } from '../store/useOshiStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { OshiLog } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CalendarScreen() {
  const { logs, oshis, loadLogs, loadOshis } = useOshiStore();
  const navigation = useNavigation<Nav>();
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    loadLogs();
    loadOshis();
  }, []);

  // カレンダーのマーキング用データを生成
  const markedDates = logs.reduce<Record<string, any>>((acc, log) => {
    const oshi = oshis.find((o) => o.id === log.oshi_id);
    const color = oshi?.color ?? '#E91E8C';
    if (!acc[log.date]) {
      acc[log.date] = { dots: [], selected: log.date === selectedDate };
    }
    // 同じ色のdotは重複しないようにする
    if (!acc[log.date].dots.find((d: any) => d.color === color)) {
      acc[log.date].dots.push({ color });
    }
    return acc;
  }, {});

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] ?? {}),
      selected: true,
      selectedColor: '#E91E8C',
    };
  }

  const selectedLogs: OshiLog[] = selectedDate
    ? logs.filter((l) => l.date === selectedDate)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>カレンダー</Text>

      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: '#E91E8C',
          selectedDayBackgroundColor: '#E91E8C',
          arrowColor: '#E91E8C',
        }}
      />

      {selectedDate ? (
        <View style={styles.logSection}>
          <Text style={styles.dateLabel}>{selectedDate}</Text>
          {selectedLogs.length === 0 ? (
            <Text style={styles.noLog}>この日の記録はありません</Text>
          ) : (
            <FlatList
              data={selectedLogs}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const oshi = oshis.find((o) => o.id === item.oshi_id);
                return (
                  <TouchableOpacity
                    style={styles.logItem}
                    onPress={() => navigation.navigate('LogDetail', { logId: item.id })}
                  >
                    <View style={[styles.typeBadge, { backgroundColor: oshi?.color ?? '#E91E8C' }]}>
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <View style={styles.logBody}>
                      <Text style={styles.oshiName}>{oshi?.name ?? '不明'}</Text>
                      {item.memo ? <Text style={styles.memo} numberOfLines={1}>{item.memo}</Text> : null}
                    </View>
                    {item.amount > 0 && (
                      <Text style={styles.amount}>¥{item.amount.toLocaleString()}</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      ) : (
        <Text style={styles.hint}>日付をタップして記録を確認</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', padding: 16, paddingTop: 20 },
  logSection: { flex: 1, padding: 16 },
  dateLabel: { fontSize: 15, fontWeight: '600', color: '#E91E8C', marginBottom: 8 },
  noLog: { color: '#aaa', textAlign: 'center', marginTop: 24 },
  hint: { textAlign: 'center', color: '#bbb', marginTop: 24 },
  logItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  typeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  logBody: { flex: 1 },
  oshiName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  memo: { fontSize: 12, color: '#888', marginTop: 2 },
  amount: { fontSize: 13, color: '#E91E8C', fontWeight: '600' },
});
