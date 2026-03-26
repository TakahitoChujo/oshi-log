import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 基準: iPhone 14 (390 x 844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/** 横幅ベースのスケーリング（フォント・余白・アイコン等） */
export function s(size: number): number {
  return Math.round((size * width) / BASE_WIDTH);
}

/** 縦幅ベースのスケーリング（縦方向の余白等） */
export function vs(size: number): number {
  return Math.round((size * height) / BASE_HEIGHT);
}

/** フォントサイズ用（横幅ベースだが控えめにスケール） */
export function fs(size: number): number {
  const scale = width / BASE_WIDTH;
  const capped = Math.min(scale, 1.3); // 大画面で大きくなりすぎない
  return Math.round(size * capped);
}

export { width as screenWidth, height as screenHeight };
