[![npm version](https://badge.fury.io/js/simple-scroll-animate.svg)](https://badge.fury.io/js/simple-scroll-animate)

# Simple Scroll Animate

A lightweight library that allows you to add animation classes to elements as they appear in the viewport. Make a fancy animation play as you scroll to it.

Under the hood, it simply utilises the Intersection Observer API and applies your CSS classes as you scroll into view.

## 🚀 Getting started

```bash
npm install simple-scroll-animate --save
```

1. Install by running `npm install simple-scroll-animate --save`
2. Supply the a list of HTML elements you are wanting to track in the viewport and animate. 
    ```js
    const scrollAnimator = new ScrollAnimator();
    scrollAnimator.create(document.querySelectorAll(".animate"));
    ```
3. With each HTML element you want to apply an animation to, add `data-animate-class='your-css-class-name'`. This is CSS class you want applied when the element comes into view. [See the full list of options here.](#configuration)
    ```html
    <div class="animate" data-animate-class="animate-fade-in">
        Fancy fade in animation!
    </div>
    ```
    ```css
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .animate-fade-in 
    {
        animation: fadeIn .5s linear both;
    }
    ```


## Configuration
There are a few options you can apply to your elements. 

| Config      | Description | Default  | Required  |
| ----------- | ----------- |--------- | --------- |
| data-animate-class="your-css-classname" | The CSS classname you want applied to your element when it comes into view | no-animation | Yes |
| data-animate-once="true" | Play the animation once, emit to always re-play the animation when in view  | false | optional |
| data-animate-threshold="0.5 | A value of 1.0 means that the your CSS animation will not play until every pixel of the element is visible in the viewport. The default, 0.5, will play your animation if the visibility passes 50%. | 0.5 |  optional |

## Examples
For a full list of examples, [go to the examples](/Examples). 

## 📝License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
