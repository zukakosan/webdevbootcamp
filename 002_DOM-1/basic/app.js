const btn = document.getElementById("myButton");

function handleClick() {
    alert("Button was clicked!");
    console.log("Button clicked");
}

function handleMouseOver() {
    btn.style.backgroundColor = "lightblue";
    console.log("Mouse is over the button");
}

btn.addEventListener("click", handleClick);
btn.addEventListener("mouseover", handleMouseOver, {once: true});