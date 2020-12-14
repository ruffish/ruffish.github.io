// Selectors
const menuOptions = document.getElementsByClassName("menuBtn")
const MainSection = document.getElementById("main")

menuOptions[2].addEventListener("click", galleryMenu)

let galCheck = 0;

function galleryMenu() {
    for (let i = 0; i < menuOptions.length; i++) {
        menuOptions[i].setAttribute("class", "menuBtn");
    }
    document.querySelector(".menu").setAttribute("class", "menu");
    document.querySelector(".about").setAttribute("class", "about");
    menuOptions[2].setAttribute("class", "menuBtn ActiveMenu")
    clearInterval(runGallery)
    let Gallery = document.createElement("div")
    Gallery.setAttribute("id", "nanogallery2")
    MainSection.appendChild(Gallery)
    galCheck = 1;
    runGallery()
    setTimeout(() => {
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    }, 300);
}

function MenuButton(e) {
    for (let i = 0; i < menuOptions.length; i++) {
        menuOptions[i].setAttribute("class", "menuBtn");
    }
    if (galCheck == 1) {
        document.getElementById("nanogallery2").remove()
        galCheck = 0;
    };

    e.setAttribute("class", "menuBtn ActiveMenu")
    if (e.getAttribute("id") == 1) {
        document.querySelector(".about").setAttribute("class", "about");

        document.querySelector(".menu").setAttribute("class", "menu disp");
        setTimeout(() => {
            window.scrollTo({
                top: 850,
                behavior: 'smooth'
            });
        }, 300);
    }
    if (e.getAttribute("id") == 0) {
        document.querySelector(".menu").setAttribute("class", "menu");

        document.querySelector(".about").setAttribute("class", "about disp");
    }
}


function runGallery() {
    jQuery("#nanogallery2").nanogallery2({
        // ### gallery settings ### 
        thumbnailHeight: 350,
        thumbnailWidth: 500,
        itemsBaseURL: 'https://nanogallery2.nanostudio.org/samples/',

        // ### gallery content ### 
        items: [{
                src: "https://i.ibb.co/8mcfJNn/burgerandfries.jpg",
                srct: 'https://i.ibb.co/8mcfJNn/burgerandfries.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/4V1wzPY/icecreamnwaffle.jpg',
                srct: 'https://i.ibb.co/4V1wzPY/icecreamnwaffle.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/yFkFHqW/Full-English-Breakfast.jpg',
                srct: 'https://i.ibb.co/yFkFHqW/Full-English-Breakfast.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/8477zfw/sundaes.jpg',
                srct: 'https://i.ibb.co/8477zfw/sundaes.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/VMqpcYf/hotdognfries.jpg',
                srct: 'https://i.ibb.co/VMqpcYf/hotdognfries.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/HG7pxT9/pancakesniceream.jpg',
                srct: 'https://i.ibb.co/HG7pxT9/pancakesniceream.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/3BrKMPM/buttonwaffleicecream.jpg',
                srct: 'https://i.ibb.co/3BrKMPM/buttonwaffleicecream.jpg',
                title: ''
            },
            {
                src: 'https://i.ibb.co/j5gLJnp/brownieniceream.jpg',
                srct: 'https://i.ibb.co/j5gLJnp/brownieniceream.jpg',
                title: ''
            }
        ]
    });
};