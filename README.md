jquery-decorateScrollBar
================

This is a jquery plug for decorate the browser's default scrollbar

### Getting Started 

Download the plug, unzip it and copy the files to your application directory and load them inside your HTML.

The jquery.decorateScrollBar.js and jquery.decorateScrollBar.css files are necessary.
And the HTML structure must like below: 

```
<div id="wrapper">
  <div class="content">
		<p>some context... some context...some context... some context</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	  <p>some context... some context...</p>
	</div>
</div>
```

**Note:**
The "content" element has scrollbar really. 
Generally, it has "width", "height" and "overflow" css properties.
And the "wrapper" element is necessary to wrap the "content" element, 
which must has no "padding" css properties.
And the "wrapper" element must have a "position" css properties, 
if you don't assign, it will be "relative".

### Usage Examples

**Sample Example**

```
$('#wrapper').decorateScrollBar();
```

**You can also extend the default options:**

```
$('#wrapper').decorateScrollBar({
	clickMoveSpace: 20,
  mouseWheelSpeed: 40
});
```

### Options

You can pass these options as key/value object during activation to alter the default behaviour.

----------------------------

#### contentId

* **Type:** `string`
* **Default:** ``

The "content" elements's id.

----------------------------

#### contentClassName

* **Type:** `string`
* **Default:** ``

The "content" elements's class name.

----------------------------

#### sbYRailClassName

* **Type:** `string`
* **Default:** `scrollbar-y-rail`

The scrollbar Y Rail class name.

----------------------------

#### sbYClassName

* **Type:** `string`
* **Default:** `scrollbar-y`

The scrollbar Y class name.

----------------------------

#### sbXRailClassName

* **Type:** `string`
* **Default:** `scrollbar-x-rail`

The scrollbar X Rail class name.

----------------------------

#### sbXClassName

* **Type:** `string`
* **Default:** `scrollbar-x`

The scrollbar X class name.

----------------------------

#### sbYRailWidth

* **Type:** `integer`
* **Default:** `12`

The scrollbar Y Rail width.

----------------------------

#### sbXRailHeight

* **Type:** `integer`
* **Default:** `12`

The scrollbar X Rail height.

----------------------------

#### clickMoveSpace

* **Type:** `integer`
* **Default:** `30`

The move space when click button.

----------------------------

#### mouseWheelSpeed

* **Type:** `integer`
* **Default:** `50`

The mouse wheel speed.

----------------------------

#### railClickMoveCoefficient

* **Type:** `integer`
* **Default:** `2`

The move space will be clickMoveSpace * railClickMoveCoefficient when click rail.

----------------------------

### Public Methods

#### update
Manually update the scrollbar. For example, when the size of "content" change.

*Usage:*

```
$('#wrapper').decorateScrollBar('update');
```
----------------------------

#### destory
Manually remove all click event, relative dom, and delete the jquery cache.

*Usage:*

```
$('#wrapper').decorateScrollBar('destory');
```