const sliderContent = [
    "PAULO (AYTA SINGKO)",
    "BAIRON (PINAKAYWA)",
    "TIDOY KYUTIE",
    "JESSIE (CRUSH AIZA)",
    "MAWE (NAAY GAMAY)",
    "RODEL (OUTFIT CHECK)",
    "JAJA (EDUC TIRADA)",
    "EJ (UTRO SADNI)",
    "SIGBIN (SIGBINAYUT)",
    "DANIEL (VIRAL)",
    "REKERME (50/50)",
    "SIR"
];

let currentImageIndex = 2;
let currentContentIndex = 1;
const totalImages = sliderContent.length;
let isAnimating = false;

function splitTextIntoSpans(selector) {
    let elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
        let text = element.innerText;
        let splitText = text
            .split("")
            .map(function (char) {
                return `<span>${char === "" ? "&nbsp;" : char}</span>`;
            })
            .join("");
        element.innerHTML = splitText;
    });
}

gsap.to(".slide-next-img", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1.5,
    ease: "power3.out",
    delay: 1,
});

function populateSliderContent() {
    const activeContent = document.querySelector(".slider-content-active h1");
    const nextContent = document.querySelector(".slider-content-next h1");

    activeContent.textContent = sliderContent[currentContentIndex];
    nextContent.textContent = sliderContent[(currentContentIndex + 1) % totalImages];

    let fontSize;
    if (window.innerWidth >= 1024) {
        fontSize = "clamp(7rem, 7vw, 10rem)"; // 7rem font size for desktop
    } else if (window.innerWidth >= 768) {
        fontSize = "clamp(4rem, 4vw, 7rem)"; // 4rem font size for tablet or laptop
    } else {
        fontSize = "clamp(2rem, 2vw, 4rem)"; // 2rem font size for phones
    }

    activeContent.style.fontSize = fontSize;
    nextContent.style.fontSize = fontSize;
}


document.addEventListener("click", function(){
    if (isAnimating) return;

    isAnimating = true;
    populateSliderContent();
    splitTextIntoSpans(".slider-content-active h1");

    let blurAmount;
    if (window.innerWidth >= 1024) {
        blurAmount = 10; // 10px blur for desktop
    } else if (window.innerWidth >= 768) {
        blurAmount = 6; // 6px blur for tablet or laptop
    } else {
        blurAmount = 3; // 3px blur for phones
    }

    gsap.to(".slide-next-img img", {
        filter: `blur(${blurAmount}px) brightness(70%)`, // Apply blur and darken the image
        duration: 0.5,
        
    });

    gsap.to(".slide-active img:first-child", {
        scale: 2,
        duration: 2,
        ease: "power3.out",
    });
    gsap.to(".slider-content-active h1 span", {
        top: "-275px",
        stagger: 0.02,
        ease: "expo.inOut",
        duration: 1,
    });

    splitTextIntoSpans(".slider-content-next h1");

    gsap.set(".slider-content-next h1 span", {top: "200px"});

    gsap.to(".slider-content-next", {
        top: 0,
        duration: 1.125,
        ease: "power3.out",
        onComplete: () =>{
            document.querySelector(".slider-content-active").remove();
            gsap.to(".slider-content-next h1 span", {
                top: 0,
                stagger: 0.05,
                ease: "power3.out",
                duration: 1,
            });
            const nextContent = document.querySelector(".slider-content-next");
            nextContent.classList.remove("slider-content-next");
            nextContent.classList.add("slider-content-active");
            nextContent.style.top = "0";

            currentContentIndex = (currentContentIndex + 1) % totalImages;
            const nextContentText = sliderContent[currentContentIndex];
            const newContentHTML = `
            <div class="slider-content-next" style="top: 200px;">
                <h1>${nextContentText}</h1>
            </div>`;
            document.querySelector(".slider-content").insertAdjacentHTML("beforeend", newContentHTML);
        },
    });

    currentImageIndex = (currentImageIndex % totalImages) + 1;

    const newSlideHTML = `
    <div class="slide-next">
        <div class ="slide-next-img">
            <img src = "images/${currentImageIndex}.jpg" alt="" />
        </div>
    </div>`;
    document
    .querySelector(".slider")
    .insertAdjacentHTML("beforeend", newSlideHTML);

    gsap.to(".slider .slide-next:last-child .slide-next-img", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
    });

    const slideNextImg = document.querySelector(".slide-next-img");
    gsap.to(slideNextImg, {
        width: "100vw",
        height: "100vh",
        duration: 2,
        ease: "power3.out",
        onStart: () => {
            gsap.set(slideNextImg.querySelector("img"), {
                filter: "none" // Reset filter
            });
        },
        onComplete: () => {
            const currentActiveSlide = document.querySelector(".slide-active");
            if (currentActiveSlide) {
                currentActiveSlide.parentNode.removeChild(currentActiveSlide);
            }
            const nextSlide = document.querySelector(".slide-next");
            if (nextSlide) {
                nextSlide.classList.remove("slide-next");
                nextSlide.classList.add("slide-active");
                const nextSlideImg = nextSlide.querySelector(".slide-next-img");
                if (nextSlide) {
                    nextSlideImg.classList.remove("slide-next-img");
                }
            }
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        },
    });  
});
