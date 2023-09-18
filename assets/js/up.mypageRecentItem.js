let UpMypageRecentItem = (function($) {
    let _init;
    let _el;
    let _data;
    let _util;
    let _manipulateDom;
    let _eventHandle;
    let _fetch;

    //  private 내부 변수
    _data = {

    };

    // 엘레멘트 요소
    _el = {
        productPop : () => $('#product_pop'),
    };

    // UTIL형 함수
    _util = {

    };

    // 돔 조작이벤트
    _manipulateDom = {
        setRecentItemForm: (data) => {
            console.log(data)

            if (data.length == 0) {
                const html = `
                    <li class="data_none">
                        <img src="/resources/assets/images/common/ico_item_none.svg" alt="느낌표 아이콘" />
                        <p>내가 본 상품이 없습니다.</p>
                    </li>
                `
                _el.productPop().html(html);
            }
        }

    };

    // 이벤트 핸들러
    _eventHandle = {
        init: () => {
            _fetch.getRecentItemList();

        }
    }

    _fetch = {
        getRecentItemList: () => {
            $.ajax({
                url: '/mypage/buyer/recent/list',
                type: "GET",
                data: {},
                dataType: "JSON",
                async: false,
                cache: false,
                success: function (data) {
                    _manipulateDom.setRecentItemForm(data);
                },
                error: function (request, status, error) {
                    alert(JSON.parse(request.responseText).message);
                }
            })
        },
    }

    _init = async (args = {}) => {
        _eventHandle.init();
    }

    // 클로저
    return {
        init : _init
    }
}(jQuery));