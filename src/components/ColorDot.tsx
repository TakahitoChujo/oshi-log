import React from 'react';
import { View, StyleSheet } from 'react-native';
import { parseColors } from '../utils/color';

type Props = {
  color: string;
  size: number;
  style?: any;
};

export default function ColorDot({ color, size, style }: Props) {
  const colors = parseColors(color);
  const radius = size / 2;

  if (colors.length === 1 || !colors[1]) {
    return (
      <View
        style={[{ width: size, height: size, borderRadius: radius, backgroundColor: colors[0] }, style]}
      />
    );
  }

  return (
    <View style={[{ width: size, height: size, borderRadius: radius, overflow: 'hidden' }, style]}>
      <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
        <View style={{ flex: 1, backgroundColor: colors[0] }} />
        <View style={{ flex: 1, backgroundColor: colors[1] }} />
      </View>
    </View>
  );
}
