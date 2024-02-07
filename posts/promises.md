---
title: "Promises and the DOM"
subtitle: "Basics on what a promise is and the Document Object Model"
date: "08/13/2022"
type: "budding"
---


Promises. Asynchronous by nature. 

A *Promise* is a proxy of a value that is not necessarily known when the promise is created. It allows it to associate controllers withe the eventual value of success or the reason of failure of an asynchronous action. This allows that async methods return values like synchronous methods: instead of returning the finally value immediately, the asynchronous return the promise of delivering the value sometime in the future. 

```jsx
const prom = new Promise((resolve, reject) => {

	setTimeout( () => {
	console.log( '2 seconds later' )
  }, 2000 )
 

});
```

A Promise is an object representing the eventual completion or failure of an asynchronous operation. Since most people are consumers of already-created promises, this guide will explain consumption of returned promises before explaining how to create them.

Promises are created with one argument that is a callback, with two arguments:
Resolve and Reject.

Resolver executes if the promise is succesful, and reject executes if the promise shows an error or failure, eventually notifying the person that the promise wasn't succesful.



then → the promise was succesful

catch→ the promise was erroneous

finally→after then, and after catch.



```jsx
const promesa = new Promise((resolve, reject) => {

	setTimeout( () => {

  }, 2000 )
 
	promesa.then( () => {
		console.log('Then de la promesa') 
} )

});
```
---

#The D.O.M

##Document Object Model

The lawyer is the advocate, someone who speaks on behalf of another person. 

Likewise, this does happen in JS.

If we go to the console and type in Window.

We have an object.

This object is to JS the advocate.

It gives us information, details API’s on this particular window. 

This is object is a way of interacting and communicating with this window object 

Overall tree structure and nodes

It’s a document represented by objects and it’s modeled upon how you develop your html file. 

I can use document.querySelectorAll to select different types of selectors as I would with CSS. 

e.g. 

```jsx
document.querySelectorAll(  ‘p[data-content="123"] , body > h1.pClass > span‘);
```

I’d be accessing the p tag with attribute data-content=”123” and the h1 with class pClass within the body, and the span tag within the h1.

I can console log an element, by id using console.log but then I can also output it into the console via console.dir() to see the object that represents that element.

## **innerText and innerHTML**

Change the text of an element in the DOM accessing its innerText using document.getElementById(’hello’).innerText = ‘New String’

The difference is that I can add tag elements using innerHTML, e.g.

I can say

document.querySelectorAll(’hello’).innerHTML = ‘<span>Hi</span>’

Also, in the object, i can see the html inside innerHTML whereas in innerText it won’t show. 

the document object also shows us there is an outerHTML and an outerText

When selecting querySelectorAll for example, it returns an array, so we need to access the index number to enter.

 Meaning: 

```html
<h1>
            Javascript Essentials
            <span>
                asd
            </span>
</h1>
```

```jsx
var spanH1 = document.querySelectorAll('h1 span');

spanH1[0].innerHTML = "new text here!!!"
```

##Event listeners

We can have an inline event like

```html
<select name="cars" id="" onclick="console.log('you clicked me')">
            <option value="Volvo">Volvo</option>
            <option value="Saab">Saab</option>
            <option value="Ford">Ford</option>
            <option value="Chevrolet">Chevrolet</option>
        </select>
```

OR

```jsx
var select = document.getElementsByName('cars')[0];
select.onclick = function(event){
    console.log(event)
};
```

on a script. 

We can only have ONE inline event. 

If we needed to have multiple events, we could have an addEventListener like so:

```jsx
select.addEventListener('click', function(event) {
    console.log('You have clicked on me!')
})

select.addEventListener('click', function(event) {
    console.log('You have clicked on me 2!')
})
```

See, we have two different event listeners. BUT the cb function is anonymous

I could define a function to use later on in the callback. Like, if I needed to remove it with a .removeEventListener e.g.