# 第15章 DOM扩展

## Selectors API

Selectors API 是 W3C 推荐标准，规定了浏览器原生支持的 CSS 查询 API，其核心是两个方法：querySelector() 和 querySelectorAll()，Document 类型和 Element 类型的实例上都会暴露这两个方法。

querySelector() 方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配项则返回 null。

```javascript
// 取得<body>元素
let body = document.querySelector("body");
// 取得 ID 为"myDiv"的元素
let myDiv = document.querySelector("#myDiv");
// 取得类名为"selected"的第一个元素  
let selected = document.querySelector(".selected");
// 取得类名为"button"的图片
let img = document.body.querySelector("img.button");
```

querySelectorAll() 也接收一个用于查询的参数，但它会返回所有匹配的节点，这个方法返回的是一个 NodeList 的静态实例，如果没有匹配项，则返回空的 NodeList 实例。querySelectorAll() 返回的 NodeList 实例是一个静态的“快照”，而非“实时”的查询。

```javascript
// 取得 ID 为"myDiv"的<div>元素中的所有<em>元素
let ems = document.getElementById("myDiv").querySelectorAll("em");
// 取得所有类名中包含"selected"的元素
let selecteds = document.querySelectorAll(".selected");
// 取得所有是<p>元素子元素的<strong>元素
let strongs = document.querySelectorAll("p strong");
```

matches() 方法接收一个 CSS 选择符参数，如果元素匹配则返回 true，否则返回 false。

```javascript
if (document.body.matches("body.page1")){
  // true
}
```

Element Traversal API 为 DOM 元素添加了 5 个属性：

- childElementCount，返回子元素数量
- firstElementChild，指向第一个 Element 类型的子元素
- lastElementChild，指向最后一个 Element 类型的子元素
- previousElementSibling， 指向前一个 Element 类型的同胞元素
- nextElementSibling，指向后一个 Element 类型的同胞元素

**HTML5** 增加了一些特性以方便使用 CSS 类：

getElementsByClassName() 方法接收一个参数，即包含一个或多个类名的字符串，返回类名中包含相应类的元素的 NodeList。

```javascript
// 取得所有类名中包含"username"和"current"元素
// 这两个类名的顺序无关紧要
let allCurrentUsernames = document.getElementsByClassName("username current");
// 取得 ID 为"myDiv"的元素子树中所有包含"selected"类的元素
let selected = document.getElementById("myDiv").getElementsByClassName("selected");
```

要操作类名，可以通过 className 属性实现添加、删除和替换。以下面代码为例：

```html
<div class="bd user disabled">...</div>
```

这个<div>元素有 3 个类名。要想删除其中一个，就得先把 className 拆开，删除不想要的那个，再把包含剩余类的字符串设置回去。比如：

```javascript
// 要删除"user"类
let targetClass = "user";
// 把类名拆成数组
let classNames = div.className.split(/\s+/);
// 找到要删除类名的索引
let idx = classNames.indexOf(targetClass);
// 如果有则删除 
if (idx > -1) {
  classNames.splice(i,1);
}
// 重新设置类名
div.className = classNames.join(" ");
```

HTML5 通过给所有元素增加 classList 属性为这些操作提供了更简单也更安全的实现方式。classList 是一个集合类型 DOMTokenList 实例，具有以下方法：

- add(value)，向类名列表中添加指定的字符串值 value
- contains(value)，返回布尔值，表示给定的 value 是否存在
- remove(value)，从类名列表中删除指定的字符串值 value
- toggle(value)，如果类名列表中已经存在指定的 value，则删除;如果不存在，则添加

通过操作 classList 属性，之前的代码可以简化成一行：

```javascript
div.classList.remove("user");
```

HTML5 增加了辅助 DOM 焦点管理的功能。document.activeElement 始终包含当前拥有焦点的 DOM 元素。例如：

```javascript
let button = document.getElementById("myButton");
button.focus();
console.log(document.activeElement === button); // true
```

focus() 方法可以让某个元素获取焦点，document.hasFocus() 方法返回布尔值，表示文档是否拥有焦点：

```javascript
let button = document.getElementById("myButton");
button.focus();
console.log(document.hasFocus()); // true
```

document.readyState 属性用于判断文档是否加载完毕，它包含两个值：loading，表示文档正在加载；complete，表示文档加载完成。

HTML5 增加了 document.head 属 性，指向文档的<head>元素：

