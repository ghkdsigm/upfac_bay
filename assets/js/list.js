 // [dev] 리스트 아이템 북마크 표시 클릭 이벤트
$('.product_area .cont .info_favorites, .takebt .info_favorites, .info .info_favorites').on('click', function(){
    $(this).toggleClass('on')
})


/*******************************************************************************
 * 상품 썸네일 리스트 팝업 시작 js
 ******************************************************************************/
function wrapWindowByMask() {

//화면의 높이와 너비를 구한다.
var maskHeight = $(document).height();
var maskWidth = $(window).width();

//마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
$('#mask').css({
    'width': '100%',
    'height': '100%'
});

//애니메이션 효과   
$('#mask').fadeTo("slow", 0.5);
}

function popupOpen() {
    $('.layerpop').css("position", "absolute");
    $('body').css("overflow", "hidden");
    //영역 가운에데 레이어를 뛰우기 위해 위치 계산 
    //리사이즈시 작동 펑션
    window.addEventListener('resize', function () {
        $('.layerpop').css("top", (($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
        $('.layerpop').css("left", (($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
    });
        $('.layerpop').css("top", (($(window).height() - $('.layerpop').outerHeight()) / 2) + $(window).scrollTop());
        $('.layerpop').css("left", (($(window).width() - $('.layerpop').outerWidth()) / 2) + $(window).scrollLeft());
        //$('.layerpop').draggable();
        $('#layerbox').show();
}

$('#layerbox_close').on('click', function() {
    popupClose()
})

function popupClose(obj) {
    $(obj).parents('.pop_up').hide()

    // $('#layerbox').hide();
    if($('#mask')){
        $('#mask').hide(); 
    }        
    $('body').css("overflow", "unset");
}

function goDetail() {

    /*팝업 오픈전 별도의 작업이 있을경우 구현*/

    popupOpen(); //레이어 팝업창 오픈 
    wrapWindowByMask(); //화면 마스크 효과           
} 
/****썸네일 클릭시 리스트 팝업****/

/*썸네일 Each 클릭 펑션*/
$('#product_pop > .item > a').on('click', function(e) {
    goDetail()                       
})

$('#upload_bt').on('click', function(e) {
    goDetail()                       
})


// 외부영역 클릭 시 팝업 닫기
// $(document).mouseup(function (e){	
//     var LayerPopup = $(".pop_up");
//     if(LayerPopup.has(e.target).length === 0){
//         $('.pop_up').hide();
//         $('#mask').hide();
//         $('body').css("overflow", "unset");
//     }
// });
/*******************************************************************************
 * 상품 썸네일 리스트 팝업 끝 js
 ******************************************************************************/

