let UpLogin = (function($) {
	let _init;
	let _el;
	let _data;
	let _args;
	let _util;
	let _manipulateDom;
	let _eventHandle;
	let _fetch;

	//  private 내부 변수
	_data = {
	};

	// 엘레멘트 요소
	_el = {
		btnLogin : () => $('#btnLogin'),
		liLogin : () => $('#liLogin'),
		inpEmailLogin : () => $('#inpEmailLogin'),
		inpPasswordLogin : () => $('#inpPasswordLogin'),
		chkAutoLoginMain : () => $('#chkAutoLoginMain'),
		dvLoginPop : () => $("#dvLoginPop"),
		aLoginClose : () => $("#aLoginClose"),
		forgetPassword : () => $('#forgetPassword'),
		findPasswordPop : () => $('#find_password_pop'),
		btnToSignup : () => $('#btnToSignup'),
		signUpPop : () => $('#sign_up_pop'),
	};

	// UTIL형 함수
	_util = {
		setLogin: function(){
			if($.trim(_el.inpEmailLogin().val()) === '' || $.trim(_el.inpEmailLogin().val()).length < 3){
				alert("아이디를 입력 하세요");

			}else if(!UpValidation.util.isValidEmail(_el.inpEmailLogin().val())){
				alert("이메일 형식이 잘못되었습니다");

			}else if($.trim(_el.inpPasswordLogin().val()) === '' || $.trim(_el.inpPasswordLogin().val()).length < 8){
				alert("패스워드를 확인 해주세요")
			}else{
				_fetch.setLogin()
			}
		},
		setLoginTemplateBind : function (){
			_el.inpEmailLogin().val('');
			_el.inpPasswordLogin().val('');
			_el.dvLoginPop().show();

		},
		popupClose : function(obj) {
		$(obj).parents('.pop_up').hide()

		// $('#layerbox').hide();
		if($('#mask')){
			$('#mask').hide();
		}
		$('body').css("overflow", "unset");
	}
	};

	// 돔 조작이벤트
	_manipulateDom = {
		loginPassWordInit : function (){

		}

	}

	// 이벤트 핸들러
	_eventHandle = {
		init: () => {
			_el.btnLogin().on('click', () => {
				 _util.setLogin();
			});

			_el.liLogin().on('click', () => {
				_util.setLoginTemplateBind();
			});

			_el.aLoginClose().on('click', (e) => {
				$(e.currentTarget).parents('.pop_up').hide()
				// $('#layerbox').hide();
				if($('#mask')){
					$('#mask').hide();
				}
				$('body').css("overflow", "unset");
			});

			_el.forgetPassword().on('click', () => {
				_el.dvLoginPop().hide();
				_el.findPasswordPop().show();
			})

			_el.btnToSignup().on('click', () => {
				_el.dvLoginPop().hide();
				_el.signUpPop().show();
			})

		}
	}

	_fetch = {
		setLogin : () => {

			const saveId = _el.chkAutoLoginMain().val();
			const regType = '';

			$.ajax({
				url: '/login/login',
				type: "POST",
				data: {'memberEmail' : _el.inpEmailLogin().val(), 'memberPw':_el.inpPasswordLogin().val(), 'saveId':saveId, 'regType':regType},
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					if(data.code === '0000'){
						location.replace("/main");
					}else if(data.code === '1000'){
						alert(data.message);
						_el.inpPasswordLogin().val('');
					}else if(data.code === '2000'){
						alert(data.message);
						location.replace(data.redirectUrl);
					}
				},
				error: function (e) {
					alert('오류가 발생하였습니다.')
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