# 第14章 DOM

文档对象模型（DOM，Document Object Model）是 HTML 和 XML 文档的编程接口。

## Node 类型

所有节点类型都继承 Node 类型，因此所有类型都共享相同的基本属性和方法。每个节点都有 nodeType 属性，表示该节点的类型。

- Node.ELEMENT_NODE（1）
- Node.ATTRIBUTE_NODE（2）
- Node.TEXT_NODE（3）
- Node.CDATA_SECTION_NODE（4） 
- Node.ENTITY_REFERENCE_NODE（5） 
- Node.ENTITY_NODE（6） 
- Node.PROCESSING_INSTRUCTION_NODE（7）
- Node.COMMENT_NODE（8） 
- Node.DOCUMENT_NODE（9） 
- Node.DOCUMENT_TYPE_NODE（10）
- Node.DOCUMENT_FRAGMENT_NODE（11） 
- Node.NOTATION_NODE（12）

节点类型可通过与这些常量比较来确定：

```javascript
if (someNode.nodeType == Node.ELEMENT_NODE) {
  alert("Node is an element.");
}
```

nodeName 与 nodeValue 保存着有关节点的信息

```javascript
if (someNode.nodeType == 1) { 
  value = someNode.nodeName; // 会显示元素的标签名
}
```

每个节点都有一个 childNodes 属性，其中包含一个 NodeList 的实例，用于存储可以按位置存取的有序节点。NodeList 并不是 Array 的实例，但可以使用中括号访问它的值，而且它也有 length 属性。它其实是一个对 DOM 结构的查询，DOM 结构的变化会自动地在 NodeList 中反映出来。使用中括号或使用 item()方法访NodeList 中的元素：

```javascript
let firstChild = someNode.childNodes[0]; 
let secondChild = someNode.childNodes.item(1); 
let count = someNode.childNodes.length;
```

每个节点都有一个 parentNode 属性，指向其 DOM 树中的父元素。使用 previousSibling 和 nextSibling 可以在这个列表的节点间导航，第一个节点的 previousSibling 属性是 null，最后一个节点的 nextSibling 属性也是 null。firstChild 和 lastChild 分别指向 childNodes 中的第一个和最后一个子节点。 hasChildNodes()，这个方法如果返回 true 则说明节点有一个或多个子节点。

除了访问 DOM 中的节点 API 之外，JS 还提供了一些操作节点的方法。 appendChild()，用于在 childNodes 列表末尾添加节点，该方法会返回新添加的节点：

```javascript
let returnedNode = someNode.appendChild(newNode); 
alert(returnedNode == newNode); // true 
alert(someNode.lastChild == newNode); // true
```

如果把文档中已经存在的节点传给 appendChild()，则这个节点会从之前的位置被转移到新位置。

```javascript
let returnedNode = someNode.appendChild(someNode.firstChild); 
alert(returnedNode == someNode.firstChild); // false 
alert(returnedNode == someNode.lastChild); // true
```

如果想把节点放到 childNodes 中的特定位置而不是末尾，则可以使用 insertBefore()方法。这个方法接收两个参数：要插入的节点和参照节点。

```javascript
// 作为最后一个子节点插入
returnedNode = someNode.insertBefore(newNode, null); 
alert(newNode == someNode.lastChild); // true 
// 作为新的第一个子节点插入
returnedNode = someNode.insertBefore(newNode, someNode.firstChild); 
alert(returnedNode == newNode); // true 
alert(newNode == someNode.firstChild); // true 
// 插入最后一个子节点前面
returnedNode = someNode.insertBefore(newNode, someNode.lastChild); 
alert(newNode == someNode.childNodes[someNode.childNodes.length - 2]); // true
```

replaceChild() 方法接收两个参数：要插入的节点和要替换的节点。要替换的节点会被返回并从文档树中完全移除，要插入的节点会取而代之：

```javascript
// 替换第一个子节点
let returnedNode = someNode.replaceChild(newNode, someNode.firstChild); 
// 替换最后一个子节点
returnedNode = someNode.replaceChild(newNode, someNode.lastChild);
```

