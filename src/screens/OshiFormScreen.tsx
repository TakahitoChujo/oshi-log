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
import { Genre } from '../types';
import { getOshiById } from '../db/database';

type RouteT = RouteProp<RootStackParamList, 'OshiForm'>;

const GENRES: Genre[] = ['アイドル', 'VTuber', 'その他'];
const COLORS = [
  '#E91E8C', '#9C27B0', '#3F51B5', '#2196F3', '#00BCD4',
  '#4CAF50', '#FF9800', '#F44336', '#795548', '#607D8B',
];

export default function OshiFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const oshiId = route.params?.oshiId;
  const isEdit = !!oshiId;

  const { addOshi, editOshi } = useOshiStore();

  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [genre, setGenre] = useState<Genre>('アイドル');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (oshiId) {
      const oshi = getOshiById(oshiId);
      if (oshi) {
        setName(oshi.name);
        setGroupName(oshi.group_name);
        setGenre(oshi.genre);
        setColor(oshi.color);
      }
    }
  }, [oshiId]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('名前を入力してください');
      return;
    }
    if (isEdit && oshiId) {
      editOshi(oshiId, name.trim(), groupName.trim(), genre, '', color);
    } else {
      addOshi(name.trim(), groupName.trim(), genre, '', color);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.field}>
        <Text style={styles.label}>名前 *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="推しの名前"
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>グループ・ユニット</Text>
        <TextInput
          style={styles.input}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="（任意）"
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>ジャンル</Text>
        <View style={styles.chips}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, genre === g && styles.chipActive]}
              onPress={() => setGenre(g)}
            >
              <Text style={[styles.chipText, genre === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>テーマカラー</Text>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{isEdit ? '更新する' : '登録する'}</Text>
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
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#E91E8C', borderColor: '#E91E8C' },
  chipText: { color: '#666', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  colorDotSelected: { borderWidth: 3, borderColor: '#333' },
  saveButton: {
    backgroundColor: '#E91E8C',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
