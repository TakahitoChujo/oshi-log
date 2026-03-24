import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useOshiStore } from '../store/useOshiStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Oshi } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function OshiSettingRow({ oshi }: { oshi: Oshi }) {
  const navigation = useNavigation<Nav>();
  const { removeOshi } = useOshiStore();

  const handleDelete = () => {
    Alert.alert(
      `${oshi.name}を削除`,
      'この推しに関する記録もすべて削除されます。よろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => removeOshi(oshi.id),
        },
      ]
    );
  };

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: oshi.color }]} />
      <View style={styles.info}>
        <Text style={styles.name}>{oshi.name}</Text>
        {oshi.group_name ? <Text style={styles.group}>{oshi.group_name}</Text> : null}
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('OshiForm', { oshiId: oshi.id })}
      >
        <Text style={styles.editText}>編集</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>削除</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SettingsScreen() {
  const { oshis, loadOshis } = useOshiStore();
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    loadOshis();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>設定</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>推し管理</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OshiForm', {})}>
            <Text style={styles.addText}>＋ 追加</Text>
          </TouchableOpacity>
        </View>

        {oshis.length === 0 ? (
          <Text style={styles.empty}>まだ推しが登録されていません</Text>
        ) : (
          <FlatList
            data={oshis}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <OshiSettingRow oshi={item} />}
            scrollEnabled={false}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリ情報</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>バージョン</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: { padding: 16, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  addText: { color: '#E91E8C', fontWeight: '600' },
  empty: { color: '#aaa', textAlign: 'center', paddingVertical: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  dot: { width: 32, height: 32, borderRadius: 16, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  group: { fontSize: 12, color: '#aaa' },
  editButton: { paddingHorizontal: 10, paddingVertical: 6 },
  editText: { color: '#666', fontSize: 13 },
  deleteButton: { paddingHorizontal: 10, paddingVertical: 6 },
  deleteText: { color: '#E91E8C', fontSize: 13 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { color: '#666', fontSize: 14 },
  infoValue: { color: '#333', fontSize: 14 },
});