要移除节点而不是替换节点，可以使用 removeChild()方法。这个方法接收一个参数，即要移除的节点。被移除的节点会被返回：

```javascript
let formerFirstChild = someNode.removeChild(someNode.firstChild); 
// 删除最后一个子节点
let formerLastChild = someNode.removeChild(someNode.lastChild);
```

所有节点类型还共享了两个方法。第一个是 cloneNode()，会返回与调用它的节点一模一样的节点。cloneNode() 方法接收一个布尔值参数，表示是否深复制。在传入 true 参数时，会进行深复制，即复制节点及其整个子 DOM 树。如果传入 false，则只会复制调用该方法的节点。复制的节点属于文档所有，但尚未指定父节点，可以再通过 appendChild()、insertBefore()等方法把节点添加到文档中。

最后一个方法是 normalize()，这个方法的任务就是处理文档子树中的文本节点。由于解析器的差异或者 DOM 操作等原因，可能会出现不包含文本的文本节点，或者文本节点之间互为兄弟的关系。在节点上调用 normalize() 方法，会检测这个节点的所有后代，如果发现空文本节点，则将其删除；如果两个兄弟节点是相邻的，则将其合并为一个文本节点。

## Document 类型

在浏览器中，文档对象 document 是 HTMLDocument 的实例（HTMLDocument 继承 Document），表示整个 HTML 页面。document 是 window 对象的属性，因此是一个全局对象。Document 类型的节点有以下特征：

- nodeType 等于 9
- nodeName 值为"#document"
- nodeValue 值为 null
- parentNode 值为 null
- ownerDocument 值为 null
- 子节点可以是 DocumentType（最多一个）、Element（最多一个）、ProcessingInstruction 或 Comment 类型

document 对象可用于获取关于页面的信息以及操纵其外观和底层结构。通过 documentElement 属性，可以获得 HTML 页面中的 <html> 元素。例如如下简单页面：

```html
<html>
  <body>
    
  </body>
</html>
```

浏览器解析页面后，文档只有一个子节点，即<html>元素。这个元素既可以通过 documentElement 属性获取，也可以通过 childNodes 列表访问：

```javascript
let html = document.documentElement; // 取得对<html>的引用
alert(html == document.childNodes[0]); // true
alert(html == document.firstChild); // true
```

document 对象还有一个 body 属性，直接指向<body>元素。

```javascript
let body = document.body; // 取得对<body>的引用
```

页面中可能包含<!doctype>标签，其信息可以通过 doctype 属性来访问。

出现在<html>元素外面的注释也是文档的子节点，它们的类型是 Comment。不过，由于浏览器实现不同，这些注释不一定能被识别，或者表现可能不一致。

document 作为 HTMLDocument 的实例，还有一些属性用于提供浏览器所加载网页的信息。 title 属性包含<title>元素中的文本，通过这个属性可以读写页面的标题，修改后的标题也会反映在浏览器标题栏上，但是修改 title 属性并不会改变<title>元素。

URL、domain 和 referrer 属性与加载页面的HTTP请求有关。URL 包含当前页面的完整 URL（地址栏中的URL），domain 包含页面的域名，referrer 包含链接到当前页面的那个页面的 URL，如果当前页面没有来源，则 referrer 属性包含空字符串。

```javascript
// 取得完整URL
let url = document.URL; 
// 取得域名
let domain = document.domain; 
// 取得来源
let referrer = document.referrer;
```

使用 DOM 最常见的情形是获取某个或某组元素的引用，然后对其执行某些操作。通过 getElementById() 和 getElementsByTagName() 方法就可以实现这些操作。

getElementById() 方法接收一个参数，即要获取元素的 ID，如果找到了则返回这个元素，如果没找到则返回 null。如果页面中存在多个具有相同 ID 的元素，则 getElementById() 返回在文档中出现的第一个元素。例如页面中有以下元素：

```html
<div id="myDiv">Some text</div>
```

通过以下代码获取元素：

```javascript
let div = document.getElementById("myDiv"); // 取得对这个<div>元素的引用
// 获取元素的参数是大小写敏感的
let div = document.getElementById("mydiv"); // null
```

