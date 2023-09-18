let UpCategory = (function ($) {
    let _init;
    let _el;
    let _data;
    let _args;
    let _util;
    let _manipulateDom;
    let _eventHandle;
    let _fetch;

    //외부 값
    _args = {};

    //  private 내부 변수
    _data = {
        searchData: {"keyword": "", "category": "", "ext": "", "global": "0", "sort": "1", "pageno": "1", "limit": "8"},
    };

    // 엘레멘트 요소
    _el = {
        divHeaderNavList: () => $('#header_nav_list'),
        divHeaderNav: () => $('#header_nav'),
    }

    // UTIL형 함수
    _util = {
        getItemList: (categoryServerSeq, type) => {
            document.location.href = `/sell/list?type=${type}&category=${categoryServerSeq}`
        }
    };

    // 돔 조작이벤트
    _manipulateDom = {
        getCategory: () => {
            $.getJSON('/resources/assets/json/category.json', function (data) {
                let html = [];
                let category1Depth = 2;
                let category2Depth = 1;

                html.push('<li class="item item01"><a href="javascript:;">UPFAC추천상품</a></li>');
                $.each(data, function (key, item) {
                    html.push(`<li class="item item0${category1Depth}">
                                     <a href="javascript:;" data-seq="${item.seq}" data-type="${item.type}">${item.type}</a>
                                     <div class="header_nav_list_depth header_nav_depth_${item.type.toLowerCase()}">
                                         <ul class="header_container">`);

                    $.each(item.list, function (key, value) {
                        if (category2Depth % 5 === 1) {
                            html.push(`        <li>
                                                    <ul>`);
                        }
                        html.push(`                     <li data-seq="${value}" data-type="${item.type}"><a href="javascript:;">`);
                        if (category2Depth < 10) {
                            html.push(`                     <div class="is_img"><img src="/resources/assets/images/common/ico_nav0${category2Depth}.svg" alt="${key}"/>`);
                        } else {
                            html.push(`                     <div class="is_img"><img src="/resources/assets/images/common/ico_nav${category2Depth}.svg" alt="${key}"/>`);
                        }
                        html.push(`                     </div>
                                                    ${key}</a>\</li>`);
                        if (category2Depth === Object.keys(item.list).length || category2Depth % 5 === 0) {
                            html.push(`             </ul>
                                               </li>`);
                        }
                        category2Depth++;
                    });

                    html.push(`                <li class="is_advertisement">
                                                    <img src="/resources/assets/images/test/header_advertisement.png" alt="">
                                               </li>
                                         </ul>
                                     </div>
                                </li>`);
                    category1Depth++;
                    category2Depth = 1;
                });

                _el.divHeaderNavList().html(html.join(""));

            });
        },

    }

    // 이벤트 핸들러
    _eventHandle = {
        init: () => {
            _el.divHeaderNav().on("click", ".item > a", function () {
                _util.getItemList($(this).data("seq"), $(this).data("type"));
            });

            _el.divHeaderNav().on("click", ".item > .header_nav_list_depth > .header_container > li > ul > li", function () {
                _util.getItemList($(this).data("seq"), $(this).data("type"));
            });

        }
    }

    // api
    _fetch = {
        getCategoryJson: () => {
            const url = "/resources/assets/json/category.json";

            return new Promise(function (resolve, reject) {

                $.ajax({
                    url: url,
                    type: "GET",
                    async: false,
                    dataType: "json"
                })
                    .done(function (data) {
                        resolve(data);
                    })
                    .fail(function () {
                        console.log()
                        reject();
                    });
            });
        },
    }

    _init = async (args = {}) => {
        _manipulateDom.getCategory();
        _eventHandle.init();
    }

    // 클로저
    return {
        init: _init,
        fetch: _fetch
    }
})(jQuery);