# 内联资源的处理

出于性能的考虑，你可能会使用`style`和`script`来完成一些工作，但是如果需要你自己手动来`polyfill`这个工作就太繁琐了，出于这个考虑提供了一下两种资源的转化

## style Autoprefixer

默认情况下不会开启，你可以传递`data-autoprefixer`来指定当前块元素开启`Autoprefixer`转换

```html
<style data-autoprefixer>
  .f {
    display: flex;
  }
</style>
```

## script polyfill

默认情况下不会开启，传递`data-polyfill`开启，会对代码执行`polyfill`

```html
<script data-polyfill>
  const num: number = 1;
  console.log(num);
</script>
```

上面的语法表示可以支持内嵌使用 typescript 的语法，当前使用 JavaScript 也完全没有任何问题
