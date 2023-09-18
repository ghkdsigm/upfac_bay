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
		signup : () => $('#sign_up_pop'),
		signupClose : () => $('#signup_close'),
		btnSignupAuthCode : () => $('#btnSignupAuthCode'),
		signupEmail : () => $('#signupEmail'),
		signupCodeConfirmArea : () => $('#signupCodeConfirmArea'),
		btnReSignupAuthCode : () => $('#btnReSignupAuthCode'),
		txtSignupAuthCode : () => $('#txtSignupAuthCode'),
		btnSignupAuthConfirm : () => $('#btnSignupAuthConfirm'),
		signupPassword : () => $('#signupPassword'),
		signupPasswordConfirm : () => $('#signupPasswordConfirm'),
		signupNickName : () => $('#signupNickName'),
		check_1 : () => $('#check_1'),
		btnSignUp : () => $('#btnSignUp'),
		frmSignUp : () => $('#frmSignUp'),
		acceptNewsLetter : () => $('#acceptNewsLetter'),
		infoProvider : () => $('#infoProvider'),
		hidAcceptNewsLetter : () => $('#hidAcceptNewsLetter'),
		hidInfoProvider : () => $('#hidInfoProvider'),
		dvLoginPop : () => ('#dvLoginPop'),

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
				_el.signupEmail().focus();
				return false;
			}

			_fetch.setAuthCodeSend(strEmail);
		},

		// 인증번호 체크
		isAuthCodeValid : (authCode) => {
			if(!UpValidation.util.isValidAuthCode(authCode)) {
				alert("올바른 인증번호 형식이 아닙니다.");
				_el.txtSignupAuthCode().focus();
				return false;
			}

			_fetch.confirmAuthCode(authCode);
		},

		// 회원가입 validation 체크
		isValid : () => {
			const strPassword = $.trim(_el.signupPassword().val());
			const strPasswordConfirm = $.trim(_el.signupPasswordConfirm().val());
			const signupNickName = $.trim(_el.signupNickName().val());
			const strEmail = $.trim(_el.signupEmail().val());

			// 이메일 체크
			if (strEmail === "") {
				alert("이메일 주소를 입력해 주세요.");
				_el.signupEmail().focus();
				return false;
			}

			if(!UpValidation.util.isValidEmail(strEmail)) {
				alert("이메일 형식이 잘못되었습니다.");
				_el.signupEmail().focus();
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
				_el.signupPassword().focus();
				return false;
			}  else if (strPasswordConfirm === "") {
				alert('비밀번호 확인을 입력하세요.');
				_el.signupPasswordConfirm().focus();
				return false;
			}

			if (UpValidation.util.isValidCharacter(strPassword)) {
				alert("비밀번호는 영문/숫자 및 지정된 특수문자만 사용 가능합니다.");
				_el.signupPassword().val("");
				_el.signupPassword().focus();
				return false;
			}

			let combinationCnt = UpPassword.util.isSpecialCharacter(strPassword);
			if(strPassword.length < 8){
				if(combinationCnt != 3) {
					alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
					_el.signupPassword().focus();
					return false;
				}
			} else {
				if(combinationCnt == 1) {
					alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
					_el.signupPassword().focus();
					return false;
				}
			}

			if(strPassword.length > 20){
				alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
				_el.signupPassword().focus();
				return false;
			} else if (strPassword !== strPasswordConfirm) {
				alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
				_el.signupPasswordConfirm().val("");
				_el.signupPasswordConfirm().focus();
				return false;
			}

			// 닉네임 validation 체크
			if ($.trim(signupNickName) === "") {
				alert("닉네임을 입력해 주세요.");
				_el.signupNickName().focus();
				return false;
			}

			if (!UpValidation.util.isValidNickName(signupNickName)) {
				alert('닉네임은 한글과 영문 조합으로만 가능하며,\n한글8자 영문16자 이하로 입력해야 합니다.')
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
			if (show) _el.signupCodeConfirmArea().show();
			else _el.signupCodeConfirmArea().hide();
		},

		resetSignupForm : () => {
			const html = `
				<div class="login_wrap">
					<a href="javascript:;" id="signup_close" class="layerpop_close" ><img src="/resources/assets/images/common/ico_closepop.svg" alt=""></a>
					<div class="login_forms">
						<div class="login_form signup">
							<div class="login_form-content">
								<div class="title">
									<h2>회원가입</h2>
								</div>
								<form id="frmSignUp" method="post">
									<div class="field input-field">
										<label for="signupEmail"><em>아이디(Email)</em></label>
										<input type="email" placeholder="example@example.com" name="email" class="input" id="signupEmail">
									</div>
									<div class="field button-field mt-10">
										<button type="button" class="loginbt_type03" id="btnSignupAuthCode">인증하기</button>
									</div>
									<div id="signupCodeConfirmArea">
										<div class="field button-field authconfirm mt-10">
											<label for="">
												<input type="text" id="txtSignupAuthCode" placeholder="6자리 인증코드 입력">
												<button type="button" id="btnSignupAuthConfirm">확인</button>
											</label>
										</div>
										<div class="regetauth">메일을 받지 못하셨나요? <a href="javascript:;" id="btnReSignupAuthCode">인증코드 다시 보내기</a></div>
									</div>
									<div class="field input-field">
										<label for="signupPassword"><em>비밀번호</em></label>
										<span class="tip">영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합(10~16자)</span>
										<input type="password" placeholder="비밀번호 입력" class="input" name="password" id="signupPassword" maxlength="20" />
									</div>
									<div class="field input-field field_pwconfirm">
										<label for="signupPasswordConfirm"><em>비밀번호 확인</em></label>
										<input type="password" placeholder="비밀번호 확인" class="input" id="signupPasswordConfirm" maxlength="20" />
									</div>
									<div class="field input-field">
										<label for="signupNickName"><em>닉네임</em></label>
										<input type="text" placeholder="UPFAC에서 사용하실 닉네임" class="input" name="nickName" id="signupNickName" maxlength="20" />
									</div>
			
									<div class="field input-field field_agree">
										<div class="checkbox_group">
											<input type="checkbox" id="check_all" >
											<label for="check_all" class="check_all"><span>모든 약관을 확인하고 전체 동의합니다.</span></label>
			
											<input type="checkbox" id="check_1" class="normal">
											<label for="check_1"><span>이용약관 및 개인정보처리방침 동의 (필수)</span></label>
			
											<input type="checkbox" id="acceptNewsLetter" class="normal">
											<label for="acceptNewsLetter"><span>할인소식 및 프로모션 알림 동의 (선택)</span></label>
			
											<input type="checkbox" id="infoProvider" class="normal">
											<label for="infoProvider"><span>개인정보 수집 및  이용동의 (선택)</span></label>
			
											<input type="hidden" id="hidAcceptNewsLetter" name="acceptNewsLetter">
											<input type="hidden" id="hidInfoProvider" name="infoProvider">
										</div>
									</div>
			
									<div class="field button-field mt-20">
										<button type="button" class="loginbt_type04" id="btnSignUp">가입하기</button>
									</div>
								</form>
							</div>
			
							<div class="line"></div>
			
							<div class="media-options">
								<a href="#" title="네이버 회원가입" class="field facebook">
									<img src="/resources/assets/images/login/sns_naver.png" alt="sns 네이버 로그인" />
								</a>
								<a href="#" title="카카오 회원가입"  class="field facebook">
									<img src="/resources/assets/images/login/sns_kakao.png" alt="sns 카카오 로그인" />
								</a>
								<a href="#" title="구글 회원가입"  class="field facebook">
									<img src="/resources/assets/images/login/sns_google.png" alt="sns 구글 로그인" />
								</a>
								<a href="#" title="페이스북 회원가입"  class="field facebook">
									<img src="/resources/assets/images/login/sns_facebook.png" alt="sns 페이스북 로그인" />
								</a>
								<a href="#" title="트위터 회원가입"  class="field facebook">
									<img src="/resources/assets/images/login/sns_tweeter.png" alt="sns 트위터 로그인" />
								</a>
							</div>
						</div>
					</div>
				</div>
			`;

			_el.signup().hide();
			_el.signup().textContent = '';
			_el.signup().html(html);
			_eventHandle.init();
			_data.lastSendEmail = '';
			_data.isAuthCodeConfirm = false;
		},

		afterSignUp : () => {
			_el.signUpPop().hide();
			_el.dvLoginPop().show();

			_manipulateDom.resetSignupForm();
		},

	}

	// 이벤트 핸들러
	_eventHandle = {
		init: () => {
			_el.signupCodeConfirmArea().hide();

			_el.signupClose().on('click', () => {
				if (confirm('현재 팝업을 닫으면, 작성 내용이 초기화 됩니다.\n정말 닫으시겠습니까?')) {
					_manipulateDom.resetSignupForm();
				}
			})

			_el.signupEmail().on('keyup', () => {
				const strEmail = _el.signupEmail().val();

				if (!_util.checkSameEmail(strEmail)) {
					_manipulateDom.showAuthCodeConfirm(false);
				}

				if(UpValidation.util.isValidEmail(strEmail)) {
					_el.btnSignupAuthCode().addClass('on');
				} else {
					_el.btnSignupAuthCode().removeClass('on');
				}
			})

			_el.btnSignupAuthCode().on('click', () => {
				const strEmail = _el.signupEmail().val();

				// 동일 이메일 발송이 아닌 경우에 인증 메일 발송
				if (!_util.checkSameEmail(strEmail)) {
					_util.isEmailValid(strEmail);
				}
			})

			_el.btnReSignupAuthCode().on('click', () => {
				const strEmail = _el.signupEmail().val();
				_util.isEmailValid(strEmail);
			})

			_el.btnSignupAuthConfirm().on('click', () => {
				const strAuthCode = _el.txtSignupAuthCode().val();
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
					_data.isAuthCodeConfirm = false;
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
					if(data.status === '200') {
						alert('회원가입이 완료되었습니다.');
						_manipulateDom.afterSignUp();
					} else {
						alert(data.message);
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