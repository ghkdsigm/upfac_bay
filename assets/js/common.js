
$('.header_nav_list .item').on('mouseover', function(){
    var $this = $(this);
    $this.children('.header_nav_list_depth').addClass('on').removeClass('off');
    $this.siblings('.item').children('.header_nav_list_depth').removeClass('on').addClass('off');
});

var itemCount = $('.header_nav_list .item').length;

for (var i = 1; i <= itemCount; i++) {
    for (var j = i + 1; j <= itemCount; j++) {
        var selector = '.header_nav_list .item.item0' + i + ' .item.item0' + j;
        
        $(selector).on('mouseover', function(){
            $(this).children('.header_nav_list_depth').addClass('on').removeClass('off');
            $(this).siblings(selector).children('.header_nav_list_depth').removeClass('on').addClass('off');
        });
    }
}
$('.header_nav_list .item').on('mouseleave', function(){
    $('.header_nav_list').removeClass('on');
    $('.header_nav_list_depth').removeClass('on');
});





$('.header .header_top_nav_cart_list .item .btn_delete').on('click', function(){
    $(this).parents('.item').remove()
});
//탭
$('.tab_type01 a').click(function () {
    var idx = $(this).parent().index();
    $('.tab_type01 li').removeClass('on');
    $(this).parent().addClass('on');
    $('.tab_box').addClass('hide').eq(idx).removeClass('hide');
})

//탭 스타일 없음
$('.tab_none_style li').click(function () {
    var idx = $(this).index();
    $('.tab_none_style li').removeClass('on');
    $('.tab_none_style li').eq(idx).addClass('on');
})      

// 아코디언 공통
$(".accordion .accordion_title").on("click", function(){
    $(this).siblings().stop().slideToggle()
    $(this).parents('.accordion_list').toggleClass('on');
    $(this).parents('.accordion_list').siblings().removeClass('on');
    $(this).parents('.accordion_list').siblings().children(".accordion_toggle").stop().slideUp();
    $(this).parents().parents().siblings().children().children(".accordion_toggle").stop().slideUp();
});
// 아코디언 공통 (형제 아코디언 안닫히는 버전)
$(".accordion_all .accordion_title").on("click", function(){
    $(this).siblings().stop().slideToggle()
    $(this).parents('.accordion_list').toggleClass('on');
});

// 셀렉스 커스텀 공통
$(".select_box .select_title").on('click', function(){
    $(this).parents('.select_box').toggleClass('on')
});
 // [dev] 리스트 아이템 북마크 표시 클릭 이벤트
 $('.product_area .cont .info_favorites').on('click', function(){
    $(this).toggleClass('on')
})