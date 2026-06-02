# 第2章 HTML中的JavaScript

## HTML使用<script></script>标签引入JavaScript代码

示例代码

```javascript
<script>
  function sayHi() {
  	console.log("Hello world!");
}
</script>
```

## 标签包含8个属性：

- charset：指定代码字符集，几乎不用

- crossorigin：配置请求的跨域设置，crossorigin="anonymous"表示不需要凭据；crossorigin="use-credentials"表示需要凭据

- integrity：通过签名验证资源的完整性

- language：已废弃

- type：代替language，代表代码中脚本语言的内容类型，常用值"text/javascript"、"application/javascript"，当值为"module"时，代码会被当成ES6模块，此时代码中可以出现import和export关键字

- src：引入外部文件，使用了 src 属性的<script>元素不应该再在标签中包含其他 JavaScript 代码，即使加了也会被忽略

  ```javascript
  <script src="example.js" />
  <script src="http://www.somewhere.com/afile.js" />
  ```

- defer：脚本延迟到文档解析完成再执行

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>Example HTML Page</title>
      <script defer src="example1.js"></script>
      <script defer src="example2.js"></script>
    </head>
    <body>
    <!-- 这里是页面内容 -->
    </body>
  </html>
  ```

  虽然这个例子中的<script>元素包含在页面的<head>中，但它们会在浏览器解析到结束的 </html>标签后才会执行。在实际应用中，推迟执行的脚本不一定总会按顺序执行，因此最好只包含一个这样的脚本

- async：异步执行，用于下载资源或等待其他脚本加载，只对外部脚本有效。与 defer 不同的是，标记为 async 的脚本不保证能按照它们出现的次序执行。因此，异步脚本不应该在加载期间修改 DOM

## 动态加载脚本

JavaScript 可以使用 DOM API，所以通过向 DOM 中动态添加 script 元素同样可以加载指定的脚本

```javascript
<script>
  let script = document.createElement('script');
  script.src = 'gibberish.js';
  document.head.appendChild(script);
</script>
```

默认情况下，以这种方式创建的<script>元素是以异步方式加载的，相当于添加了 async 属性。但是由于不是所有浏览器都支持 async 属性，因此可以明确将其设置为同步加载

```javascript
<script>
  let script = document.createElement('script');
  script.src = 'gibberish.js';
	script.async = false;
  document.head.appendChild(script);
</script>
```

以这种方式获取的资源对浏览器预加载器是不可见的，这会影响它们在资源获取队列中的优先级，进而影响性能。要想让预加载器知道这些动态请求文件的存在，可以在文档头部显式声明它们

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example HTML Page</title>
    <link rel="preload" href="gibberish.js">
  </head>
  <body>
  <!-- 这里是页面内容 -->
    <script>
      let script = document.createElement('script');
      script.src = 'gibberish.js';
      script.async = false;
      document.head.appendChild(script);
    </script>
  </body>
</html>
```

## **<noscript>**元素

如果浏览器不支持 JavaScript，则可以通过该标签告知用户

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example HTML Page</title>
    <script defer="defer" src="example1.js"></script>
    <script defer="defer" src="example2.js"></script>
  </head>
  <body>
    <noscript>
    	<p>This page requires a JavaScript-enabled browser.</p> 		</noscript>
  </body>
</html>

```

