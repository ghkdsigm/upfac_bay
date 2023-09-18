let UpMember = (function($) {

    let _args;
    let _init;
    let _data;
    let _util;
    let _el;
    let _manipulateDom;
    let _eventHandle;
    let _fetch;

    _args = {
    }

    _data = {
        validNickname : false,
        validEmail : false,
        validMobilePhone : false,
    }

    _el = {
        profileImageInput: () => $("#profileImageInput"),
        btnEdit: () => $("#btnEdit"),
        txtPassword1: () => $("#txtPassword1"),
        txtPassword2: () => $("#txtPassword2"),
        frmDetail: () => $("#frmDetail"),
        chkNewsletter: () => $("input[name='chkNewsletter']"),
        chkSms: () => $("input[name='chkSms']"),
        txtNickname: () => $("#txtNickname"),
        txtAcceptemail: () => $("#txtAcceptemail"),
        txtMobilePhone: () => $("#txtMobilePhone"),
        spnAbleNickname: () => $("#spnAbleNickname"),
        spnUnableNickname: () => $("#spnUnableNickname"),
        divValidEmail: () => $("#divValidEmail"),
        divValidMobilePhone: () => $("#divValidMobilePhone"),
        btnCancel: () => $("#btnCancel"),
        emailDomain: () => $("#emailDomain"),
    }

    _util = {
        isValid: () => {
            const strPassword = $.trim(_el.txtPassword1().val());
            const strPasswordConfirm = $.trim(_el.txtPassword2().val());
            const strNickName = $.trim(_el.txtNickname().val());
            const strEmail = $.trim(_el.txtAcceptemail().val());

            if (strEmail === '') {
                alert("이메일 주소를 입력해 주세요.");
                _el.txtAcceptemail().focus();
                return false;
            }

            if(!UpValidation.util.isValidEmail(strEmail)) {
                alert("이메일 형식이 잘못되었습니다.");
                _el.txtAcceptemail().focus();
                return false;
            }

            // 비밀번호 validation 체크
            if (strPassword === '') {
                alert('비밀번호를 입력하세요.');
                _el.txtPassword1().focus();
                return false;
            }  else if (strPasswordConfirm === "") {
                alert('비밀번호 확인을 입력하세요.');
                _el.txtPassword2().focus();
                return false;
            }

            if (UpValidation.util.isValidCharacter(strPassword)) {
                alert("비밀번호는 영문/숫자 및 지정된 특수문자만 사용 가능합니다.");
                _el.txtPassword1().val("");
                _el.txtPassword1().focus();
                return false;
            }

            let combinationCnt = UpPassword.util.isSpecialCharacter(strPassword);
            if(strPassword.length < 8){
                if(combinationCnt != 3) {
                    alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
                    _el.txtPassword1().focus();
                    return false;
                }
            } else {
                if(combinationCnt == 1) {
                    alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
                    _el.txtPassword1().focus();
                    return false;
                }
            }

            if(strPassword.length > 20){
                alert("비밀번호는 8~20 자리의 영문,특문,숫자\n조합으로 띄어쓰기없이 입력해 주세요.");
                _el.txtPassword1().focus();
                return false;
            } else if (strPassword !== strPasswordConfirm) {
                alert("비밀번호와 비밀번호 확인 값이 일치하지 않습니다.");
                _el.txtPassword2().val("");
                _el.txtPassword2().focus();
                return false;
            }

            // 닉네임 validation 체크
            if ($.trim(strNickName) === "") {
                alert("닉네임을 입력해 주세요.");
                _el.txtNickname().focus();
                return false;
            }

            if (_el.txtNickname().val() != "") {
                _fetch.isValidUpdateVal(1, _el.txtNickname().val());
            }

            if (_el.txtMobilePhone().val() != "") {
                _fetch.isValidUpdateVal(2, _el.txtMobilePhone().val());
            }

            if (_el.txtAcceptemail().val() != "") {
                _fetch.isValidUpdateVal(3, _el.txtAcceptemail().val());
            }

            if (_el.chkNewsletter().is(':checked') == true) {
                _el.chkNewsletter().val("1");
            } else {
                _el.chkNewsletter().val("0");
            }

            if (_el.chkSms().is(':checked') == true) {
                _el.chkSms().val("1");
            } else {
                _el.chkSms().val("0");
            }

            if (_data.validNickname == false || _data.validEmail == false || _data.validMobilePhone == false) {
                alert("닉네임, 이메일, 휴대전화 중복을 확인해주세요.");
                return false;
            }

            _el.frmDetail().attr("action", "/member/detail");
            _el.frmDetail().submit();
        }
    }

    _manipulateDom = {
    }

    _eventHandle = function() {

        _el.txtNickname().on('focusout', function () {
            if (_el.txtNickname().val() != "") {
                _fetch.isValidUpdateVal(1, _el.txtNickname().val());
            }
        })

        _el.txtMobilePhone().on('focusout', function () {
            if (_el.txtMobilePhone().val() != "") {
                _fetch.isValidUpdateVal(2, _el.txtMobilePhone().val());
            }
        })

        _el.txtAcceptemail().on('focusout', function () {
            if (_el.txtAcceptemail().val() != "") {
                _fetch.isValidUpdateVal(3, _el.txtAcceptemail().val());
            }
        })

        _el.btnCancel().on('click', function () {
            popupClose(this);
        })

        _el.emailDomain().on('change', function () {
            const email = _el.txtAcceptemail().val().split('@');
            if ($(this).val() != 'direct') { //직접입력
                _el.txtAcceptemail().val(email[0] + '@' + $(this).val());
            }
        })

        _el.btnEdit().on('click', function () {
            _util.isValid();
        })
    }

    _fetch = {
        isValidUpdateVal: function (type, keyword) {
            $.ajax({
                type: 'get',
                url: '/member/valid',
                data: "type=" + type + "&keyword=" + keyword,
                async: false,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    switch (data) {
                        case -60001:
                            _el.spnUnableNickname().show();
                            _el.spnAbleNickname().hide();
                            _data.validNickname = false;
                            break;
                        case -60002:
                            _el.divValidMobilePhone().show();
                            _el.txtMobilePhone().addClass('error_focus');
                            _data.validMobilePhone = false;
                            break;
                        case -60003:
                            _el.divValidEmail().show();
                            _el.txtAcceptemail().addClass('error_focus');
                            _data.validEmail = false;
                            break;
                        case 1:
                            _el.spnUnableNickname().hide();
                            _el.spnAbleNickname().show();
                            _data.validNickname = true;
                            break;
                        case 2:
                            _el.divValidMobilePhone().hide();
                            _el.txtMobilePhone().removeClass('error_focus');
                            _data.validMobilePhone = true;
                            break;
                        case 3:
                            _el.divValidEmail().hide();
                            _el.txtAcceptemail().removeClass('error_focus');
                            _data.validEmail = true;
                            break;
                    }
                },
                error: function(e) {
                    console.log('다시 시도해주세요.');
                }
            })
        }
    }

    _init = function(args = {}) {
        _args = args;
        _eventHandle();
        _el.spnUnableNickname().hide();
        _el.spnAbleNickname().hide();
        _el.divValidMobilePhone().hide();
        _el.divValidEmail().hide();
    }
    return {
        init: _init,

    }
}(jQuery))
