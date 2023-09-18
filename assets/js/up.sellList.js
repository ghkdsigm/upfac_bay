let UpSellList = (function ($) {
    let _init;
    let _el;
    let _data;
    let _args;
    let _util;
    let _manipulateDom;
    let _eventHandle;
    let _fetch;

    //외부 값
    _args = {
        categoryKey: '3D',
        categorySeq: '',
    };

    //  private 내부 변수
    _data = {
        catagoryJson: [],
        searchData: {"keyword": "", "category": "", "ext": "", "global": "1", "sort": "1", "pageno": "1", "limit": "8"},
        searchCategory: {},
    };

    // 엘레멘트 요소
    _el = {
        divItemCategoryBar: () => $('#divItemCategoryBar'),
        divItemSearchTitle: () => $('#divItemSearchTitle'),
        divItemSearchGlobal: () => $('#divItemSearchGlobal'),
        divItemSearchSorting: () => $('#divItemSearchSorting'),
        ulItemSearchCategoryButton: () => $('#ulItemSearchCategoryButton'),
        ulItemList: () => $('#ulItemList'),
        divItemMore: () => $('#divItemMore'),
    };

    // UTIL형 함수
    _util = {};

    // 돔 조작이벤트
    _manipulateDom = {
        itemCategoryBar: () => {

            _fetch.getCategoryJson().then(function (data) {
                const category = _args.categoryKey;
                const list = data[category].list;

                _el.divItemSearchTitle().find("h2").text(category);

                _el.divItemCategoryBar().html(`
					<div class="accordion_list">
                        <div class="accordion_title">
                            <img src="/resources/assets/images/products/ico_${category.toLowerCase()}.svg" alt="${category} 아이콘" />
                            <p>${category}</p>
                            <img src="/resources/assets/images/common/ico_arw_12x6.svg" alt="화살표 아이콘" class="img_arw" />
                        </div>
                        <ul class="accordion_toggle">
							<li class="list_all">
								<input type="checkbox" id="chkCategoryAll" value=""/>
								<label for="chkCategoryAll">${category} 전체</label>
							</li>
							${Object.keys(list).map(function (key) {
                    return `<li>
								<input type="checkbox" id="chkCategory_${list[key]}" ${_data.searchData.category == list[key] ? "checked" : ""} value="${list[key]}"/>
								<label for="chkCategory_${list[key]}">${key}</label>
							</li>`
                }).join('\n')}
							</ul>
                    </div>`);
            });
        },
        itemList: (pageno) => {
            _data.searchData.pageno = pageno;
            if (pageno == 1) {
                _el.ulItemList().empty();
            }

            _fetch.getItemList().then(function (data) {

                if (data.length >= _data.searchData.limit) {
                    _el.divItemMore().show().children("a").data("no", ++pageno);
                } else {
                    _el.divItemMore().hide();
                }

                _el.ulItemList().append(`
					${data.map(function (item) {
                    return `<li class="item">
									<a href="javascript:;">
										<div class="is_img">
											<img src="" alt="">
										</div>
									</a>
									<div class="is_text">
										<div class="is_text_top">
											<div class="user">
												<a href="javascript:;">
													<!-- [dev] 유저 프로필 이미지 없을경우 img 태그 제거 -->
													<div class="user_img">
														<img src="/resources/assets/images/test/user_img.svg" alt="프로필 사진" />
													</div>
													<!-- [dev] 유저 이름 -->
													<h3 class="user_name">${item.nickName}</h3>
												</a>
												<div class="user_detail">
													<div class="user_detail_img">
														<img src="/resources/assets/images/products/user_detail.jpg" alt="프로필 사진" />
													</div>
													<div class="user_detail_name">
														<h4>${item.nickName}</h4>
														<button type="button" class="btn_follow">Follow</button>
													</div>
												</div>
											</div>
											<div class="info">
												<span class="info_view">${item.largeViewCount}</span>
												<!-- [dev] 즐겨찾기 돼 있을경우 on 추가 -->
												<button type="button" class="info_favorites on">${item.largeFavicon}</button>
											</div>
										</div>
										<div class="price">
											<p>${item.global ? item.moneyUSSellPrice : item.moneySellPrice}<small>${item.global ? '$' : '원'}</small></p>
											<button type="button"><img src="/resources/assets/images/common/ico_cart_add.svg" alt="장바구니" /></button>
										</div>
									</div>
								</li>`
                }).join('\n')}`);
            });
        }
    }

    // 이벤트 핸들러
    _eventHandle = {
        init: () => {
            _el.divItemCategoryBar().on("click", "#chkCategoryAll", function () {
                _el.divItemCategoryBar().find("input:checkbox").prop("checked", $(this).is(":checked"));
            });

            if (_data.searchData.category < 0) {
                _el.divItemCategoryBar().find("#chkCategoryAll").trigger("click")
            }

            _el.divItemCategoryBar().on("click", "input:checkbox", function () {

                _data.searchCategory = {}
                const categorys = [];

                $.each(_el.divItemCategoryBar().find("input:checkbox"), function (index, item) {
                    // 전체
                    if (index == 0 && $(this).is(":checked")) {
                        return false;
                    }

                    if ($(this).is(":checked")) {
                        _data.searchCategory[$(item).val()] = $(item).next().text();
                    }
                });

                if (JSON.stringify(_data.searchCategory) === "{}") {
                    _el.ulItemSearchCategoryButton().html("<li><p>전체</p></li>");
                } else {
                    _el.ulItemSearchCategoryButton().html(
                        `${Object.keys(_data.searchCategory).map(function (key) {
                            categorys.push(key)

                            return `<li>
                            <p>${_data.searchCategory[key]}</p>
                            <button type="button" class="btn_close" data-idx="${key}"><img src="/resources/assets/images/products/ico_close.svg" alt="삭제 버튼"></button>
                        </li>`
                        }).join('\n')}`
                    );
                }

                _data.searchData.category = `${categorys.join(',')}`;
                _manipulateDom.itemList(1);
            });

            _el.ulItemSearchCategoryButton().on("click", "button", function () {
                const idx = $(this).data("idx");
                _el.divItemCategoryBar().find("input:checkbox").eq(idx).trigger("click");
            })

            // 아코디언
            _el.divItemCategoryBar().on("click", ".accordion_title", function () {
                $(this).siblings().stop().slideToggle()
                $(this).parents('.accordion_list').toggleClass('on');
            });

            _el.divItemSearchTitle().on("click", ".tab_none_style  > li", function () {
                _data.searchData.ext = $(this).children("button").val();
                _manipulateDom.itemList(1);
            });

            _el.divItemSearchGlobal().on("click", ".select_list  > li", function () {
                _data.searchData.global = $(this).children("button").val();
                _manipulateDom.itemList(1);

                _el.divItemSearchGlobal().toggleClass('on');
                _el.divItemSearchGlobal().find(".select_title > p").text($(this).children("button").text());
            });

            _el.divItemSearchSorting().on("click", ".select_list  > li", function () {
                _data.searchData.sort = $(this).children("button").val();
                _manipulateDom.itemList(1);

                _el.divItemSearchSorting().toggleClass('on');
                _el.divItemSearchSorting().find(".select_title > p").text($(this).children("button").text());
            });

            _el.divItemMore().on("click", "a", function () {
                const no = $(this).data("no");
                _manipulateDom.itemList(no);
            });


        }
    }

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
                        reject();
                    });
            });
        },
        getItemList: () => {
            const url = "/sell/list";

            return new Promise(function (resolve, reject) {

                $.ajax({
                    url: url,
                    type: "POST",
                    async: false,
                    data: _data.searchData,
                    dataType: "json"
                })
                    .done(function (data) {
                        resolve(data);
                    })
                    .fail(function () {
                        reject();
                    });
            });
        },

    }

    _init = async (args = {}) => {
        _data.searchData.category = args.categorySeq;
        _args.categoryKey = args.type;
        _manipulateDom.itemList(1);
        _manipulateDom.itemCategoryBar();
        await _fetch.getCategoryJson();
        _eventHandle.init();
    }

    // 클로저
    return {
        init: _init
    }
}(jQuery));