getElementsByTagName() 是另一个常用来获取元素引用的方法。这个方法接收一个参数，即要获取元素的标签名，返回包含零个或多个元素的 NodeList。 在 HTML 文档中，这个方法返回一个 HTMLCollection 对象。

```javascript
// 取得页面中所有的<img>元素
let images = document.getElementsByTagName("img");
alert(images.length); // 图片数量
alert(images[0].src); // 第一张图片的 src 属性
alert(images.item(0).src); // 同上
```

HTMLCollection 对象还有一个方法 namedItem()，可通过标签的 name 属性取得某一项的引用，例如：

```html
<img src="myimage.gif" name="myImage">
```

可以这样取得这个<img>元素

```javascript
let myImage = images.namedItem("myImage");
// 也可以直接使用中括号来获取
let myImage = images["myImage"];
```

要取得文档中的所有元素，可以给 getElementsByTagName() 传入*

```javascript
let allElements = document.getElementsByTagName("*");
```

getElementsByName() 方法会返回具有给定 name 属性的所有元素，最常用于单选按钮。例如：

```html
<fieldset>
  <legend>Which color do you prefer?</legend>
  <ul>
    <li>
      <input type="radio" value="red" name="color" id="colorRed"> 
      <label for="colorRed">Red</label>
    </li>
    <li>
      <input type="radio" value="green" name="color" id="colorGreen"> 
      <label for="colorGreen">Green</label>
    </li>
  </ul>
</fieldset>
```

这样取得所有单选按钮：

```javascript
let radios = document.getElementsByName("color");
```

document 对象上还暴露了几个特殊集合：

- document.anchors 包含文档中所有带 name 属性的<a>元素
- document.forms 包含文档中所有<form>元素
- document.images 包含文档中所有<img>元素
- document.links 包含文档中所有带 href 属性的<a>元素

document 对象可以向网页输出流中写入内容，write() 和 writeln() 方法都接收一个字符串参数，可以将这个字符串写入网页中。write() 简单地写入文本，而 writeln() 还会在字符串末尾追加一个换行符（\n）。注意，不能像下面的例子中这样直接包含字符串"</script>"，因为这个字符串会被解释为脚本块的结尾，导致后面的代码不能执行。

```html
<html>
  <head>
    <title>document.write() Example</title>
  </head>
  <body>
    <script type="text/javascript"> 
      document.write("<script type=\"text/javascript\" src=\"file.js\">" + "</script>"); 
    </script>
  </body>
</html>
```

为避免出现这个问题，需要对代码稍加修改：

```html
<html>
  <head>
    <title>document.write() Example</title>
  </head>
  <body>
    <script type="text/javascript"> 
      document.write("<script type=\"text/javascript\" src=\"file.js\">" + "<\/script>"); 
    </script>
  </body>
</html>
```

前面的例子展示了在页面渲染期间通过 document.write() 向文档中输出内容。如果是在页面加载完之后再调用 document.write()，则输出的内容会重写整个页面：

```html
<html>
  <head>
    <title>document.write() Example</title>
  </head>
  <body>
    <p>
      This is some content that you won't get to see because it will be overwritten.
    </p>
    <script type="text/javascript">
      window.onload = function() {
        document.write("Hello world!"); 
      };
    </script>
  </body>
</html>
```

这个例子使用了 window.onload 事件处理程序，将调用 document.write() 的函数推迟到页面加载完毕后执行。执行之后，字符串"Hello world!"会重写整个页面内容。

open() 和 close() 方法分别用于打开和关闭网页输出流。在调用 write() 和 writeln() 时，这两个方法都不是必需的。

## Element 类型

Element 表示XML或HTML元素，对外暴露出访问元素标签名、子节点和属性的能力。Element 类型的节点具有以下特征：

- nodeType 等于 1
- nodeName 值为元素的标签名
- nodeValue 值为 null
- parentNode 值为 Document 或 Element 对象
- 子节点可以是 Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference 类型

可以通过 nodeName 或 tagName 属性来获取元素的标签名，有下面元素：

