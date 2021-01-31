// 讲可选参数变成必填
export type Require<T> = {
  [P in keyof T]-?: T[P];
};
