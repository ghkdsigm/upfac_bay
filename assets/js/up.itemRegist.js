const UpItemRegist = (function($) {
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

	};

	// 엘레멘트 요소
	_el = {
		templateItem3DUploadPop : () => $("#templateItem3DUploadPop"),
		templateItem2DUploadPop : () => $("#templateItem2DUploadPop"),
		divItem3DUploadPop : () => $("#divItem3DUploadPop"),
		divItem2DUploadPop : () => $("#divItem2DUploadPop"),
		divItemFileInfoPop : () => $("#divItemFileInfoPop"),
		divItemFileUploadPro : () => $("#divItemFileUploadPro"),
		divItemFileUploadInfo : () => $("#divItemFileUploadInfo"),
		sltItemCategory : () => $("#sltItemCategory"),
		txtItemSubject  : () => $("#txtItemSubject "),
		txtItemPrice : () => $("#txtItemPrice"),
		txtItemUSPrice : () => $("#txtItemUSPrice"),
		txtItemDiscountPrice : () => $("#txtItemDiscountPrice"),
		txtItemUSDiscountPrice : () => $("#txtItemUSDiscountPrice"),
		divItemSubmit : () => $("#divItemSubmit"),
	};

	// UTIL형 함수
	_util = {

	};

	// 돔 조작이벤트
	_manipulateDom = {
		// 업로드 창 초기화 세틍
		setInitUploadPop : async () => {

			await $('body')
				.append(eval(_el.templateItem3DUploadPop().html())())
				.append(eval(_el.templateItem2DUploadPop().html())());

			$(window).on("resize", function () {
				UpItemCommon.popResize(_el.divItem3DUploadPop());
				UpItemCommon.popResize(_el.divItem2DUploadPop());
			});
		},
		// 업로드 창
		getUploadPop : (type) => {
			const $pop = type === "3D" ? _el.divItem3DUploadPop() : _el.divItem2DUploadPop();

			$('body').css("overflow", "hidden");

			$pop.css("position", "absolute");
			UpItemCommon.popResize($pop);
			$pop.show();

			//애니메이션 효과
			$('#mask').css({
				'width': '100%',
				'height': '100%'
			}).fadeTo("slow", 0.5);
		},
	}

	// 이벤트 핸들러
	_eventHandle = {
		init: () => {

			// 업로드 버튼
			_el.divItemFileUploadInfo().on("click", "a.upload_bt", function() {
				_manipulateDom.getUploadPop(UpItemCommon.item.info.categorykey);
			});

			_el.divItemSubmit().on("click", "a", function(){
				const categoryseq = _el.sltItemCategory().val();
				const subject = $.trim(_el.txtItemSubject().val());
				const content = UpItemCommon.editor();
				let price = $.trim(_el.txtItemPrice().val()).replace(/,/g, "");
				let discountPrice = $.trim(_el.txtItemDiscountPrice().val()).replace(/,/g, "");
				let usPrice = $.trim(_el.txtItemUSPrice().val()).replace(/,/g, "");
				let usDiscountPrice = $.trim(_el.txtItemUSDiscountPrice().val()).replace(/,/g, "");

				price = !$.isNumeric(price) ? 0 : Number(price);
				discountPrice = !$.isNumeric(discountPrice) ? 0 : Number(discountPrice);
				usPrice = !$.isNumeric(usPrice) ? 0 : Number(usPrice);
				usDiscountPrice = !$.isNumeric(usDiscountPrice) ? 0 : Number(usDiscountPrice);

				if (_el.sltItemCategory().val() == "")
				{
					alert("카테고리를 선택해주세요.");
					_el.sltItemCategory().focus();
					return false;
				}
				else if (subject == "")
				{
					alert("제목을 입력해주세요.");
					_el.txtItemSubject().focus();
					return false;
				}
				else if (price > 0)
				{
					if (price % 100 != 0) {
						alert('거래가격은 100원 단위로 등록이 가능합니다.');
						_el.txtItemPrice().focus();
						return false;
					}
					else if (price < 100) {
						alert("최소 거래 금액은 100원 입니다.");
						_el.txtItemPrice().focus();
						return false;
					}
					else if(discountPrice > 0)
					{
						if (discountPrice % 100 != 0) {
							alert('할인가격은 100원 단위로 등록이 가능합니다.');
							_el.txtItemPrice().focus();
							return false;
						}
						else if (price - discountPrice < 100)
						{
							alert("할인 적용된 최소 거래 금액은 100원 입니다.");
							_el.txtItemDiscountPrice().focus();
							return false;
						}
					}
				}
				else if (usPrice > 0)
				{
					if (usPrice < 0.1) {
						alert("최소 거래 금액은 0.1$(달러) 입니다.");
						_el.txtItemUSPrice().focus();
						return false;
					}
					else if (usPrice - usDiscountPrice < 0.1)
					{
						alert("할인 적용된 최소 거래 금액은 0.1$(달러) 입니다.");
						_el.txtItemUSDiscountPrice().focus();
						return false;
					}
				}
				else if (content == "")
				{
					alert("내용을 입력해주세요.");
					_el.txtItemSubject().focus();
					return false;
				}

				const formData = new FormData();

				formData.append("subject", subject);
				formData.append("contents", content);
				formData.append("price", price);
				formData.append("usPrice", usPrice);
				formData.append("discountPrice", discountPrice);
				formData.append("usDiscountPrice", usDiscountPrice);
				formData.append("subCategorySeq", categoryseq);
				formData.append("tag", UpItemCommon.item.tags.join(","));
				formData.append("metadata", UpItemCommon.item.info.categorykey == '3D' ? JSON.stringify(UpItemCommon.item.f3d) : "");

				_fetch.setItemAdd(formData).then(function (data) {
					if (data.code > 0)
					{
						alert("물품이 등록되었습니다.");
						document.location.replace("/sell/list");
					}
					//console.log(data);
				}).catch(function(e){
					//console.log(e);
					alert("등록 중 오류가 발생하였습니다.\\n관리자에게 문의하시기 바랍니다.");
				});
			});
		}
	}

	_fetch = {
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
		_manipulateDom.setInitUploadPop();
		_eventHandle.init();
	}

	// 클로저
	return {
		init : _init
	}
}(jQuery));