```html
<div id="myDiv"></div>
```

如下取得元素标签名

```javascript
let div = document.getElementById("myDiv");
// 在 HTML 中，元素标签名始终以全大写表示
alert(div.tagName); // "DIV"
alert(div.tagName == div.nodeName); // true
```

所有 HTML 元素都通过 HTMLElement 类型表示，具有以下属性：

- id 元素在文档中的唯一标识符
- title 包含元素的额外信息，通常以提示条形式展示
- lang 元素内容的语言代码
- dir 语言的书写方向，"ltr"表示从左到右，"rtl"表示从右到左
- className 相当于 class 属性，用于指定元素的 CSS 类

所有属性都可以获取或修改，例如：

```html
<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
```

通过 JS 读取或修改属性：

```javascript
let div = document.getElementById("myDiv");
// 读取
alert(div.id); // "myDiv"
alert(div.className); // "bd"
alert(div.title); // "Body text"
alert(div.lang); // "en"
alert(div.dir); // "ltr"
// 修改
div.id = "someOtherId";
div.className = "ft";
div.title = "Some other text";
div.lang = "fr";
div.dir ="rtl";
```

HTML 中的每个元素都有零到多个属性，与属性相关的 DOM 方法主要有 3 个：getAttribute()、setAttribute() 和 removeAttribute()，通过他们可操纵元素属性

```javascript
let div = document.getElementById("myDiv");
alert(div.getAttribute("id"));     // "myDiv"
alert(div.getAttribute("class"));  // "bd"
alert(div.getAttribute("title"));  // "Body text"
alert(div.getAttribute("lang"));   // "en"
alert(div.getAttribute("dir"));    // "ltr"
```

有几个地方需要注意：

- 如果给定的属性不存在，则 getAttribute() 返回 null
- 属性名不区分大小写
- getAttribute() 方法不局限于 HTML 元素的公认属性，也可取到自定义属性的值
- 通过 getAttribute() 方法取到的值为字符串形式，在某些情况下不利于进一步操作，因此多用于读取自定义属性的值

与 getAttribute() 配套的方法是 setAttribute()，这个方法接收两个参数：要设置的属性名和属性的值。如果属性已经存在，则 setAttribute() 会以指定的值替换原来的值；如果属性不存在，则 setAttribute() 会以指定的值创建该属性。setAttribute() 适用于 HTML 属性，也适用于自定义属性。使用 setAttribute() 方法 设置的属性名会规范为小写形式，因此"ID"会变成"id"。

```javascript
div.setAttribute("id", "someOtherId");
div.setAttribute("class", "ft");
div.setAttribute("title", "Some other text");
div.setAttribute("lang","fr");
div.setAttribute("dir", "rtl");
div.id = "someOtherId";
div.align = "left";
// 在 DOM 对象上添加自定义属性，如果属性不存在，则不会自动让它变成元素的属性
div.mycolor = "red";
alert(div.getAttribute("mycolor"));
```

 removeAttribute() 用于从元素中删除属性。这样不单单是清除属性的值，而是会把整个属性完全从元素中去掉

Element 类型可以通过 attributes 属性返回一个 NamedNodeMap 实例，它是一个类似 NodeList 的“实时”集合。元素的每个属性都表示为一个 Attr 节点，并保存在这个 NamedNodeMap 对象中。NamedNodeMap 对象包含下列方法：

- getNamedItem(name)，返回 nodeName 属性等于 name 的节点
- removeNamedItem(name)，删除 nodeName 属性等于 name 的节点
- setNamedItem(node)，向列表中添加 node 节点，以其 nodeName 为索引
- item(pos)，返回索引位置 pos 处的节点

例如：

```javascript
let id = element.attributes.getNamedItem("id").nodeValue;
// 使用中括号访问属性的简写形式
let id = element.attributes["id"].nodeValue;
```

attributes 属性最有用的场景是需要迭代元素上所有属性的时候。

使用 document.createElement() 方法创建新元素：

```javascript
let div = document.createElement("div");
```

此时，可以再为其添加属性、子元素

```javascript
div.id = "myNewDiv";
div.className = "box";
```

