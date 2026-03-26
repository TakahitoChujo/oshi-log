import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useOshiStore } from '../store/useOshiStore';
import { useNavigation } from '@react-navigation/native';
import { parseColors } from '../utils/color';
import ColorBg from '../components/ColorBg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { OshiLog } from '../types';
import { s, vs, fs } from '../utils/responsive';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CalendarScreen() {
  const { logs, oshis, loadLogs, loadOshis } = useOshiStore();
  const navigation = useNavigation<Nav>();
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    loadLogs();
    loadOshis();
  }, []);

  const markedDates = logs.reduce<Record<string, any>>((acc, log) => {
    const oshi = oshis.find((o) => o.id === log.oshi_id);
    const colors = parseColors(oshi?.color ?? '#E91E8C');
    if (!acc[log.date]) {
      acc[log.date] = { dots: [], selected: log.date === selectedDate };
    }
    for (const c of colors) {
      if (c && !acc[log.date].dots.find((d: any) => d.color === c)) {
        acc[log.date].dots.push({ color: c });
      }
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
                    <ColorBg color={oshi?.color ?? '#E91E8C'} style={styles.typeBadge}>
                      <Text style={styles.typeText}>{item.type}</Text>
                    </ColorBg>
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
  title: { fontSize: fs(22), fontWeight: 'bold', color: '#333', paddingHorizontal: s(16), paddingTop: vs(20) },
  logSection: { flex: 1, padding: s(16) },
  dateLabel: { fontSize: fs(15), fontWeight: '600', color: '#E91E8C', marginBottom: vs(8) },
  noLog: { color: '#aaa', textAlign: 'center', marginTop: vs(24), fontSize: fs(14) },
  hint: { textAlign: 'center', color: '#bbb', marginTop: vs(24), fontSize: fs(14) },
  logItem: {
    backgroundColor: '#fff',
    borderRadius: s(10),
    padding: s(12),
    marginBottom: vs(8),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  typeBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: s(8),
    marginRight: s(10),
  },
  typeText: { color: '#fff', fontSize: fs(12), fontWeight: '600' },
  logBody: { flex: 1 },
  oshiName: { fontSize: fs(14), fontWeight: 'bold', color: '#333' },
  memo: { fontSize: fs(12), color: '#888', marginTop: vs(2) },
  amount: { fontSize: fs(13), color: '#E91E8C', fontWeight: '600' },
});
