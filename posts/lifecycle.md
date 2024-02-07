---
title: "React Lifecycles"
subtitle: "The three phases of React component lifecycles"
date: "04/03/2023"
type: "budding"
---

# React state and lifecycle

Components in React undergo three different phases in its lifecycle:

-Mounting

-Updating

-Un-mounting

Each phase has specific methods responsible for a particular stage in a component’s lifecycle. These methods are particular to class based components and not intended for functional components.

But now, since Hooks are available to us, we can now ‘hook’ into lifecycle stages when working with functional components. 

## React component phases:

-Mounting phase: This is the initial render of a component, inserting it into the DOM. Here, the life of a component begins. 

-Updating phase: Here, the component updates or re-renders. This happens when the props or the state are updated. This can happen multiple times, and is what gives React its name, in a way. 

-Unmounting phase: The component is now removed from the DOM. 

In a class based component, you can call different methods for each stage of the cycle. You can apply similar concepts in functional components using React hooks. 

![React lifecycle](/posts/lifecycle.png)

## React lifecycle methods

In the mounting phase, four different methods are called:

-constructor

-static getDerivedStateFromProps,

-render

-componentDidMount

### The constructor method:

This is the first method called during the mounting phase. It is used to initialise the state of the component and binding event-handler methods within the component. The constructor is not always necessary if the component doesn’t need to be stateful or bind any method.

The constructor is called when the component is initialised, but before it is rendered. It is called with props as an argument. It is important to call the super (props) function with the props passed onto it within the constructor before any other steps are taken.

This will then initiate the `constructor`of `React.Component` (the parent of this class-based component) and it inherits the `constructor`
 method and other methods of a typical React component.

Here you can see an example of a counter:

```jsx

import React from 'react';

class Counter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};

		this.setCount = this.setCount.bind(this);
	}

	setCount() {
		this.setState({count: this.state.count + 1});
	}

	render() {
		return (
			<div>
				<h1>Counter</h1>
				<button onClick={this.setCount}>Click to add</button>
				<p>Count: {this.state.count}</p>
			</div>)
	}
}

```

### The static getDerivedStateFromProps method:

Our component’s STATE will be derived from its props. Here’s where getDerivedStateFromProps comes in. This method allows you to modify the state value with any props value. 

It is useful for changes in props over time and later on in the update phase. 

getDerivedStateFromProps accepts two arguments: props and state and returns an object or null if no change is needed. The method is called after the constructor and before the rendering stage, being the most rarely used method, but still useful if needed. 

```jsx
class UserPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			...
			fullname: ""
		};
	}

	static getDerivedStateFromProps(props, state) {
		return {
			...
			fullname: `${props.firstname} ${props.lastname}`}
	}

	render() {
		// ...
	}
}

```

It is a default for state generated with props.

### The render method:

This method is the only required method for a class-based React component. It inserts the HTML into the DOM.

Returns the JSX that will eventually be rendered but can also return other values. 

```jsx
class SubmitButton extends React.Component {
	render() {
		return (
			<button
				type="submit"style={this.props.styles}>
				{this.props.child}
			</button>);
	}
}
```

### The componentDidMount method:

This is the last lifecycle method of the mounting stage.

During this phase, you are allowed to add side effects like sending network requests or updating the component’s state. Additionally, this method allows you to make subscriptions like subscribing to the Redux store. You can also call the this.setState method, although this will cause a re-render to occur. 

example:

```jsx
class NASACounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 10
    };
  }

  componentDidMount() {
    const myTimer = setInterval(() => {
      this.state.count > 0
        ? this.setState({ count: this.state.count - 1 })
        : clearInterval(myTimer);
    }, 1000);
  }

  render() {
    return (
      <div style={this.props}>
        <h1>
          NASA Countdown: <br /> {this.state.count || "🪐"} <br />
          {"⭐".repeat(this.state.count) || "🚀"}
        </h1>
        {this.state.count === 0 && <h2>LIFT OFF!!!</h2>}
      </div>);
  }
}
```

A common use case is waiting until a component renders to start an animation, or fetching data from an external source.

One common thing to do is to make a call to an API, if the component needs data. The componentDidMount method actually is code that will run immediately after the component is rendered. 

It is actually similar to a useEffect.

## The updating phase:

This phase is triggered when state or props change and consists of the following methods:

`static getDerivedFromProps`
, `shouldComponentUpdate`
, `render`
, `getSnapshotBeforeUpdate`
, and `componentDidUpdate`

getDerivedFromProps and render are also part of the mounting phase so we’ll look at the 3 others:

****`static getDerivedStateFromProps` is useful if you have updated your props and you want to reflect that in the component’s state.**

**shouldComponentUpdate** is another rarely used method, intended for optimization, useful when you need to tell React not to re-render a component. It is ignored when forceUpdate is invoked. This method returns a boolean value, true being the default value. 

**getSnapshotBeforeUpdate** gives you access to the previous props and state of the component before it is updated. This allows you to work or check on the previous values of state or props. It’s also rarely used. 

The ************************componentDidUpdate************************ method:

This is the last method in the update phase. It allows you to create side effects like sending network requests or calling the `this.setState`method. It’s important to remember that there should always be a way to avoid the `setState`
 (like some sort of logic), or it will result in an infinite loop of re-rendering.

This method can accept up to three parameters: `prevProps`, `prevState`, and `snapshot` (if you implement the `getSnapshotBeforeUpdate` method).

Here's an example of using `componentDidUpdate` method for implementing autosave functionality:

```jsx
class WritePost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postContent: ""
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInput(e) {
		this.setState({postContent: this.state.postContent + e.target.value})
	}

	handleSubmit() {
		// ...
	}

	autosave() {
		// send network request to save post...
	}

	componentDidUpdate() {
		this.autosave()
	}

	render() {
		return(
			<form onSubmit={this.handleSubmit}>
				<input type={text} value={this.state.postContent} onChange={e => handleInput(e)} />
				<button type="submit">Post</button>
			</form>)
	}
}

```

### **The unmounting phase**

The unmounting phase is the third and final phase of a React component. At this phase, the component is removed from the DOM. Unmounting only has one lifecycle method involved: `componentWillUnmount`.

### **The `componentWillUnmount` Method**

`[componentWillUnmount](https://reactjs.org/docs/react-component.html?ref=retool.com#componentwillunmount)` is invoked right before the component is unmounted or removed from the DOM. It’s meant for any necessary clean up of the component, like unsubscribing to any subscriptions (i.e., Redux) or canceling any network requests. Once this method is done executing, the component will be destroyed.

## **React 16.8**

From React 16.8 onwards, functional components can use Hooks. This adds access to state from functional components. It means you can use state without having to use a class based components, resulting in a much less verbose code.

A hook is a special function that allows devs to access state and other lifecycle methods without having to use class based components. 

The most common default hooks are useState and useEffect.

useState gives state to a component, and useEffect allows you to add side effects within it (after initial render), which aren’t allowed inside the function’s main body.