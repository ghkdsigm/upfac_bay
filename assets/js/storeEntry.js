let StoreEntry = (function ($) {
    let _args;
    let _init;
    let _data;
    let _util;
    let _el;
    let _manipulateDom;
    let _eventHandle;
    let _fetch;

    _args = {step: 1}

    _data = {
        idMinLength: 4,
        regExpress: /^[a-zA-Z]([a-zA-Z0-9]){3,11}$/,
        isFamilySite: true,
        strAuthTelecom: '',
        strAuthMobilePhone: ''
    }

    _el = {
        divFamilyAgree: () => $('#divFamilyAgree'),
        divFamilyPersonAgree: () => $('#divFamilyPersonAgree'),
        btn_check: () => $('#btn_check'),
    }

    _util = {
        // 아이디 유효성 검사
        isValidID: function () {
            let message;
            let valid = true;
            let strMemberID = _el.txtMemberID().val();
            let args = {'vcMemberID': strMemberID};

            // 패밀리사이트 약관동의에 따른 유효성 검사 설정 변경
            _data.isFamilySite = (_el.divFamilyAgree().children('input[type=checkbox]').is(':checked') || _el.divFamilyPersonAgree().children('input[type=checkbox]').is(':checked'));
            if (_data.isFamilySite) {
                _data.idMinLength = 6;
                _data.regExpress = /^[a-zA-Z]([a-zA-Z0-9]){5,11}$/;
            }

            if (IbValidation.util.isValidBlank(strMemberID) || !_data.regExpress.test(strMemberID) || strMemberID.length > 12) {
                message = `첫 문자 영문, ${_data.idMinLength}~12자로 영문/숫자로 띄어쓰기 없이 입력하세요.`;
                valid = false;
            } else if (IbValidation.util.isValidNumberic(strMemberID.charAt(0))) {
                message = `ID 첫글자는 영문으로 입력해 주세요`;
                valid = false;
            }

            if (!valid) {
                IbPassword.manipulateDom.setDivAreaValid(_el.divAreaMemberID(), valid, true, message);
                return false;
            }

            // 고유 아이디
            _el.txtMemberID().data('flag', 1);
            let argsUniqueeID = {"vcMemberID": _el.txtMemberID().val()};
            _fetch.isUniqueeID(argsUniqueeID)
                .then(function (data) {
                    let iReturn = data.iReturn;
                    let isValid = false;
                    let message = '이미 사용중인 ID 입니다.';

                    if (iReturn === 5102) {
                        isValid = true;
                        message = '사용 가능한 아이디 입니다.';
                    }
                    IbPassword.manipulateDom.setDivAreaValid(_el.divAreaMemberID(), isValid, true, message);
                    _manipulateDom.activeBtnJoin();
                })
                .catch(function (data) {
                    _el.txtMemberID().data('flag', (valid) ? '1' : '0');
                    alert(data);
                });
        },
        setNumeric: function ($obj) {
            return $obj.val($obj.val().replace(/[^0-9\.]/g, ''));
        }
    }

    _manipulateDom = {


        test: function () {
            location.href = SERVERSURL + "/store/entry/type";
        }


    }

    // 이벤트 핸들러
    _eventHandle = function () {
        // 체크박스 전체 동의
        _el.inpChkAll().on("click", function () {
            const chk = _manipulateDom.getCheckName($(this));
            _manipulateDom.setChkBoxChange(chk.value, chk.name);
            _manipulateDom.setCheckMarketingSaleCoupon('clickAccessAll');
        });

        _el.btn_check().on("click", function () {
            alert("테스트중이야 이범배씨")
            _manipulateDom.test();
        });
    };

    // API 모음
    _fetch = {
        isUniqueeID: function (args) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: '/m/member/isUniqueeID',
                    type: 'POST',
                    data: args
                })
                    .done(function (data) {
                        resolve(data);
                    })
                    .fail(function () {
                        reject('오류가 발생했습니다.\n관리자에게 문의해 주십시오');
                    })
            });
        },
    };

    _init = function (args) {

    };

    // 클로저
    return {
        init: _init
    }
}(jQuery));