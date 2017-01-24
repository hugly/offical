/**
 * Created by hulgy on 22/01/2017.
 */
$(function(){
    var oBody = $('body'),
        oNaver = $('.pro-naver');


    oBody.on('click','.intro-left li',function(){
        var index = $(this).index();
        $('.intro-left li').removeClass('active');
        $(this).addClass('active');

        $('.intro-right li').hide();
        $('.intro-right li').eq(index).show();

        $('.intro').hide();
        $('.intro').eq(index).show();

        $('.fun-box').hide();
        $('.fun-box').eq(index).show();

        $('.price-box').hide();
        $('.price-box').eq(index).show();
    });

    oNaver.on('click','ul li',function(){
        var index = $(this).index(),
            oItem = $('.pro-item'),
            scrollTop = oItem.eq(index).position().top-150;

        oNaver.find('ul li').removeClass('active');
        $(this).addClass('active');

        $('body').animate({scrollTop:scrollTop})
    });

    $(window).scroll(function () {
        var scrollTop = $('body').scrollTop(),
            height = 440;
        if(scrollTop > height){
            oNaver.css({
                position:'fixed',
                left:0,
                top:'81px',
                'z-index':99
            });
        }else{
            oNaver.css({
                position:'relative',
                left:0,
                top:0,
                'z-index':99
            });
        }
    });

});