```javascript
let head = document.head;
```

characterSet 属性表示文档实际使用的字符集，也可以用来指定新字符集：

```javascript
console.log(document.characterSet); // "UTF-16"
document.characterSet = "UTF-8";
```

HTML5 允许给元素指定非标准的属性，但要使用前缀 data-以便告诉浏览器，这些属性既不包含与渲染有关的信息，也不包含元素的语义信息：

```javascript
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

定义了自定义数据属性后，可以通过元素的 dataset 属性来访问：

```javascript
let div = document.getElementById("myDiv");
// 取得自定义数据属性的值
let appId = div.dataset.appId; 
let myName = div.dataset.myname;
// 设置自定义数据属性的值 
div.dataset.appId = 23456; 
div.dataset.myname = "Michael";
// 有"myname"吗?
if (div.dataset.myname){
  console.log(`Hello, ${div.dataset.myname}`);
}
```

HTML5 可以通过 innerHTML 属性向文档中读取或者插入整段的 HTML 代码， 例如如下代码：

```html
<div id="content">
  <p>This is a <strong>paragraph</strong> with a list following it.</p> 
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

对于这里的<div>元素而言，其 innerHTML 属性会返回以下字符串：

```html
<p>This is a <strong>paragraph</strong> with a list following it.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

在写入模式下，赋给 innerHTML 属性的值会被解析为 DOM 子树，并替代元素之前的所有节点，如果赋值中不包含任何 HTML 标签，则直接生成一个文本节点。

```javascript
div.innerHTML = "Hello world!";
// 包含 HTML 字符时
div.innerHTML = "Hello & welcome, <b>\"reader\"!</b>";
```

HTML5还提供 outerHTML 属性进行类似操作，区别在于，读取 outerHTML 属性时，会返回调用它的元素(及所有后代元素)的 HTML 字符串。在写入 outerHTML 属性时，调用它的元素会被传入的 HTML 字符串经解释之后生成的 DOM 子树取代。上述 HTML 代码中的<div>元素调用 outerHTML 会返回相同字符串，如果使用 outerHTML 进行设置，例如：

```javascript
div.outerHTML = "<p>This is a paragraph.</p>";
```

则新的<p>元素会取代原来的<div>元素。

为了防止 XSS 攻击，如果页面中要使用用户提供的信息，则不建议使用 innerHTML。

scrollIntoView() 方法存在于所有 HTML 元素上，可以滚动浏览器窗口或容器元素以便包含元素进入视口。这个方法的参数如下：

- alignToTop，布尔值，如果设置为 true，则窗口滚动后元素的顶部与视口顶部对齐；如果设置为 false，则窗口滚动后元素的底部与视口底部对齐
- scrollIntoViewOptions，选项对象，behavior 定义过渡动画，可取的值为“smooth”和“auto”，默认为“auto”；block 定义垂直方向的对齐，可取的值为“start”、“center”、“end”和“nearest”，默认为 “start”；inline 定义水平方向的对齐，可取的值为“start”、“center”、“end”和“nearest”，默认为 “nearest”
- 不传参数等同于 alignToTop 为 true

```javascript
// 确保元素可见 
document.forms[0].scrollIntoView();
// 同上
document.forms[0].scrollIntoView(true); document.forms[0].scrollIntoView({block: 'start'});
// 尝试将元素平滑地滚入视口
document.forms[0].scrollIntoView({behavior: 'smooth', block: 'start'});
```

HTML5 还有两个常用属性：innerText 和 outerText。innerText 属性对应元素中包含的所有文本内容，在用于读取值时，innerText 会按照深度优先的顺序将子树中所有文本节点的值拼接起来。在用于写入值时，innerText 会移除元素的所有后代并插入一个包含该值的文本节点。

```html
<div id="content">
  <p>This is a <strong>paragraph</strong> with a list following it.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul> 
</div>
```

对这个例子中的<div>而言，innerText 属性会返回以下字符串：

```javascript
This is a paragraph with a list following it.
Item 1
Item 2
Item 3
```

对<div>设置 innerText 后：

```javascript
div.innerText = "Hello world!";
```

页面中的<div>元素会变成：

```javascript
<div id="content">Hello world!</div>
```

outerText 与 innerText 是类似的，只不过作用范围包含调用它的节点。读取文本值时，outerText 与 innerText 实际上会返回同样的内容。 写入文本值时，outerText 会替换整个元素。
