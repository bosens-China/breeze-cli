// 用于处理webpack-child不支持api的情况

export default {
  output: {
    environment: {
      arrowFunction: false,
    },
  },
};
