import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { parseColors } from '../utils/color';

type Props = {
  color: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};

/** 1色ならベタ塗り、2色なら左右半分ずつ背景を表示するコンテナ */
export default function ColorBg({ color, style, children }: Props) {
  const colors = parseColors(color);

  if (!colors[1]) {
    return <View style={[{ backgroundColor: colors[0] }, style]}>{children}</View>;
  }

  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
        <View style={{ flex: 1, backgroundColor: colors[0] }} />
        <View style={{ flex: 1, backgroundColor: colors[1] }} />
      </View>
      {children}
    </View>
  );
}
