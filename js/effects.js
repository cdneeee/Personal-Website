$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
    });
    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "smooth");
    });
    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });
    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });
    // typing text animation script
    var typed = new Typed(".typing", {
        strings: ["Engineering @ Western University"],
        typeSpeed: 50,
        loop: false
    });
    const scram = new TextScramble('.scramble', {
        phrases: ['AI enthusiast', 'Student', 'Mechatronics engineer', 'Robots admirer', 'Tech enthusiast', 'Music lover', 'Gamer'],
        interval: 50,
        animationTimeout: 1500,
        loop: true,
      });
})