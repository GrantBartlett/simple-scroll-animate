import { ScrollAnimator } from "simple-scroll-animate";

const scrollAnimator = new ScrollAnimator();
scrollAnimator.create(document.querySelectorAll(".js-animate"));

const terminate = document.querySelector(".js-dispose-all");
terminate?.addEventListener("click", function ()
{
    scrollAnimator.dispose();
}, false);