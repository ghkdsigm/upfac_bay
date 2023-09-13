let UpSignup = (function($) {
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
		lastSendEmail : '',
		isAuthCodeConfirm : false,

	};

	// 엘레멘트 요소
	_el = {
		btnSetAuthCode : () => $('#btnSetAuthCode'),
		authEmail : () => $('#email'),
		authCodeConfirmArea : () => $('#authCodeConfirmArea'),
		btnResetAuthCode : () => $('#btnResetAuthCode'),
		txtAuthCode : () => $('#txtAuthCode'),
		btnConfirmAuthCode : () => $('#btnConfirmAuthCode'),
		txtPassword : () => $('#txtPassword'),
		txtPasswordConfirm : () => $('#txtPasswordConfirm'),
		strNickName : () => $('#strNickName'),
		check_1 : () => $('#check_1'),
		btnSignUp : () => $('#btnSignUp'),
		frmSignUp : () => $('#frmSignUp'),
		acceptNewsLetter : () => $('#acceptNewsLetter'),
		infoProvider : () => $('#infoProvider'),
		hidAcceptNewsLetter : () => $('#hidAcceptNewsLetter'),
		hidInfoProvider : () => $('#hidInfoProvider'),
	};

	// UTIL형 함수
	_util = {
		checkSameEmail : (strEmail) => {
			return _data.lastSendEmail === strEmail.trim() ? true : false;
		},

		// 이메일 체크
		isEmailValid : (strEmail) => {
			_data.isAuthCodeConfirm = false; // 인증 받은 상태 초기화

			if(!UpValidation.util.isValidEmail(strEmail)) {
				alert("이메일 형식이 잘못되었습니다.");
				_el.authEmail().focus();
				return false;
			}

			_fetch.setAuthCodeSend(strEmail);
		},

		// 인증번호 체크
		isAuthCodeValid : (authCode) => {
			if(!UpValidation.util.isValidAuthCode(authCode)) {
				alert("올바른 인증번호 형식이 아닙니다.");
				_el.txtAuthCode().focus();
				return false;
			}

			_fetch.confirmAuthCode(authCode);
		},

		// 회원가입 validation 체크
		isValid : () => {
			const strPassword = $.trim(_el.txtPassword().val());
			const strPasswordConfirm = $.trim(_el.txtPasswordConfirm().val());
			const strNickName = $.trim(_el.strNickName().val());
			const strEmail = $.trim(_el.authEmail().val());

			// 이메일 체크
			if (strEmail === "") {
				alert("이메일 주소를 입력해 주세요.");
				_el.authEmail().focus();
				return false;
			}

			if(!UpValidation.util.isValidEmail(strEmail)) {
				alert("이메일 형식이 잘못되었습니다.");
				_el.authEmail().focus();
				return false;
			}

			// 이메일 인증 여부 체크
			if (!_data.isAuthCodeConfirm) {
				alert('이메일 인증 이후 재시도 해주세요.');
				return false;
			}

			// 비밀번호 validation 체크
			if (strPassword === '') {
				alert('비밀번호를 입력하세요.');
				_el.txtPassword().focus();
				return false;
			}  else if (strPasswordConfirm === "") {
				alert('비밀번호 확인을 입력하세요.');
				_el.txtPasswordConfirm().focus();
				return false;
			}

			if (UpValidation.util.isValidCharacter(strPassword)) {
				alert("비밀번호는 영문/숫자 및 지정된 특수문자만 사용 가능합니다.");
				_el.txtPassword().val("");
				_el.txtPassword().focus();
				return false;
			}

			let combinationCnt = UpPassword.util.isSpecialCharacter(strPassword);
			if(strPassword.length < 8){
				if(combinationCnt != 3) {
					alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
					_el.txtPassword().focus();
					return false;
				}
			} else {
				if(combinationCnt == 1) {
					alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
					_el.txtPassword().focus();
					return false;
				}
			}

			if(strPassword.length > 20){
				alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
				_el.txtPassword().focus();
				return false;
			} else if (strPassword !== strPasswordConfirm) {
				alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
				_el.txtPasswordConfirm().val("");
				_el.txtPasswordConfirm().focus();
				return false;
			}

			// 닉네임 validation 체크
			if ($.trim(strNickName) === "") {
				alert("닉네임을 입력해 주세요.");
				_el.strNickName().focus();
				return false;
			}

			// 약관 동의 여부 체크
			if(!_el.check_1().is(':checked')) {
				alert("아이템베이 이용약관에 동의해 주세요.");
				_el.check_1().focus();
				return false;
			}

			_fetch.setSignUp();
		},
	};

	// 돔 조작이벤트
	_manipulateDom = {
		// 인증코드 확인 영역 활성화/비활성화
		showAuthCodeConfirm : (show) => {
			if (show) _el.authCodeConfirmArea().show();
			else _el.authCodeConfirmArea().hide();
		},

	}

	// 이벤트 핸들러
	_eventHandle = {
		init: () => {
			_el.authCodeConfirmArea().hide();

			_el.authEmail().on('keyup', () => {
				const strEmail = _el.authEmail().val();

				if (!_util.checkSameEmail(strEmail)) {
					_manipulateDom.showAuthCodeConfirm(false);
				}

				if(UpValidation.util.isValidEmail(strEmail)) {
					_el.btnSetAuthCode().addClass('on');
				} else {
					_el.btnSetAuthCode().removeClass('on');
				}
			})

			_el.btnSetAuthCode().on('click', () => {
				const strEmail = _el.authEmail().val();

				// 동일 이메일 발송이 아닌 경우에 인증 메일 발송
				if (!_util.checkSameEmail(strEmail)) {
					_util.isEmailValid(strEmail);
				}
			})

			_el.btnResetAuthCode().on('click', () => {
				const strEmail = _el.authEmail().val();
				_util.isEmailValid(strEmail);
			})

			_el.btnConfirmAuthCode().on('click', () => {
				const strAuthCode = _el.txtAuthCode().val();
				_util.isAuthCodeValid(strAuthCode);
			})

			_el.btnSignUp().on('click', () => {
				_util.isValid();
			})
		}
	}

	_fetch = {
		// 인증 코드 전송
		setAuthCodeSend : (strEmail) => {
			$.ajax({
				url: '/member/signup/emailauth',
				type: "POST",
				data: {'email' : strEmail},
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					alert('인증 코드가 발송되었습니다.');

					_manipulateDom.showAuthCodeConfirm(true);
					_data.lastSendEmail = strEmail;
				},
				error: function (request, status, error) {
					alert(JSON.parse(request.responseText).message);
				}
			})
		},

		// 인증 코드 확인
		confirmAuthCode : (authCode) => {
			$.ajax({
				url: '/member/signup/emailauth/confirm',
				type: "POST",
				data: {'email' : _data.lastSendEmail, 'authCode' : authCode},
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					alert('인증 코드가 확인되었습니다.');
					_data.isAuthCodeConfirm = true;
				},
				error: function (request, status, error) {
					alert(JSON.parse(request.responseText).message);
				}
			})
		},

		// 회원 가입
		setSignUp : () => {
			let strAcceptNewsLetter = _el.acceptNewsLetter().is(':checked') ? '1' : '0';
			let strInfoProvider = _el.infoProvider().is(':checked') ? '1' : '0';
			_el.hidAcceptNewsLetter().val(strAcceptNewsLetter);
			_el.hidInfoProvider().val(strInfoProvider);

			let queryString = _el.frmSignUp().serialize();

			$.ajax({
				url: '/member/signup/regist',
				type: "POST",
				data: queryString,
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					console.log(data)
					if(data.status === '400') {
						alert(data.message);
					} else {
						alert('회원가입이 완료되었습니다.');
					}

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