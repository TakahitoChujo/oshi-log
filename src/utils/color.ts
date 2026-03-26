/** カンマ区切りのカラー文字列を配列にパース */
export function parseColors(color: string): [string, string?] {
  const parts = color.split(',');
  return parts.length >= 2 ? [parts[0], parts[1]] : [parts[0]];
}

/** 背景色など単色が必要な場面で1色目を返す */
export function primaryColor(color: string): string {
  return color.split(',')[0];
}
