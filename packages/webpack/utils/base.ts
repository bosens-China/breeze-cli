import path from 'path';

export const isProduction = () => process.env.NODE_ENV === 'production';

export const getLinuxPath = (p: string) => p.replace(/\\/g, '/');

export const getFileNmae = (p: string, removeSuffix = false) => {
  const value = getLinuxPath(p).split('/').pop();
  if (removeSuffix && isSuffix(value)) {
    const [name] = value?.split('.') || [];
    return name;
  }
  return value;
};

export const getDirName = (p: string) => getLinuxPath(p).split('/').slice(-2, -1)[0];

// 是否包含后缀名
export const isSuffix = (p?: string) => !!p?.includes('.');

// 返回绝对路径
export const getAbsolutePath = (p: string, base = process.cwd()) => (path.isAbsolute(p) ? p : path.join(base, p));
