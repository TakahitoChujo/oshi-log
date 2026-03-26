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
import ColorDot from '../components/ColorDot';
import { parseColors } from '../utils/color';
import { s, vs, fs, screenWidth } from '../utils/responsive';

type RouteT = RouteProp<RootStackParamList, 'OshiForm'>;

const GENRES: Genre[] = ['アイドル', 'VTuber', 'その他'];
const COLORS = [
  '#E91E8C', '#FF4081', '#F44336', '#FF5722',
  '#FF9800', '#FFC107', '#FFEB3B', '#8BC34A',
  '#4CAF50', '#009688', '#00BCD4', '#03A9F4',
  '#2196F3', '#3F51B5', '#673AB7', '#9C27B0',
  '#E040FB', '#795548', '#607D8B', '#000000',
];

// 画面幅からカラーパレットのドットサイズを計算（余白を考慮して均等配置）
const COLOR_COLUMNS = 5;
const COLOR_GAP = s(10);
const COLOR_PADDING = s(20);
const COLOR_DOT_SIZE = Math.floor(
  (screenWidth - COLOR_PADDING * 2 - COLOR_GAP * (COLOR_COLUMNS - 1)) / COLOR_COLUMNS
);

export default function OshiFormScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const oshiId = route.params?.oshiId;
  const isEdit = !!oshiId;

  const { addOshi, editOshi } = useOshiStore();

  const [name, setName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [genre, setGenre] = useState<Genre>('アイドル');
  const [selectedColors, setSelectedColors] = useState<string[]>([COLORS[0]]);

  useEffect(() => {
    if (oshiId) {
      const oshi = getOshiById(oshiId);
      if (oshi) {
        setName(oshi.name);
        setGroupName(oshi.group_name);
        setGenre(oshi.genre);
        const parsed = parseColors(oshi.color);
        setSelectedColors(parsed.filter(Boolean) as string[]);
      }
    }
  }, [oshiId]);

  const colorValue = selectedColors.join(',');

  const handleColorTap = (c: string) => {
    setSelectedColors((prev) => {
      const idx = prev.indexOf(c);
      if (idx >= 0) {
        if (prev.length > 1) return prev.filter((_, i) => i !== idx);
        return prev;
      }
      if (prev.length >= 2) {
        return [prev[0], c];
      }
      return [...prev, c];
    });
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('名前を入力してください');
      return;
    }
    if (isEdit && oshiId) {
      editOshi(oshiId, name.trim(), groupName.trim(), genre, '', colorValue);
    } else {
      addOshi(name.trim(), groupName.trim(), genre, '', colorValue);
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
        <Text style={styles.label}>テーマカラー（2色まで選択可）</Text>
        <View style={styles.previewRow}>
          <ColorDot color={colorValue} size={s(48)} />
          <Text style={styles.previewLabel}>
            {selectedColors.length === 2 ? '2色' : '1色'}
          </Text>
        </View>
        <View style={styles.colorRow}>
          {COLORS.map((c) => {
            const isSelected = selectedColors.includes(c);
            return (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  isSelected && styles.colorDotSelected,
                ]}
                onPress={() => handleColorTap(c)}
              >
                {isSelected && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
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
  chips: { flexDirection: 'row', gap: s(8) },
  chip: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#E91E8C', borderColor: '#E91E8C' },
  chipText: { color: '#666', fontSize: fs(14) },
  chipTextActive: { color: '#fff' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  previewLabel: { fontSize: fs(13), color: '#888' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: COLOR_GAP },
  colorDot: {
    width: COLOR_DOT_SIZE,
    height: COLOR_DOT_SIZE,
    borderRadius: COLOR_DOT_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDotSelected: {
    borderWidth: s(3),
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  checkMark: { color: '#fff', fontSize: fs(16), fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  saveButton: {
    backgroundColor: '#E91E8C',
    borderRadius: s(12),
    padding: s(16),
    alignItems: 'center',
    marginTop: vs(8),
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: fs(16) },
});
