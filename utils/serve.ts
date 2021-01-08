import getPort from 'get-port';

/**
 * 从默认端口开始递增对比
 *
 * @param {number} [port=8080]
 */
export const getSequentialPort = async (port = 8080) => {
  let p = port;
  for (;;) {
    const contrast = await getPort({ port: p });
    if (contrast === p) {
      return p;
    }
    p += 1;
  }
};