再将其添加到文档中

```javascript
document.body.appendChild(div);
```

元素被添加到文档树之后，就会被浏览器渲染出来了。

元素还可以通过 childNodes 属性获取所有子节点，再通过遍历的方式进一步操作子节点

```javascript
for (let i = 0, len = element.childNodes.length; i < len; ++i) {
  if (element.childNodes[i].nodeType == 1) {
    // 执行某个操作 }
  }
}
```

## Text 类型

Text 节点由 Text 类型表示，包含纯文本，也可能包含转义后的 HTML 字符，但不含 HTML 代码。Text 类型的节点具有以下特征：

- nodeType 等于 3
- nodeName 值为"#text"
- nodeValue 值为节点中包含的文本
- parentNode 值为 Element 对象
- 不支持子节点

Text 节点中的文本可以通过 nodeValue 属性访问，也可以通过 data 属性访问，这两个属性包含相同的值。可通过以下方法操作文本内容：

- appendData(text)，向节点末尾添加文本 text
- deleteData(offset, count)，从位置 offset 开始删除 count 个字符
- insertData(offset, text)，在位置 offset 插入 text
- replaceData(offset, count, text)，用 text 替换从位置 offset 到 offset + count 的文本
- splitText(offset)，在位置 offset 将当前文本节点拆分为两个文本节点
- substringData(offset, count)，提取从位置 offset 到 offset + count 的文本
- 通过 length 属性获取文本节点中包含的字符数量

document.createTextNode() 可以用来创建新文本节点，它接收一个参数，即要插入节点的文本。

```javascript
let element = document.createElement("div");
element.className = "message";
let textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
document.body.appendChild(element);
```

一般来说一个元素只包含一个文本子节点，但是通过代码可以添加多个节点，这被称作兄弟节点，通过 normalize() 方法可以将多个兄弟节点合并为一个文本节点：

```javascript
let element = document.createElement("div");
element.className = "message";
// 创建文本节点
let textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
let anotherTextNode = document.createTextNode("Yippee!");
element.appendChild(anotherTextNode);
// 渲染
document.body.appendChild(element);
// 将多个节点合并为一个文本节点
alert(element.childNodes.length);    // 2
element.normalize();
alert(element.childNodes.length); // 1 
alert(element.firstChild.nodeValue); // "Hello world!Yippee!"
```

既然文本节点能够合并，相应地也可以进行拆分。splitText() 方法可以在指定的偏移位置拆分 nodeValue，将一个文本节点拆分成两个文本节点。

```javascript
let element = document.createElement("div");
element.className = "message";
let textNode = document.createTextNode("Hello world!");
element.appendChild(textNode);
document.body.appendChild(element);
// 拆分
let newNode = element.firstChild.splitText(5);
alert(element.firstChild.nodeValue);  // "Hello"
alert(newNode.nodeValue);             // " world!"
alert(element.childNodes.length);     // 2
```

## DocumentFragment 类型

文档片段的作用是充当其他要被添加到文档的节点的仓库，可以使用 document.createDocumentFragment() 方法创建文档片段。

假设想给<ul>元素添加 3 个列表项，如果分 3 次给这个元素添加列表项，浏览器就要重新渲染 3 次页面，以反映新添加的内容。为避免多次渲染，下面的代码示例使用文档片段创建了所有列表项，然后一次性将它们添加到了<ul>元素：

```javascript
let fragment = document.createDocumentFragment();
let ul = document.getElementById("myList");
for (let i = 0; i < 3; ++i) {
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(`Item ${i + 1}`));
  fragment.appendChild(li);
}
ul.appendChild(fragment);
```

## 动态脚本

加载外部文件：

```javascript
// 引入外部 JS 文件
<script src="foo.js"></script>
// 也可以通过 DOM 创建节点
let script = document.createElement("script");
script.src = "foo.js";
document.body.appendChild(script);
```

## 动态样式

CSS 样式在 HTML 页面中可以通过两个元素加载。<link> 元素用于包含CSS外部文件，而 <style> 元素用于添加嵌入样式。

