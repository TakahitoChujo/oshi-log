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
      {/* 推し選択 */}
      <View style={styles.field}>
        <Text style={styles.label}>推し *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {oshis.map((o) => (
              <TouchableOpacity
                key={o.id}
                style={[styles.chip, oshiId === o.id && { backgroundColor: o.color, borderColor: o.color }]}
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

      {/* 種別 */}
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

      {/* 日付 */}
      <View style={styles.field}>
        <Text style={styles.label}>日付 *</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#ccc"
        />
      </View>

      {/* 金額 */}
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

      {/* メモ */}
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
  content: { padding: 20, gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#555' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#E91E8C', borderColor: '#E91E8C' },
  chipText: { color: '#666', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: '#E91E8C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
