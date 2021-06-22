# yngwie
A declarative approach to generating client-side HTML using it's own virtual DOM implementation.

- [What Is This?](#what-is-this)
- [API](#api)
  - [Yngwie.Node](#yngwie-node-api)
  - [Yngwie.Element](#yngwie-element-api)
  - [Yngwie.TextNode](#yngwie-textNode-api)
  - [Yngwie.Listener](#yngwie-listener-api)
  - [Yngwie.Transform](#yngwie-transform-api)
  - [Yngwie.Error](#yngwie-error-api)

<a id ="what-is-this" />

## What Is This?

It's pretty much a virtual DOM, in that the [YngwieElement](#yngwieElement) class can represent DOM [elements](https://developer.mozilla.org/en-US/docs/Web/API/Element), can create and manipulate those elements without them being part of the DOM, and can render those elements into actual DOM nodes. It can also do the reverse though, using [YngwieTransform](#yngwieTransform) to generate yngwieElements from existing DOM nodes, or generate yngwieElements from a STRING of HTML markup, e.g. `<div>HTML Content</div>`

 **yngwie** node relationships are implemented as a linked list, which is why there is no "children" property. Instead, every [YngwieNode](#yngwieNode) instance, and it's subclasses, have references to their parent, first child, last child, next sibling, and previous sibling. There is a "children" method though that returns an array of nodes by iterating the first child's siblings until there aren't any siblings left to iterate.

 It should also be noted  that **yngwie** is not "reactive", which is why there aren't any "patch" or "diff" methods defined anywhere - **yngwie**'s purpose is only to represent nodes that can eventually exist as nodes in the DOM, and to manipulate and alter those nodes before they are rendered and attached to an actual browser-based DOM client-side. As it stands now, rendering changes to the DOM can be accomplished manually by either appending or replacing nodes generated by YngwieElement's [render](#render) instance method or by using the static YngwieElement methods [renderTo](#renderTo) and [inject](#inject).

 The [YngwieListener](#yngwieListener) class handles binding event listeners to elements at time of render. A yngwieListener rendered by a yngwieElement (e.g. event listeners bound to a yngwieElement using [on](#on)) are called from the context of the yngwieElement they are bound to (i.e., that bound yngwieElement can be referenced by *this* from within the handler function) this opens up the possibility of re-rendering parts of the UI , without re-rendering the entire UI, when certain events are dispatched by the user or another listener. This approach however is admittedly clunky - and a more explicitly MVC approach should be considered as a separate solution built on top of **yngwie** as opposed to something **yngwie** itself stives to support.

<a id="api" />

## API

<a id="yngwie-node-api"/>

### Yngwie.Node ([YngwieNode](#yngwieNode))

  - [CONSTRUCTOR](#node)

  - **Instance Methods**  
    - [append](#append)
    - [detach](#detach)
    - [children](#children)
    - [appends](#appends)
    - [insertBefore](#insertBefore)
    - [replaceWith](#replaceWith)
    - [clone](#clone)
    - [parse](#parse)

  - **Static Methods**
    - [init](#node_init)
    - [parse](#node_parse)

<a id="yngwie-element-api" />

### Yngwie.Element ([YngwieElement](#yngwieElement))

  - [CONSTRUCTOR](#elem)

  - **Instance Methods**
    - [tagname](#tagname)
    - [attribs](#attribs)
    - [hasAttribute](#hasAttribute)
    - [getAttribute](#getAttribute)
    - [setAttribute](#setAttribute)
    - [removeAttribute](#removeAttribute)
    - [text](#text)
    - [removeText](#removeText)
    - [getElementsBy](#getElementsBy)
    - [getElementsByTagName](#getElementsByTagName)
    - [getElementsByAttribute](#getElementsByAttribute)
    - [getElementsByClass](#getElementsByClass)
    - [getElementByID](#getElementByID)
    - [on](#on)
    - [clone](#elem_clone)
    - [render](#render)

  - **Static Methods**
    - [init](#elem_init)
    - [renderTo](#renderTo)
    - [inject](#inject)

<a id="yngwie-textNode-api" />

### Yngwie.TextNode ([YngwieTextNode](#yngwieTextNode))

  - [CONSTRUCTOR](#textNode)

  - **Instance Method**
    - [text](#textNode_text)
    - [append](#textNode_append)
    - [render](#textNode_render)
    - [clone](#textNode_clone)

  - **Static Method**
    - [init](#textNode_init)

<a id="yngwie-listener-api" />

### Yngwie.Listener ([YngwieListener](#yngwieListener))

  - [CONSTRUCTOR](#listener)

  - **Instance Methods**
    - [add](#listener_add)
    - [clone](#listener_clone)
    - [render](#listener_render)

  - **Static Methods**
    - [init](#listener_init)

<a id="yngwie-transform-api" />

### Yngwie.Transform ([YngwieTransfrom](#yngwieTransform))

- [CONSTRUCTOR](#transform)

- **Instance Methods**
  - [toNODE](#transform_toNode)
  - [toSTRING](#transform_toString)
  - [toYngwie](#transofmr_toYngwie)

- **Static Methods**
  - [init](#transform_init)
  - [toNODE](#tranform_toNode_static)
  - [toSTRING](#tranform_toString_static)
  - [toYNGWIE](#tranform_toYngwie_static)
  - [getType](#transform_getType)

<a id="yngwie-error-api" />

### Yngwie.Error ([YngwieError](#yngwieError))

- [CONSTRUCTOR](#error)

- **Instance Methods**
  - [log](#error_log)

<a id="yngwieNode" />

## Yngwie.Node (YngwieNode)
Virtual DOM Node

### Properties

Property|Type|Description
--------|----|-----------
_value | STRING | Arbitrary STRING value that can be stored in this node
_parent | yngwieNode | Parent of this node (is UNDEFINED if this node has no parent)
_first | yngwieNode | First child of this node (is UNDEFINED if this node has no children)
_last | yngwieNode | Last child of this node (is UNDEFINED if this node has no children)
_next | yngwieNode | This node's next sibling (is UNDEFINED if this is the last child of this node's parent)
_prev | yngwieNode | This node's previous sibling (is UNDEFINED if this is the first child of this node's parent)

<a id="node" />

### CONSTRUCTOR :: STRING -> yngwieNode
Creates instance of yngwieNode with the given STRING stored as it's value.

```javascript
// Creates instance of YngwieNode with the STRING "Hello World!" stored in it's value:
let node = new Yngwie.Node("Hello World!")
```

<a id="append" />

### yngwieNode.append :: yngwieNode -> this
Chainable method that appends the given instance of yngwieNode to this node. If argument is not a yngwieNode, a YngwieError is thrown. If given node already has a parent, that node is detached and appended to this node.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");
let c = new Yngwie.Node("c");
let d = new Yngwie.Node("d");

// Appends b,c, and d to a:
a.append(b).append(c).append(d)
```

<a id="detach" />

### yngwiwNode.detach :: VOID -> this
Chainable method that detaches this node from it's parent. When a yngwieNode is detached, that means it has no parent, previous sibling, or next sibling *but* it's children are still intact.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");

// Append b to a:
a.append(b);

// Detach b from a:
b.detach();
```

<a id="children" />

### yngwieNode.children :: VOID -> [yngwieNode]
Returns all children of this node. If this node has no children, then an empty array is returned.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");
let c = new Yngwie.Node("c");
let d = new Yngwie.Node("d");

// Appends b,c, and d to a:
a.append(b).append(c).append(d)

// Returns array with nodes b,c and d:
a.children();
```

<a id="appends" />

### yngwieNode.appends :: [yngwieNode] -> this
Chainable method that appends an array of yngwieNodes to this node. If any element of the given array is not an instance of YngwieNode, then a YngwieError exception is thrown. If argument is not an array, then a YngwieError exception is also thrown.

```javascript
// Create "a" node:
let a = new Yngwie.Node("a");

// Creates children and appends them:
a.appends([
  new Yngwie.Node("b"),
  new Yngwie.Node("c"),
  new Yngwie.Node("d")
]);

// Returns [b,c,d]:
a.children();
```

<a id="insertBefore" />

### yngwieNode.insertBefore :: yngwieNode -> this
Chainable method that inserts the given yngwieNode before this node. If argument is not an instance of YngwieNode, then a YngwieError exception is thrown.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");
let c = new Yngwie.Node("c");
let d = new Yngwie.Node("d");

// b and c and now children of a:
a.appends([b,c]);

// d is inserted before c:
c.insertBefore(d);

// Returns [b,d,c]:
a.children();
```

<a id="replaceWith" />

### yngwieNode.replaceWith :: yngwieNode -> yngwieNode
Chainable method that replaces this node with the given instance of yngwieNode, returning
the node that has been replaced. If argument is not an instance of YngwieNode, then a YngwierError exception
is thrown. If node that's being replaced has no parent, then a YngwieError exception is also thrown.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");
let c = new Yngwie.Node("c");
let d = new Yngwie.Node("d");

// b and c and now children of a:
a.appends([b,c]);

// d is inserted before c:
c.replaceWith(d);

// Returns [b,d]:
a.children();
```

<a id="clone" />

### yngwieNode.clone :: VOID -> yngwieNode
Chainable method that creates a clone of this node that includes
all of it's descendants, whereas the descendants themselves are also clones.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");
let c = new Yngwie.Node("c");
let d = new Yngwie.Node("d");

// b and c are now children of a:
a.appends([b,c]);

// Create clone of a and append d:
let cloneOfA = a.clone().append(d);

// Returns [b,c]:
a.children();

// Returns [b,c,d]:
cloneOfA.children();
```

<a id="parse" />

### yngwieNode.parse :: (yngwieNode, a -> a), a -> a
Applies function to this node and all of it's descendants, returning a result.

```javascript
// Create some nodes:
let a = new Yngwie.Node("a");
let b = new Yngwie.Node("b");
let c = new Yngwie.Node("c");
let d = new Yngwie.Node("d");

// b,c,d are now children of a:
a.appends([b,c,d]);

// Returns ["a", "b", "c", "d"]:
a.parse((node, result) => {
  result.push(node._value);
}, []);
```

<a id="node_init" />

### YngwieNode.init :: STRING -> yngwieNode
Static factory method for creating an instance of YngwieNode.

```javascript
// Create "a" node and appends children, then returns ["a", "b", "c", "e", "f", "d"]:
Yngwie.Node.init("a").appends([
  Yngwie.Node.init("b"),
  Yngwie.Node.init("c").appends([
    Yngwie.Node.init("e"),
    Yngwie.Node.init("f")
  ]),
  Yngwie.Node.init("d"),
]).parse((node, result) => {
  result.push(node._value);
  return result;
}, []);
```

<a id="node_parse" />

### YngwieNode.parse :: yngwieNode, (yngwieNode -> VOID) -> VOID
Applies function to given yngwieNode and all of it's depdents using Crockford's
recursive DOM walk algorithm from "Javascript: The Good Parts".

```javascript
// Create "a" node and appends children:
let a = Yngwie.Node.init("a").appends([
  Yngwie.Node.init("b"),
  Yngwie.Node.init("c").appends([
    Yngwie.Node.init("e"),
    Yngwie.Node.init("f")
  ]),
  Yngwie.Node.init("d"),
]);

// Writes each node's value to console:
Yngwie.Node.parse(a, (node) => {
  console.log(node._value);
});
```   


<a id="yngwieElement" />

## Yngwie.Element (YngwieNode => YngwieElement)
Virtual DOM Element that extends [YngwieNode](#yngwieNode) class

### Properties

Property|Type|Description
--------|----|-----------
_value | STRING | Tag name of element
_attribs | {STRING:STRING} | Attribute name and value associated with this element in the form of {attribute_name:attribute_value}
_text | STRING | Text that is appended as the first child of this element when the element is rendered
_listeners | [yngwieListener] | Event listeners bound to this element

<a id="elem" />

### CONSTRUCTOR :: STRING, OBJECT, STRING, [yngwieListener] -> yngwieElement
Creates instance of YngwieElement with the given tag name, attributes, text, and event listeners.

```javascript
// Returns instance of YngwieElement with a tag of "div", the attribute "class" with the value of "container", and to append a text node with the value "Hello World!" when this YngwieElement instance is rendered:
let elem = new Yngwie.Element("DIV", {"class":"container"}, "Hello World!");
```

<a id="tagname" />

### yngwieElement.tagname :: VOID -> STRING
Returns tag name of this element.

```javascript
// Create new DIV element:
let elem = new Yngwie.Element("DIV");

// Returns "DIV":
elem.tagname();
```

<a id="attribs" />

### yngwieElement.attribs :: OBJECT|VOID -> this|OBJECT
Sets "attribs" property with given OBJECT. If no argument is given, set attributes are returned. Is chainable only if an argument is given. If argument is not an OBJECT, then a YngwieError exception is thrown.

```javascript
// Create new "DIV" element:
let elem = new Yngwie.Element("DIV");

// Set "class" and "id" attribute of element :
elem.attribs({"class":"container", "id":"test"});

// Returns {"class":"container", "id":"test"}
elem.attribs();

```

<a id="hasAttribute" />

### yngwieElement.hasAttribute :: STRING -> BOOLEAN
Returns BOOLEAN for if attribute exists with given name in "attribs" OBJECT.

```javascript
// Create new "DIV" element with class:
let elem = new Yngwie.Element("DIV", {"class":"container"});

// Returns TRUE:
elem.hasAttribte("class");

// Returns FALSE:
elem.hasAttribute("id");
```

<a id="getAttribute" />

### yngwieElement.getAttribute :: STRING -> *|UNDEFINED
Returns value of attribute by name stored in "attribs" OBJECT, otherwise returns UNDEFINED.

```javascript
// Create new "DIV" element with class:
let elem = new Yngwie.Element("DIV", {"class":"container"});

// Returns "container":
elem.getAttribute("class");

// Returns UNDEFINED:
elem.getAttribute("id");
```

<a id="setAttribute" />

### yngwieElement.setAttibute :: STRING, * -> this
Chainable method that binds value to this element's attributes with given name.

```javascript
// Create new "DIV" element:
let elem = new Yngwie.Element("DIV");

// Sets "class" and "id" attributes:
elem.setAttribute("class", "container").setAttribute("id", "test");

// Returns {"class":"container", "id":"test"}
elem.attribs();
```

<a id="removeAttribute" />

### yngwieElement.removeAttribute :: STRING -> this
Chainable method that removes attribute with given name from this element's attributes.

```javascript
// Create new "DIV" element with attributes:
let elem = new Yngwie.Element("DIV", {"class":"container". "test":"id"});

// Removes "test" attribute and sets "id":
elem.removeAttribute("test").setAttribute("id", "test");

// Returns FALSE:
elem.hasAttribute("test");
```

<a id="text" />

### yngwieElement.text :: STRING|VOID -> this|STRING
Appends text node as first child of element at render with given STRING as it's value. This method is only chainable if an argument is given. If no argument is given, set text is returned. If given argument is not a STRING, then a YngwieError exception is thrown.

```javascript
// Create new "DIV" element:
let elem = new Yngwie.Element("DIV");

// Sets text:
elem.text("Hello World!");

// Returns "Hello World!";
elem.text();
```

<a id="removeText" />

### yngwieElement.removeText :: VOID -> this
Chainable method that sets text as UNDEFINED for this element.

```javascript
// Create new "DIV" element with text but no attributes:
let elem = new Yngwie.Element("DIV", {}, "Hello World!");

// Removes text and returns UNDEFINED:
elem.removeText().text();
```

<a id="getElementsBy" />

### yngwieElement.getElementsBy :: (yngwieElement -> BOOLEAN) -> [yngwieElement]
Returns all the elements that, when the given function is applied to this element and it's descendants, that function returns TRUE.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a"});
let b = new Yngwie.Element("DIV", {"id":"b"});
let c = new Yngwie.Element("SPAN", {"id":"c"});
let d = new Yngwie.Element("SPAN");

// Append elements to "a":
a.appends([b,c,d]);

// Get elements that only have an "id" attribute AND are a DIV element:
let reuslt = a.getElementsBy(elem=>elem.hasAttribute("id") && elem.tagname() === "DIV");

// Returns ["a","b"]
result.parse((elem, result) => result.concat([elem.getAttribute("id")]), []);
```

<a id="getElementsByTagName" />

### yngwieElement.getElementsByTagName :: STRING -> [yngwieElement]
Returns all the elements that have the given tag name from this element and it's descendants. If no elements have the given tag name, then an empty array is returned.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a"});
let b = new Yngwie.Element("DIV", {"id":"b"});
let c = new Yngwie.Element("SPAN", {"id":"c"});
let d = new Yngwie.Element("SPAN");

// Append elements to "a":
a.appends([b,c,d]);

// Returns [c,d]
a.getElementsByTagName("SPAN");

```

<a id="getElementsByAttribute" />

### yngwieElement.getElementsByAttribute :: STRING, *|VOID -> [yngwieElement]
Returns all the elements that have the given attribute name and value from this element and it's descendants. If no attribute value is given, then returns any element that has that attribute. Returns an empty array if no matches are found.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a", "class":"container"});
let b = new Yngwie.Element("DIV", {"id":"b", "class":"header"});
let c = new Yngwie.Element("SPAN", {"id":"c", "class":"text"});
let d = new Yngwie.Element("SPAN", {"class":"text"});

// Append elements to "a":
a.appends([b,c,d]);

// Returns [a,b,c,d]
a.getElementsByAttribute("class");

// Returns [b]
a.getElementsByAttribute("class", "header");
```

<a id="getElementsByClass" />

### yngwieElement.getElementsByClass :: STRING -> [yngwieElement]
Returns all elements with the class attribute set to the given STRING argument. Returns empty array if no matches are found.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a", "class":"container"});
let b = new Yngwie.Element("DIV", {"id":"b", "class":"header"});
let c = new Yngwie.Element("SPAN", {"id":"c", "class":"text"});
let d = new Yngwie.Element("SPAN", {"class":"text"});

// Append elements to "a":
a.appends([b,c,d]);

// Returns [c,d]
a.getElementsByClass("text");
```

<a id="getElementByID" />

### yngwieElement.getElementByID :: STRING -> yngwieElement|UNDEFINED
Returns element with the given ID. If no elements are found, UNDEFINED is returned.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a", "class":"container"});
let b = new Yngwie.Element("DIV", {"id":"b", "class":"header"});
let c = new Yngwie.Element("SPAN", {"id":"c", "class":"text"});
let d = new Yngwie.Element("SPAN", {"class":"text"});

// Append elements to "a":
a.appends([b,c,d]);

// Returns c
a.getElementById("c");
```

<a id="on" />

### yngwieElement.on :: STRING, [(EVENT, ELEMENT -> VOID)]|EVENT, ELEMENT -> VOID -> this
Chainable method that binds event listeners by event name to element at render. The function called by the event listener is called in the context of this element (i.e. *this* references the bound yngwieElement from within the function passed to the event listener).

```javascript
// Create DIV element with attributes:
let elem = new YngwieElement("DIV", {"id":"a", "class":"container"}, "Hello World!");

// Bind click events:
elem.on("click", [
  function (evt, node) {
    alert(this.text())  // Shows "Hello World!" in alert prompt
  },
  function (evt, node) {
    console.log(this); // Consoles yngwieElement this handler is bound to
  },
  (evt, node) => console.log(this) // Consoles "WINDOW" because of the scope this fat-arrow function is defined in
])

// Bind mouseover event:
elem.on("mouseover", (evt, node) => console.log(node)) // Consoles node event listener is bound to
```

<a id="elem_clone" />

### yngwieElement.clone :: VOID -> yngwieElement
Returns clone of this element and it's descendants.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a", "class":"container"});
let b = new Yngwie.Element("DIV", {"id":"b", "class":"header"});
let c = new Yngwie.Element("SPAN", {"id":"c", "class":"text"});
let d = new Yngwie.Element("SPAN", {"class":"text"});

// Append elements to "a":
a.appends([b,c,d]);

// Clone a:
let cloneOfA = a.clone();

// Remove b from a:
b.detach();

// Returns [a,c,d]
a.children();

// Returns [a,b,c,d]:
cloneOfA.children();
```

<a id="render" />

### yngwieElement.render :: STRING|ELEMENT|VOID, OBJECT -> ELEMENT
Transforms this element and it's descendants into a DOM ELEMENT, appending result to given target
and rendering that ELEMENT in the context of the given OBJECT. "Context", in this case means what's being used to initialize the ELEMENT with and where to query the target if the target is a STRING. If target is UNDEFINED, then the rendered ELEMENT is returned. If context is UNDEFINED, then DOCUMENT is used by default.

```javascript
// Create some elements:
let a = new Yngwie.Element("DIV", {"id":"a", "class":"container"});
let b = new Yngwie.Element("DIV", {"id":"b", "class":"header"});
let c = new Yngwie.Element("SPAN", {"id":"c", "class":"text"});
let d = new Yngwie.Element("SPAN", {"class":"text"});

// Append elements to "a":
a.appends([b,c,d]);

// Renders and appends elements to DOCUMENT BODY element:
a.render("body");
```

<a id="elem_init" />

### YngwieElement.init :: STRING, OBJECT, STRING, [yngwieListener] -> yngwieElement
Static factory method for YngwieElement.

```javascript
// Create, append, and render elements to DOCUMENT BODY:
Yngwie.Element.init("DIV", "id":"a", "class":"container"}).appends([
  Yngwie.Element.init("DIV", {"id":"b", "class":"header"}).appends([
    Yngwie.Element.init("SPAN").text("Hello"),
    Yngwie.Element.init("SAPN").text("World")
  ]);
]).render("body");
```

<a id="renderTo" />

### YngwieElement.renderTo :: STRING|ELEMENT, [yngwieElement], OBJECT -> ELEMENT
Renders an array of yngwieElements, using the given context, and appends result to given target, returning the ELEMENT those elements were appended to. "Context", in this case means what's being used to initialize each ELEMENT with and where to query the target if the target is a STRING. If context is UNDEFINED, DOCUMENT is used by default. If any member of the given array is not an instance of YngwieElement, a YngwieError exception is thrown. If given argument is not an array, a YngwieError exception is also thrown.

```javascript
// Create, append, and render elements to DOCUMENT BODY:
Yngwie.Element.renderTo("body", [
  // Page Header:
  Yngwie.Element.init("HEADER").appends([
    Yngwie.Element.init("DIV", {"class":"banner"}, "[BANNER]"),
    Yngwie.Element.init("NAV").appends([
      Yngwie.Element.init("a", {"href":"/link/to/page"}, "Link 1"),
      Yngwie.Element.init("a", {"href":"/link/to/page"}, "Link 2"),
      Yngwie.Element.init("a", {"href":"/link/to/page"}, "Link 3"),
      Yngwie.Element.init("a", {"href":"/link/to/page"}, "Link 4"),
    ])
  ]),
  // Page Body:
  Yngwie.Element.init("MAIN").appends([
    Yngwie.Element.init("ARTICLE").text("Article 1"),
    Yngwie.Element.init("ARTICLE").text("Article 2"),
    Yngwie.Element.init("ARTICLE").text("Article 3"),
    Yngwie.Element.init("ARTICLE").text("Article 4")
  ]),
  // Page Footer:
  Yngwie.Element.init("FOOTER").text("[FOOTER]")
]);
```

<a id="inject" />

### YngwieElement.inject :: STRING|ELEMENT, yngwieElement, OBJECT -> ELEMENT
Replaces the given target with the render of the given YngwieElement using the given context. "Context", in this case means what's being used to initialize the ELEMENT with and where to query the target if the target is a STRING. If context is UNDEFINED, then DOCUMENT is used by default. If given argument is not an instance of YngwieElement, then a YngwieError exception is thrown.

```javascript
// Create some elements:
let elems = Yngwie.Element.init("DIV", {"class":"container"}).appends([
  Yngwie.Element.init("H3").text("Some List Of Items"),
  Yngwie.Element.init("UL").appends([
    Yngwie.Element.init("LI").text("Item 1"),
    Yngwie.Element.init("LI").text("Item 2")
    Yngwie.Element.init("LI").text("Item 3")
  ])
])

// Replaces an element with the id of "listView":
Yngwie.Element.inject("#listView", elems);

```

<a id="yngwieTextNode" />

## Yngwie.TextNode (YngwieNode => YngwieTextNode)
Virtual DOM Text Node that extends [YngwieNode](#yngwieNode) class

### Properties

Property|Type|Description
--------|----|-----------
_value | STRING | Text stored in node as STRING

<a id="textNode" />

### CONSTRUCTOR :: STRING -> yngwieTextNode
Creates instance of YngwieTextNode with the given STRING as it's text.

```javascript
// Create new YngwieTextNode instance with a value of "Hello World!";
let textNode = new Yngwie.TextNode("Hello World!");
```

<a id="textNode_text" />

### yngwieTextNode.text :: VOID -> STRING
Returns text stored in node.

```javascript
// Create text node:
let textNode = new Yngwie.TextNode("Hello World!");

// Returns "Hello World!"
textNode.text();
```
<a id="textNode_append" />

### yngwieTextNode.append :: STRING|yngwieTextNode -> this
Chainable method that appends STRING or stored value of another yngwieTextNode to the text stored in this text node.

```javascript
// Create some text nodes:
let a = new Yngwie.TextNode("a");
let b = new Yngwie.TextNode("b");
let c = new Yngwie.TextNode("c");
let d = new Yngwie.TextNode("d");

// Append text nodes:
a.append(b).append(c);

// Append more nodes and a STRING:
a.appends([d, "e"]);

// Returns "abcdef"
a.text();
```

<a id="textNode_render" />

### yngwieTextNode.render :: STRING|ELEMENT|VOID, OBJECT -> TEXT
Renders DOM [text node](https://developer.mozilla.org/en-US/docs/Web/API/Text_) from stored value within the given context. "Context", in this case means what's being used to initialize the TEXT node with and where to query the target if the target is a STRING. If target is UNDEFINED, the rendered TEXT node is returned. If context is UNDEFINED, then DOCUMENT is used by default.

```javascript
// Create some text nodes:
let a = new Yngwie.TextNode("a");
let b = new Yngwie.TextNode("b");
let c = new Yngwie.TextNode("c");
let d = new Yngwie.TextNode("d");

// Append text nodes:
a.appends[b,c,d];

// Creates DOM TextNode with a value of "abcd":
a.render();
```

<a id="textNode_clone" />

### yngwieTextNode.clone :: VOID -> yngwieTextNode
Creates clone of this text node.

```javascript
// Create some text nodes:
let a = new Yngwie.TextNode("a");
let b = new Yngwie.TextNode("b");
let c = new Yngwie.TextNode("c");
let d = new Yngwie.TextNode("d");

// Append text nodes:
a.appends[b,c,d];

// Create clone and append more text:
let clone = a.clone().append("e");

// Returns "abcd":
a.text()

// Returns "abcde":
clone.text();
```

<a id="textNode_init" />

### YngwieTextNode.init :: STRING -> yngwieTextNode
Static factory method for YngwieTextNode.

```javascript
// Create some text nodes and return "abcd":
Yngwie.TextNode.init("a").appends([
  "b",
  Yngwie.TextNode.init("c").append("d")
]).text();
```
<a id="yngwieListener" />

## Yngwie.Listener (YngwieListener)
Binds event handlers for a specific event to an instance of YngwieElement

### Properties

Property|Type|Description
--------|----|-----------
_evtName | STRING | Event to listener for
_fns| [(EVENT, ELEMENT) -> VOID] | Array of functions used by the listeners bound to the stored event when this listener is rendered

<a id="listener" />

### CONSTRUCTOR :: STRING, [(EVENT, ELEMENT -> VOID)] -> yngwieListener
Creates instance of YngwieListener with the given event name and array of functions to bind to that event.

```javascript
// Creates new yngwieListener instance that binds the given functions to a "click" event with instance is rendered:
let listener = new Yngwie.Listener("click", [
  function (evt, elem) {
    console.log(this); // Consoles context of listener at time of render
  },
  function (evt, elem) {
      console.log(elem); // Consoles ELEMENT this listener is bound to at time of render
    }
  }
]);
```
<a id="listener_add" />

### yngwieListener.add :: (EVENT, ELEMENT -> VOID) -> this
Chainable method for adding a function to the listener of the event stored by this listener.

```javascript
// Create a listener:
let listener = new Yngwie.Listener("click");

// Add listeners:
listener.add(function (evt, elem) {
  console.log(this); // Consoles context of listener at time of render
}).add(function (evt, elem) {
  console.log(elem); // Consoles ELEMENT this listener is bound to at time of render
});
```

<a id="listener_clone" />

### yngwieListener.clone :: VOID -> yngwieListener
Creates a clone of this listener, including all of the functions to bind to this listener when the listener is rendered.

```javascript
// Create a listener:
let listener = new Yngwie.Listener("click", [
  function (evt, elem) {
    console.log(this); // Consoles context of listener at time of render
  }
]);

// Clones first listener and adds second handler:
let listener2 = listener.clone().add(function (evt, elem) {
    console.log(elem); // Consoles ELEMENT this listener is bound to at time of render
});
```

<a id="listener_render" />

### yngwieListener.render :: ELEMENT, OBJECT -> ELEMENT
Creates event listener and binds it to given DOM ELEMENT, calling function of listener in given context. "Context", in this case means the context in which the function of the listener is called in. If context is UNDEFINED, function is called in the context of the ELEMENT the listener is bound to. If function of listener is an arrow function, then that function is called in the context of WINDOW.

```javascript
// Create a listener:
let listener = new Yngwie.Listener("click", [
  function (evt, elem) {
    console.log(this); // Consoles context of listener at time of render
  },
  function (evt, elem) {
    console.log(elem); // Consoles ELEMENT this listener is bound to at time of render
  }
]);

// Create an element:
let div = Yngwie.Element("DIV", {"id":"test"});

// Render element:
let body = Yngwie.Element.renderTo("body", [elem]);

// Initialize listener by binding to BODY and calling from DIV
listener.render(body, div);
```

<a id="listener_init" />

### YngwieListener.init :: STRING, [(EVENT, ELEMENT -> VOID)] -> yngwieElement
Static factory method for YngwieListener.

```javascript
// Create an element:
let div = Yngwie.Element("DIV", {"id":"test"});

// Render element:
let body = Yngwie.Element.renderTo("body", [elem]);

// Create and intialize listener:
Yngwie.Listener.init("click").add(function (evt, elem) {
  // Console element if event target has same id as bound yngwieElement:
  if (evt.target.hasAttribute("id")) {
    if (evt.target.getAttribute("id") === this.getAttribute("id")) {
      console.log(elem);
    }
  }
}).render(body, div);
```

<a id="yngwieTransform" />

## Yngwie.Transform (YngwieTransform)
Defines transformations between instances of STRING, NODE, and YNGWIE

### Properties

Property|Type|Description
--------|----|-----------
_value | * | Value to transform
_type| STRING | What type _value is.

<a id="transform" />

### CONSTRUCTOR :: NODE|STRING|yngwieNode -> yngwieTransform
Creates instance of YngwieTransform with given value. The only supported types for transformation are `STRING, NODE, and YngwieNode`.

```javascript
// Creates new yngwieTransform instance:
let transform = new Yngwie.Transfrom("<h1>Hello world!</h1>");
```

<a id="transform_toNode" />

### yngwieTransform.toNODE :: VOID -> NODE
Transforms stored value into a DOM Node. If type of stored value is UNDEFINED, then a YngwieError exception is thrown.

```javascript
// Create something to transform
let a = "<h1>Hello World!</h1>";
let b = Yngwie.Element("H2").text("Goodbye.");

// Create transforms:
let transformFromString = new Yngwie.Transform(a);
let transformFromYngwie = new Yngwie.Transform(b);

// Transform into DOM Nodes:
transformFromString.toNODE();
transformFromYngwie.toNODE();
```

<a id="transform_toString" />

### yngwieTransform.toNODE :: VOID -> STRING
Transforms stored value into a STRING. If type of stored value is UNDEFINED, then a YngwieError exception is thrown.

```javascript
// Create something to transform
let a = document.createElement("DIV");
let b = Yngwie.Element("H2").text("Goodbye.");

// Create transforms:
let transformFromNode = new Yngwie.Transform(a);
let transformFromYngwie = new Yngwie.Transform(b);

// Transform into STRINGs:
transformFromString.toSTRING(); // "<div></div>"
transformFromYngwie.toSTRING(); // "<h2>Goodbye</h2>"
```

<a id="transform_toYngiwe" />

### yngwieTransform.toNODE :: VOID -> yngiweNode
Transforms stored value into an instance of YngwieNode (or it's subclasses). If type of stored value is UNDEFINED, then a YngwieError exception is thrown.

```javascript
// Create something to transform
let a = document.createElement("DIV");
let b = "Hello World!";

// Create transforms:
let transformFromNode = new Yngwie.Transform(a);
let transformFromString = new Yngwie.Transform(b);

// Transform into YngwieNode instances:
transformFromNode.toYNGWIE();   // yngwieElement
transformFromString.toYNGWIE(); // yngwieTextNode
```

<a id="transform_init" />

### Yngwie.Transform.init :: NODE|STRING|yngiweNode -> yngwieTransform
Static factory method for YngwieTransform

```javascript
// Create transform:
let transform = Yngwie.Transform.init("<h1>Hello World</h1>");
```

<a id="transform_toNode_static" />

### YngwieTransform.toNODE :: NODE|STRING|yngiweNode -> NODE
Static method that transforms the given value into a NODE. If type of given value is UNDEFINED, then a YngwieError exception is thrown.

```javascript
// YngwieElement to transform:
let b = Yngwie.Element.init("H2").text("Goodbye.");

// Transforms into DOM Nodes:
Yngiwe.Transform.toNODE("<h1>Hello World!</h1>");
Yngwie.Transform.toNODE(b);
```

<a id="transform_toString_static" />

### YngwieTransform.toSTRING :: NODE|STRING|yngiweNode -> STRING
Static method that transforms the given value into a STRING. If type of given value is UNDEFINED, then a YngwieError exception is thrown.

```javascript
// Something to transform:
let a = document.create("DIV");
let b = Yngwie.Element.init("H2").text("Goodbye.");

// Transforms into STRINGs:
Yngiwe.Transform.toSTRING(a); // <div></div>
Yngwie.Transform.toSTRING(b); // <h2>Goodbye.</h2>
```

<a id="transform_toYngwie_static" />

### YngwieTransform.toYngwie :: NODE|STRING|yngiweNode -> yngwieNode
Static method that transforms the given value into a YngwieNode (or one of it's subclasses). If type of given value is UNDEFINED, then a YngwieError exception is thrown.

```javascript
// Create something to transform
let a = document.createElement("DIV");
let b = "Hello World!";

// Transform into YngwieNode instances:
Yngwie.Transform.toYNGWIE(a);  // yngwieElement
Yngwie.Transform.toYNGWIE(b);  // yngwieTextNode
```
<a id="transform_getType" />

### YngwieTransform.getType :: NODE|STRING|yngiweNode -> STRING|UNDEFINED
Static method that returns STRING of typename for given value. If type cannot be transformed, than UNDEFINED is returned.

```javascript
// Create something to transform
let a = document.createElement("DIV");
let b = "<h2>Hello World!";
let c = Yngwie.Element.init("H2").text("Goodbye").
let d = Yngwie.TextNode.init("Whatever.");
let e = 1000;

// Get types from values:
Yngwie.Transform.getType(a); // NODE
Yngiwe.Transform.getType(b); // STRING
Yngwie.Transform.getType(c); // YNGWIE
Yngwie.Transform.getType(d); // YNGWIE
Yngwie.Transform.getType(e); // UNDEFINED

// Transform into YngwieNode instances:
Yngwie.Transform.toYNGWIE(a);  // yngwieElement
Yngwie.Transform.toYNGWIE(b);  // yngwieTextNode
```

<a id="yngwieError" />

## Yngwie.Error (YngwieError)
Extends [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for handling yngwie.js errors.

### Properties

Property|Type|Description
--------|----|-----------
msg | STRING | Message of error
data | STRING | Data that caused error

<a id="error" />

### CONSTRUCTOR :: STRING, * -> yngwieError
Creates instance of YngwieError with given message and data. Any value passed as "data" will be stored as a STRING.

```javascript
// Creates new yngwieError instance:
let error = new Yngwie.Transfrom("Something Failed", thisFailed);
```

<a id="error_log" />

### yngwieError.log :: VOID -> VOID
Consoles out error message, error stack, and what data was passed to yngwieError when exception was thrown.

```javascript
// From /test/example3.html

try {
  let node = Yngwie.Node.init(1000);
} catch (err) {

  err.log();

  /*

    What shows in console:

    Error: Value of YngwieNode must be STRING
    at new YngwieNode (main.js:15)
    at example3.html:177
    What Failed:  1000 (main.js:14)

  */

}
```