```javascript
<link rel="stylesheet" type="text/css" href="styles.css">
// 通过 DOM 创建链接
let link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "styles.css";
let head = document.getElementsByTagName("head")[0];
head.appendChild(link);
```

另一种定义样式的方式是使用 <script> 元素包含嵌入的 CSS 规则，例如：

```html
<style type="text/css">
  body {
    background-color: red;
  }
</style>
```

## MutationObserver 接口

MutationObserver 接口可以在 DOM 被修改时异步执行回调。MutationObserver 的实例要通过调用 MutationObserver 构造函数并传入一个回调函数来创建：

```javascript
let observer = new MutationObserver(() => console.log('DOM was mutated!'));
```

新创建的 MutationObserver 实例不会关联 DOM 的任何部分。要把这个 observer 与 DOM 关联起来，需要使用 observe() 方法。这个方法接收两个必需的参数：要观察其变化的 DOM 节点，以及 一个 MutationObserverInit 对象。MutationObserverInit 对象用于控制观察哪些方面的变化，是一个键/值对形式配置选项的字典。

```javascript
// 创建一个观察者(observer)并配置它观察<body>元素上的属性变化
let observer = new MutationObserver(() => console.log('<body> attributes changed'));
observer.observe(document.body, { attributes: true });
```

观察者注册后，每个回调都会收到一个 MutationRecord 实例的数组。MutationRecord 实例包含的信息包括发生了什么变化，以及 DOM 的哪一部分受到了影响。因为回调执行之前可能同时发生多个满足观察条件的事件，所以每次执行回调都会传入一个包含按顺序入队的 MutationRecord 实例的数组。

```javascript
let observer = new MutationObserver(
(mutationRecords) => console.log(mutationRecords)); observer.observe(document.body, { attributes: true });    
document.body.setAttribute('foo', 'bar');
```

传给回调函数的第二个参数是观察变化的 MutationObserver 的实例，演示如下：

```javascript
let observer = new MutationObserver(
(mutationRecords, mutationObserver) => console.log(mutationRecords,
mutationObserver));
observer.observe(document.body, { attributes: true }); document.body.className = 'foo';
```

默认情况下，只要被观察的元素不被垃圾回收，MutationObserver 的回调就会响应 DOM 变化事件，从而被执行。要提前终止执行回调，可以调用 disconnect()方法。

```javascript
let observer = new MutationObserver(() => console.log('<body> attributes changed'));
observer.observe(document.body, { attributes: true });
document.body.className = 'foo';
observer.disconnect();
document.body.className = 'bar';
```

调用 disconnect() 并不会结束 MutationObserver 的生命。还可以重新使用这个观察者，再将它关联到新的目标节点。

多次调用 observe()方法，可以复用一个 MutationObserver 对象观察多个不同的目标节点。此时，MutationRecord 的 target 属性可以标识发生变化事件的目标节点。

```javascript
let observer = new MutationObserver(
(mutationRecords) => console.log(mutationRecords.map((x) =>
x.target)));
// 向页面主体添加两个子节点
let childA = document.createElement('div'),
    childB = document.createElement('span');
document.body.appendChild(childA);
document.body.appendChild(childB);
// 观察两个子节点
observer.observe(childA, { attributes: true }); observer.observe(childB, { attributes: true });
// 修改两个子节点的属性 
childA.setAttribute('foo', 'bar'); 
childB.setAttribute('foo', 'bar');
// [<div>, <span>]
```

下表列出了 MutationObserverInit 对象的属性：

| 属性                  | 说明                                         |
| --------------------- | -------------------------------------------- |
| subtree               | 布尔值，是否观察目标节点的子树               |
| attributes            | 布尔值，是否观察目标节点的属性变化           |
| attributeFilter       | 字符串数组，要观察哪些属性的变化             |
| attributeOldValue     | 布尔值，是否记录变化之前的属性值             |
| characterData         | 布尔值，修改字符数据是否触发变化事件         |
| characterDataOldValue | 布尔值，是否记录变化之前的字符数据           |
| childList             | 布尔值，修改目标节点的子节点是否触发变化事件 |

