import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { useOshiStore } from '../store/useOshiStore';
import { LogType } from '../types';
import { primaryColor } from '../utils/color';
import { Calendar } from 'react-native-calendars';
import { s, vs, fs } from '../utils/responsive';

type RouteT = RouteProp<RootStackParamList, 'LogForm'>;

const LOG_TYPES: LogType[] = ['ライブ', '配信', 'グッズ', '課金', 'イベント', 'その他'];

function toDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function LogFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const preselectedOshiId = route.params?.oshiId;

  const { oshis, addLog, loadOshis } = useOshiStore();

  const [oshiId, setOshiId] = useState<number | null>(preselectedOshiId ?? null);
  const [type, setType] = useState<LogType>('ライブ');
  const [date, setDate] = useState(toDateString(new Date()));
  const [showCalendar, setShowCalendar] = useState(false);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    loadOshis();
    if (!oshiId && oshis.length > 0) setOshiId(oshis[0].id);
  }, []);

  useEffect(() => {
    if (!oshiId && oshis.length > 0) setOshiId(oshis[0].id);
  }, [oshis]);

  const handleSave = () => {
    if (!oshiId) {
      Alert.alert('推しを選んでください');
      return;
    }
    addLog(oshiId, type, date, Number(amount) || 0, memo.trim(), '');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.field}>
        <Text style={styles.label}>推し *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {oshis.map((o) => (
              <TouchableOpacity
                key={o.id}
                style={[styles.chip, oshiId === o.id && { backgroundColor: primaryColor(o.color), borderColor: primaryColor(o.color) }]}
                onPress={() => setOshiId(o.id)}
              >
                <Text style={[styles.chipText, oshiId === o.id && styles.chipTextActive]}>
                  {o.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>種別 *</Text>
        <View style={styles.chips}>
          {LOG_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, type === t && styles.chipActive]}
              onPress={() => setType(t)}
            >
              <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>日付 *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={{ fontSize: fs(16), color: '#333' }}>{date}</Text>
        </TouchableOpacity>
        {showCalendar && (
          <Calendar
            current={date}
            onDayPress={(day: { dateString: string }) => {
              setDate(day.dateString);
              setShowCalendar(false);
            }}
            markedDates={{
              [date]: { selected: true, selectedColor: '#E91E8C' },
            }}
            theme={{
              todayTextColor: '#E91E8C',
              arrowColor: '#E91E8C',
            }}
          />
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>金額（任意）</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          placeholderTextColor="#ccc"
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>メモ（任意）</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={memo}
          onChangeText={setMemo}
          placeholder="感想・思い出など..."
          placeholderTextColor="#ccc"
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>記録する</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  content: { padding: s(20), gap: vs(20) },
  field: { gap: vs(8) },
  label: { fontSize: fs(14), fontWeight: '600', color: '#555' },
  input: {
    backgroundColor: '#fff',
    borderRadius: s(10),
    padding: s(14),
    fontSize: fs(16),
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  textarea: { height: vs(100), textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
  chip: {
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#E91E8C', borderColor: '#E91E8C' },
  chipText: { color: '#666', fontSize: fs(14) },
  chipTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: '#E91E8C',
    borderRadius: s(12),
    padding: s(16),
    alignItems: 'center',
    marginTop: vs(8),
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: fs(16) },
});
