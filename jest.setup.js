// グローバルのモック設定
global.__DEV__ = true;

// expo/src/winter/runtime.native.ts が lazy getter で require しようとするモジュールが
// Jest 環境 (CommonJS) でエラーになるため、先にスタブを定義して getter が発火しないようにする
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}
Object.defineProperty(global, '__ExpoImportMetaRegistry', {
  value: { url: '' },
  writable: true,
  configurable: true,
});
