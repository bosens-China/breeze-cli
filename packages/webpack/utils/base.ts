export const isProduction = () => process.env.NODE_ENV === 'production';

export const getLinuxPath = (p: string) => p.replace(/\\/g, '/');

export const getFileNmae = (p: string) => getLinuxPath(p).split('/').pop();

export const getDirName = (p: string) => getLinuxPath(p).split('/').slice(-2, 1)[0];
