# 第23章 JSON

JSON 对象有两个方法：stringify() 和 parse()，这两个方法分别可以将 JavaScript 序列化为 JSON 字符串，以及将 JSON 解析为原生 JavaScript 值。

```javascript
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017 
};
let jsonText = JSON.stringify(book);
let bookCopy = JSON.parse(jsonText);
```

JSON.stringify() 方法除了要序列化的对象，还可以接收两个参数。这两个参数可以用于指定其他序列化 JavaScript 对象的方式。第一个参数是过滤器，可以是数组或函数；第二个参数是用于缩进结果 JSON 字符串的选项。

```javascript
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017 
};
// 只序列化 title 和 edition 属性
let jsonText = JSON.stringify(book, ["title", "edition"]);
// {"title":"Professional JavaScript","edition":4}
```

第二个参数也可以是一个函数，需要提供两个参数：属性名和属性值。依然以上方 book 代码为例：

```javascript
let jsonText = JSON.stringify(book, (key, value) => {
  switch(key) {
    case "authors":
      return value.join(",")
    case "year":
      return 5000;
    case "edition":
      return undefined;
    default:
      return value;
  }
});
// {"title":"Professional JavaScript","authors":"Nicholas C. Zakas,Matt Frisbie","year":5000}
```

这个函数基于 key 进行了过滤，如果是"authors"，则将数组值转换为字符串；如果是"year"，则将值设置为 5000；如果是"edition"，则返回 undefined 忽略该属性。最后一定要提供默认返回值，以便返回其他属性传入的值。

JSON.stringify() 方法的第三个参数控制缩进和空格，在这个参数是数值时，表示每一级缩进的空格数：

```javascript
let jsonText = JSON.stringify(book, null, 4);
//{
//    "title": "Professional JavaScript",
//    "authors": [
//        "Nicholas C. Zakas",
//        "Matt Frisbie"
//    ],
//    "edition": 4,
//    "year": 2017
//}
```

如果缩进参数是一个字符串而非数值，那么 JSON 字符串中就会使用这个字符串而不是空格来缩进

```javascript
let jsonText = JSON.stringify(book, null, "--" );
//{
//--"title": "Professional JavaScript",
//--"authors": [
//----"Nicholas C. Zakas",
//----"Matt Frisbie"
//--],
//--"edition": 4,
//--"year": 2017
//}
```

有时候，对象需要在 JSON.stringify() 之上自定义 JSON 序列化。可以在要序列化的对象中添加 toJSON() 方法，序列化时会基于这个方法返回适当的 JSON 表示

```javascript
let book = {
  title: "Professional JavaScript",
  authors: [
    "Nicholas C. Zakas",
    "Matt Frisbie"
  ],
  edition: 4,
  year: 2017,
  toJSON: function() {
    return this.title;
  }
};
let jsonText = JSON.stringify(book);
```

