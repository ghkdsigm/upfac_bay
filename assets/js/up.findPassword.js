let UpFindPassword = (function($) {
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
	};

	// 엘레멘트 요소
	_el = {
		findPasswordPop : () => $('#find_password_pop'),
		findPWClose : () => $('#findPW_close'),
		findPwCodeConfirmArea : () => $('#findPwCodeConfirmArea'),
		btnResetPassword : () => $('#btnResetPassword'),
		findPWAuthEmail : () => $('#findPWAuthEmail'),
		btnFindPWAuthCode : () => $('#btnFindPWAuthCode'),
		txtFindPWAuthCode : () => $('#txtFindPWAuthCode'),
		btnFindPWAuthConfirm : () => $('#btnFindPWAuthConfirm'),
		btnReFindPWAuthCode : () => $('#btnReFindPWAuthCode'),
		frmEmailAuth : () => $('#frmEmailAuth'),
		findPWBtnField : () => $('#frmEmailAuth #findPW_btn_field'),
		formContent : () => $('#find_password_pop .login_form-content'),
		findPWPassword : () => $('#findPWPassword'),
		findPWPasswordConfirm : () => $('#findPWPasswordConfirm'),
		dvLoginPop : () => $('#dvLoginPop'),
	};

	// UTIL형 함수
	_util = {
		checkSameEmail : (strEmail) => {
			return _data.lastSendEmail === strEmail.trim() ? true : false;
		},

		// 이메일 체크
		isEmailValid : (strEmail) => {
			if(!UpValidation.util.isValidEmail(strEmail)) {
				alert("이메일 형식이 잘못되었습니다.");
				_el.findPWAuthEmail().focus();
				return false;
			}

			return true;
		},

		// 인증번호 체크
		authCodeValid : (authCode) => {
			if (authCode === "") {
				alert("인증 번호를 입력해 주세요.");
				_el.txtFindPWAuthCode().focus();
				return false;
			}

			if(!UpValidation.util.isValidAuthCode(authCode)) {
				alert("올바른 인증번호가 아닙니다.");
				_el.txtFindPWAuthCode().focus();
				return false;
			}

			_fetch.confirmAuthCode(authCode);
		},

		passwordValid : () => {
			const strPassword = $.trim(_el.findPWPassword().val());
			const strPasswordConfirm = $.trim(_el.findPWPasswordConfirm().val());

			// 비밀번호 validation 체크
			if (strPassword === '') {
				alert('비밀번호를 입력하세요.');
				_el.findPWPassword().focus();
				return false;
			}  else if (strPasswordConfirm === "") {
				alert('비밀번호 확인을 입력하세요.');
				_el.findPWPasswordConfirm().focus();
				return false;
			}

			if (UpValidation.util.isValidCharacter(strPassword)) {
				alert("비밀번호는 영문/숫자 및 지정된 특수문자만 사용 가능합니다.");
				_el.findPWPassword().val("");
				_el.findPWPassword().focus();
				return false;
			}

			let combinationCnt = UpPassword.util.isSpecialCharacter(strPassword);
			if(strPassword.length < 8){
				if(combinationCnt != 3) {
					alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
					_el.findPWPassword().focus();
					return false;
				}
			} else {
				if(combinationCnt == 1) {
					alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
					_el.findPWPassword().focus();
					return false;
				}
			}

			if(strPassword.length > 20){
				alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
				_el.findPWPassword().focus();
				return false;
			} else if (strPassword !== strPasswordConfirm) {
				alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
				_el.findPWPasswordConfirm().val("");
				_el.findPWPasswordConfirm().focus();
				return false;
			}

			_fetch.resetPassword();
		}

	};

	// 돔 조작이벤트
	_manipulateDom = {
		// 인증코드 확인 영역 활성화/비활성화
		showAuthCodeConfirm : (show) => {
			if (show) {
				const html = `
					<div id="findPwCodeConfirmArea">
						<div class="field button-field authconfirm mt-10">
							<label for="">
								<input type="text" id="txtFindPWAuthCode" placeholder="6자리 인증코드 입력">
								<button type="button" id="btnFindPWAuthConfirm">확인</button>
							</label>
						</div>
						<div class="regetauth">메일을 받지 못하셨나요? <a href="javascript:;" id="btnReFindPWAuthCode">인증코드 다시 보내기</a></div>
					</div>
				`;

				_el.frmEmailAuth().append(html);
				_el.findPWBtnField().hide();
				_eventHandle.emailAuthEvent();
			} else {
				_el.findPwCodeConfirmArea().remove();
				_el.findPWBtnField().show();
			}
		},

		showPasswordResetForm : () => {
			const html = `
				<form>
					<div class="field input-field">
						<label for="findPWPassword"><em>비밀번호</em></label>
						<span class="tip">8~20자의 영문, 특수문자, 숫자 조합으로 띄어쓰기 없이 입력</span>
						<input type="password" placeholder="비밀번호 입력" class="input" name="password" id="findPWPassword" maxlength="20" />
					</div>
					<div class="field input-field field_pwconfirm">
						<label for="findPWPasswordConfirm"><em>비밀번호 확인</em></label>
						<input type="password" placeholder="비밀번호 확인" class="input" id="findPWPasswordConfirm" maxlength="20" />
					</div>
					<div class="field button-field mt-20">
						<button type="button" id="btnResetPassword" class="loginbt_type01">비밀번호 변경</button>
					</div>
				</form>
			`;

			_el.frmEmailAuth().remove();
			_el.formContent().append(html);

			_eventHandle.passwordResetEvent();
		},

		resetFindPWForm : () => {
			const html = `
				<div class="login_wrap">
					<a href="javascript:;" id="findPW_close" class="layerpop_close" ><img src="/resources/assets/images/common/ico_closepop.svg" alt=""></a>
					<div class="login_forms">
						<div class="login_form fpw">
							<div class="login_form-content">
								<div class="title">
									<h2>비밀번호 찾기</h2>
								</div>
								<p class="findpw_dec">
									입력된 이메일로 <br/>비밀번호 재설정 메일이 발송됩니다.
								</p>
								<form id="frmEmailAuth">
									<div class="field input-field">
										<label for="findPWAuthEmail"><em>비밀번호 변경</em></label>
										<input type="email" placeholder="이메일 주소를 입력해주세요" class="input" id="findPWAuthEmail">
									</div>
			
									<div class="field button-field mt-20" id="findPW_btn_field">
										<button type="button" id="btnFindPWAuthCode" class="loginbt_type01">인증코드 발송</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			`;

			_el.findPasswordPop().hide();
			_el.findPasswordPop().textContent = '';
			_el.findPasswordPop().html(html);
			_eventHandle.init();
			_data.lastSendEmail = '';
		},

		afterFindPassword : () => {
			_el.findPasswordPop().hide();
			_el.dvLoginPop().show();

			_manipulateDom.resetFindPWForm();
		},
	};

	// 이벤트 핸들러
	_eventHandle = {
		init: () => {
			_el.findPwCodeConfirmArea().hide();

			_el.findPWClose().on('click', () => {
				if (confirm('현재 팝업을 닫으면, 인증 정보가 초기화 됩니다.\n정말 닫으시겠습니까?')) {
					_manipulateDom.resetFindPWForm();
				}
			})

			_el.findPWAuthEmail().on('keyup', () => {
				const strEmail = _el.findPWAuthEmail().val();

				if (!_util.checkSameEmail(strEmail)) {
					_manipulateDom.showAuthCodeConfirm(false);
				}
			});

			_el.btnFindPWAuthCode().on('click', () => {
				const strEmail = _el.findPWAuthEmail().val();
				if (_util.isEmailValid(strEmail)) {
					_fetch.setAuthCodeSend(strEmail, true);
				}
			})
		},

		emailAuthEvent: () => {
			_el.btnFindPWAuthConfirm().on('click', () => {
				const strAuthCode = _el.txtFindPWAuthCode().val();
				_util.authCodeValid(strAuthCode);
			})

			_el.btnReFindPWAuthCode().on('click', () => {
				const strEmail = _el.findPWAuthEmail().val();
				if (_util.isEmailValid(strEmail)) {
					_fetch.setAuthCodeSend(strEmail, false);
				}
			})
		},

		passwordResetEvent: () => {
			_el.btnResetPassword().on('click', () => {
				_util.passwordValid();
			})
		}
	}

	_fetch = {
		// 인증 코드 전송
		setAuthCodeSend : (strEmail, setForm) => {
			$.ajax({
				url: '/member/password/emailauth',
				type: "POST",
				data: {'email' : strEmail},
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					alert('인증 코드가 발송되었습니다.');

					if (setForm) _manipulateDom.showAuthCodeConfirm(true);
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
				url: '/member/password/emailauth/confirm',
				type: "POST",
				data: {'email' : _data.lastSendEmail, 'authCode' : authCode},
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					alert('인증 코드가 확인되었습니다.');
					_manipulateDom.showPasswordResetForm();
				},
				error: function (request, status, error) {
					alert(JSON.parse(request.responseText).message);
				}
			})
		},

		// 비밀번호 변경
		resetPassword : () => {
			const strPassword = $.trim(_el.findPWPassword().val());

			$.ajax({
				url: '/member/password/reset',
				type: "POST",
				data: {'email' : _data.lastSendEmail, 'password' : strPassword},
				dataType: "JSON",
				async: false,
				cache: false,
				success: function (data) {
					if (data.code === '200') {
						alert('비밀번호 변경이 완료되었습니다.');
						_manipulateDom.afterFindPassword();
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