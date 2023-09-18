const UpItemCommon = (function($) {
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
	};

	//  private 내부 변수
	_data = {
		"editor" : null,
		"catagoryJson" : {},
		"item" : {
			"info" : {"categorykey" : "3D"},
			"f3d" : {"format" : "OBJ", "size" : "30MB", "geometry" : "Triangles 12.4K", "vertices" : "6.2", "pbr" : "", "texture" : "2"
				, "uv_mapping" : "1", "materials" : "", "uv_layers" : "", "animated" : "Big Motion", "rigged" : "", "renderer" : "Mentalray"},
			"file" : {},
			"tags" : [],
		},
	};

	// 엘레멘트 요소
	_el = {
		divItemDiscountToggle : () => $("#divItemDiscountToggle"),
		divItemDiscountInput : () => $("#divItemDiscountInput"),
		//templateItem3DUploadPop : () => $("#templateItem3DUploadPop"),
		//templateItem2DUploadPop : () => $("#templateItem2DUploadPop"),
		templateItemFileInfoPop : () => $("#templateItemFileInfoPop"),
		divItem3DUploadPop : () => $("#divItem3DUploadPop"),
		divItem2DUploadPop : () => $("#divItem2DUploadPop"),
		divItemFileInfoPop : () => $("#divItemFileInfoPop"),
		divItemFileUploadPro : () => $("#divItemFileUploadPro"),
		divItemFileUploadInfo : () => $("#divItemFileUploadInfo"),
		sltItemCategory : () => $("#sltItemCategory"),
		rdoCategoryKey : () => $("input:radio[name=rdoCategoryKey]"),
		//txtItemSubject  : () => $("#txtItemSubject "),
		txtItemPrice : () => $("#txtItemPrice"),
		txtItemUSPrice : () => $("#txtItemUSPrice"),
		txtItemDiscountPrice : () => $("#txtItemDiscountPrice"),
		txtItemUSDiscountPrice : () => $("#txtItemUSDiscountPrice"),
		divItemDiscountInfo : () => $("#divItemDiscountInfo"),
		divItemDiscountUSInfo : () => $("#divItemDiscountUSInfo"),
		txtItemTag : () => $("#txtItemTag"),
		btnItemAddTag : () => $("#btnItemAddTag"),
		ulItemTagList : () => $("#ulItemTagList"),
		divItemSubmit : () => $("#divItemSubmit"),
	};

	// UTIL형 함수
	_util = {
		// editor
		getEditor : () => {
			// Initialize QUill editor
			return new Quill('#editor-container', {
				modules: {
					toolbar: [
						[{ header: [1, 2, 3, 4, 5, 6,  false] }],
						['bold', 'italic', 'underline','strike'],
						['image', 'code-block'],
						['link'],
						[{ 'script': 'sub'}, { 'script': 'super' }],
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						['clean']
					]
				},
				placeholder: '물품 설명을 입력해주세요.',
				theme: 'snow'  // or 'bubble'
			});
		},
		// 팝업 레이어 리사이즈
		setPopResize : ($el) => {
			$el.css("top", (($(window).height() - $el.outerHeight()) / 2) + $(window).scrollTop())
				.css("left", (($(window).width() - $el.outerWidth()) / 2) + $(window).scrollLeft());
		},
	};

	// 돔 조작이벤트
	_manipulateDom = {
		// 파일 정보 팝업
		getFileInfoPop : async () => {

			_el.divItemFileInfoPop().remove();
			await $('body').append(eval(_el.templateItemFileInfoPop().html())(_data.item.f3d));

			const $pop = _el.divItemFileInfoPop();

			$('body').css("overflow", "hidden");
			$pop.css("position", "absolute");
			_util.setPopResize($pop)
			$pop.show();

			//애니메이션 효과
			$('#mask').css({
				'width': '100%',
				'height': '100%'
			}).fadeTo("slow", 0.5);

			// 기존 바이딩 된 이벤트 제거 및 새로 바인딩
			$(window).off("resize.fileinfo").on("resize.fileinfo", function() {_util.setPopResize($pop)});
		},
		//카테고리 설정
		setCategory : async () => {

			if (JSON.stringify(_data.catagoryJson) === "{}") {
				await _fetch.getCategoryJson().then(function (data) {
					_data.catagoryJson = data;
				});
			}

			const list = _data.catagoryJson[_data.item.info.categorykey].list;

			_el.sltItemCategory().html(`
				<option value="" hidden="">카테고리선택</option>
				${Object.keys(list).map(function(key){
				return `<option value="${list[key]}">${key}</option><li>`}).join('\n')}`);
		},
		// 할인금액 설정
		setDiscountPriceInfo : (price, discountPrice) => {
			if (price < 0) {
				price = 0;
				discountPrice = 0;
			}
			_el.divItemDiscountInfo().find(".discount_price > em").text(Currency.getToPrice(price));
			_el.divItemDiscountInfo().find(".dsc_txt").text(`(${Currency.getToPrice(discountPrice)} 원 할인)에 판매합니다.`);
		},
		// 할인 금액 설정(달러)
		setUSDiscountPriceInfo : (price, discountPrice) => {
			if (price < 0) {
				price = 0;
				discountPrice = 0;
			}
			//price = Math.floor(Number(price) * 10) / 10;
			//discountPrice = Math.floor(Number(discountPrice) * 10) / 10;

			_el.divItemDiscountUSInfo().find(".discount_price > em").text(Currency.getToPriceDecimalPoint(price));
			_el.divItemDiscountUSInfo().find(".dsc_txt").text(`(${Currency.getToPriceDecimalPoint(discountPrice)} $ 할인)에 판매합니다.`);
		},
		getTagList : () => {
			_el.ulItemTagList();
		},
	}

	// 이벤트 핸들러
	_eventHandle = {
		init: () => {
			//상품등록 버튼
			$(window).scroll(function() {
				const scrollTop = $(window).scrollTop()
					, footerHeight = $('.footer').outerHeight()
					, scrollBottom = $(document).height() - $(window).height() - footerHeight;

				if (scrollTop > scrollBottom + 130) {
					_el.divItemSubmit().css("bottom",footerHeight);
				} else {
					_el.divItemSubmit().css("bottom",0);
				}
			});

			//탭 스타일 없음, 상품 등록 토글 탭
			_el.divItemDiscountToggle().find("li").on("click", function () {
				$(this).addClass("on").siblings().removeClass("on");
				if($(this).index() === 0){
					_el.divItemDiscountInput().slideDown();
					_el.txtItemDiscountPrice().val("");
					_el.txtItemUSDiscountPrice().val("");
					_manipulateDom.setDiscountPriceInfo(0, 0)
						.setUSDiscountPriceInfo(0, 0);
				} else {
					_el.divItemDiscountInput().slideUp();
				}
			});

			// 레이어 팝업 닫기
			$("body").on("click", ".new_layerpop_close, .registered_filepop_close", function(){
				_el.divItem3DUploadPop().hide();
				_el.divItem2DUploadPop().hide();
				_el.divItemFileInfoPop().hide();
				$('#mask').hide();
				$('body').css("overflow", "unset");
			});

			// 레이퍼 팝업 닫기
			$(document).on("mouseup", function (e){
				const LayerPopup = $("#divItem3DUploadPop, #divItem2DUploadPop, #divItemFileInfoPop");
				if(LayerPopup.has(e.target).length === 0){
					_el.divItem3DUploadPop().hide();
					_el.divItem2DUploadPop().hide();
					_el.divItemFileInfoPop().hide();
					$('#mask').hide();
					$('body').css("overflow", "unset");
				}
			});

			// 파일 정보 팝업 열기
			_el.divItemFileUploadPro().on("click", "button", function() {
				_manipulateDom.getFileInfoPop();
			});

			// 상품 구분
			_el.rdoCategoryKey().on("click", function(){
				_data.item.info.categorykey = $(this).val();
				_manipulateDom.setCategory();
			});

			// 판매 금액
			_el.txtItemPrice().on("paste input focus focusout", function(e){
				let val = Currency.getOnlyNumeric($(this).val());
				val = val.replace(/^[^1-9]+/, "");

				switch (e.type) {
					case "paste" :
						e.preventDefault();
						return false;
					case "focus" :
						$(this).val(val.replace(/,/g, ""));
						break;
					case "focusout" :
						if (!$.isNumeric(val)) {
							$(this).val("");
							return false;
						}
						else if (val % 100 != 0) {
							alert('거래가격은 100원 단위로 등록이 가능합니다.');
							$(this).val("");
							return false;
						}

						if (val < 100) {
							alert("최소 거래금액은 100원입니다.");
							$(this).val("");
							return false;
						}
						$(this).val(Currency.getToPrice(val));
						break;
					default :
						$(this).val(val);
						_el.txtItemDiscountPrice().val("");
						_manipulateDom.setDiscountPriceInfo(0, 0);
				}
			});

			// 판매 금액 (달러)
			_el.txtItemUSPrice().on("paste input focus focusout", function(e){
				const regex = /(^\d+$)|(^\d{1,}.\d{0,1}$)/;
				const val = $(this).val();
				let cvtVal = val;

				if(!regex.test(val))
				{
					if (!$.isNumeric(val))
					{
						cvtVal = "";
					}
					else
					{
						cvtVal = Math.floor(Number(val) * 10) / 10;
					}
				}

				switch (e.type) {
					case "paste" :
						e.preventDefault();
						return false;
					case "focus" :
						$(this).val(val.replace(/,/g, ""));
						break;
					case "focusout" :
						if (!$.isNumeric(cvtVal)) {
							$(this).val("");
							return false;
						}
						else if (cvtVal < 0.1) {
							alert("최소 거래금액은 0.1$(달러)입니다.")
							$(this).val("");
							return false;
						}
						$(this).val(Currency.getToPriceDecimalPoint(cvtVal));
						break;
					default :
						$(this).val(cvtVal);
						_el.txtItemUSDiscountPrice().val("");
						_manipulateDom.setUSDiscountPriceInfo(0, 0);
				}
			});

			// 할인 금액
			_el.txtItemDiscountPrice().on("paste input focus focusout", function(e){
				let val = Currency.getOnlyNumeric($(this).val()).replace(/^[^1-9]+/, "");
				const price = _el.txtItemPrice().val().replace(/,/g, "")
					, discountPrice = price - val;

				switch (e.type) {
					case "paste" :
						e.preventDefault();
						return false;
					case "focusout" :
						if (!$.isNumeric(val)) {
							$(this).val("");
							_manipulateDom.setDiscountPriceInfo(0, 0);
							return false;
						}
						else if (val % 100 != 0) {
							alert('할인가격은 100원 단위로 등록이 가능합니다.');
							$(this).val("");
							_manipulateDom.setDiscountPriceInfo(0, 0);
							return false;
						}
						else if (val < 100) {
							alert("최소 할인금액은 100원입니다.")
							$(this).val("");
							_manipulateDom.setDiscountPriceInfo(0, 0);
							return false;
						}
						else if (discountPrice < 100) {
							alert("할인 적용된 최소 거래 금액은 100원 입니다.");
							$(this).val("");
							_manipulateDom.setDiscountPriceInfo(0, 0);
							return false;
						}

						$(this).val(Currency.getToPrice(val));

						_manipulateDom.setDiscountPriceInfo(discountPrice, val);

						break;
					case "input" :
						if (!$.isNumeric(price)) {
							alert("판매가격을 먼저 입력해주세요.");
							$(this).val("");
							//_el.txtItemPrice().focus();
							return false;
						}

						$(this).val(val);

						_manipulateDom.setDiscountPriceInfo(discountPrice, val);
					default :
						$(this).val(val);
				}
			});

			// 할인 금액(달러)
			_el.txtItemUSDiscountPrice().on("paste input focus focusout", function(e){
				const regex =  /(^\d+$)|(^\d{1,}.\d{0,1}$)/
					, val = $(this).val()
					, price = _el.txtItemUSPrice().val().replace(/,/g, "");
				let cvtVal = val;

				if(!regex.test(val))
				{
					if (!$.isNumeric(val))
					{
						cvtVal = "";
					}
					else
					{
						cvtVal = Math.floor(Number(val) * 10) / 10;
					}
				}

				const discountPrice = (price - cvtVal).toFixed(1);

				switch (e.type) {
					case "paste" :
						e.preventDefault();
						return false;
					case "focus" :
						$(this).val(val.replace(/,/g, ""));
						break;
					case "focusout" :
						if (!$.isNumeric(cvtVal)) {
							$(this).val("");
							_manipulateDom.setUSDiscountPriceInfo(0, 0);
							return false;
						}
						else if (cvtVal < 0.1) {
							alert("최소 거래금액은 0.1$(달러)입니다.")
							$(this).val("");
							_manipulateDom.setUSDiscountPriceInfo(0, 0);
							return false;
						}
						else if (discountPrice < 0.1) {
							alert("할인 적용된 최소 거래 금액은 0.1$(달러) 입니다.");
							$(this).val("");
							_manipulateDom.setUSDiscountPriceInfo(0, 0);
							return false;
						}

						$(this).val(Currency.getToPriceDecimalPoint(cvtVal));

						_manipulateDom.setUSDiscountPriceInfo(discountPrice, cvtVal);
						break;
					case "input" :
						if (!$.isNumeric(price)) {
							alert("해외 판매가격을 먼저 입력해주세요.");
							$(this).val("");
							//_el.txtItemUSPrice().focus();
							return false;
						}

						$(this).val(cvtVal);

						_manipulateDom.setUSDiscountPriceInfo(discountPrice, val);
					default :
						$(this).val(cvtVal);
				}
			});

			// 태그 등록 공백 제거
			_el.txtItemTag().on("paste input", function(){
				$(this).val($(this).val().replace(/ /g, ""));
			});

			// 태그 등록 버튼
			_el.btnItemAddTag().on("click", function() {

				const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9_]{1,5}$/;
				let val = $.trim(_el.txtItemTag().val());

				if (_data.item.tags.length >= 10)
				{
					alert("태그 등록은 최대 10개까지 입니다.");
					return false;
				}
				else if (val == "") {
					alert("태그를 입력해주세요.");
					_el.btnItemAddTag().focus();
					return false;
				}
				else if (_data.item.tags.indexOf(val) >= 0)
				{
					alert("이미 등록하신 태그입니다.");
					return false;
				}
				else if (!regex.test(val)) {
					alert("태그는 1~5 자리의 한글,영문,숫자,언더바(-)\n조합으로 띄어쓰기 없이 입력해 주세요.");
					return false;
				}

				_el.txtItemTag().val("");

				_data.item.tags.push(val);

				_el.ulItemTagList().append(`<li>
						<span>#${val}</span>
						<a href="javascript:;" data-tag="${val}"><img src="/resources/assets/images/products/ico_close.svg" alt="${val} 삭제"></a>
					</li>`);
			});

			// 태그 삭제
			_el.ulItemTagList().on("click", "a", function(){
				const tag = $(this).data("tag");
				$(this).parent("li").remove();
				_data.item.tags = _data.item.tags.filter((val) => val != tag);
			});
		}
	}

	_fetch = {
		getCategoryJson : () => {
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
		setItemAdd : (formData) => {
			const url = "/sell/item/regist";

			return new Promise(function (resolve, reject) {

				$.ajax({
					url : url,
					type : "POST",
					data : formData,
					async : false,
					cache : false,
					contentType : false,
					processData : false,
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
		_data.editor = _util.getEditor();
		_eventHandle.init();
		await _manipulateDom.setCategory();
	}

	// 클로저
	return {
		init : _init,
		popResize : _util.setPopResize,
		editor : () => {return _data.editor == null ? "" : _data.editor.root.innerHTML},
		item : _data.item,
	}
}(jQuery));