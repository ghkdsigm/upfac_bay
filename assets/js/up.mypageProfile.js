let UpMypageProfile = (function($) {
    let _init;
    let _el;
    let _data;
    let _util;
    let _manipulateDom;
    let _eventHandle;
    let _fetch;

    //  private 내부 변수
    _data = {
        sellerMode: false,
        couponCount : 0,
        pointAmount : 0,
        sellCount : 0,
        calcAmount : 0,

    };

    // 엘레멘트 요소
    _el = {
        switchMemberMode : () => $('#switchMemberMode'),
        btnEditProfile : () => $('#btnEditProfile'),
        sellCountWrap : () => $('#sellCountWrap'),
        calcAmountWrap : () => $('#calcAmountWrap'),
        editProfilePWConfirm : () => $('#editProfilePWConfirm'),
        txtEditProfilePW : () => $('#txtEditProfilePW'),
        btnEditProfilePWConfirm : () => $('#btnEditProfilePWConfirm'),
    };

    // UTIL형 함수
    _util = {
        isValidPW: () => {
            const strPassword = $.trim(_el.txtEditProfilePW().val());

            // 비밀번호 validation 체크
            if (strPassword === '') {
                alert('비밀번호를 입력하세요.');
                _el.signupPassword().focus();
                return false;
            }

            _fetch.getEditProfilePWConfirm(strPassword);
        }
    };

    // 돔 조작이벤트
    _manipulateDom = {
        setFormByMode: () => {
            if(_data.sellerMode == 'true') {
                const now = new Date();
                const currentMonth = now.getMonth()+1;
                now.setMonth(now.getMonth()-1);
                const lastMonth = now.getMonth()+1;

                _el.sellCountWrap().prepend(lastMonth);
                _el.calcAmountWrap().prepend(currentMonth);
            }
        },

        switchMemberMode: () => {
            if(_data.sellerMode == 'true') {
                location.href = "/mypage/buyer/recent/main";
            } else {
                location.href = "/mypage/seller/regist-item/main";
            }
        }
    };

    // 이벤트 핸들러
    _eventHandle = {
        init: () => {
            _manipulateDom.setFormByMode();

            // 판매자모드 전환 스위치
            _el.switchMemberMode().on('click', () => {
                _manipulateDom.switchMemberMode()
            })

            // 프로필 수정
            _el.btnEditProfile().on('click', () => {
                _el.editProfilePWConfirm().show();
            })

            _el.btnEditProfilePWConfirm().on('click', () => {
                _util.isValidPW();
            })
        }
    }

    _fetch = {
        getEditProfilePWConfirm: (strPassword) => {
            $.ajax({
                url: '/mypage/password/confirm',
                type: "POST",
                data: {'password': strPassword},
                dataType: "JSON",
                async: false,
                cache: false,
                success: function (data) {
                    if (data.code === '200') {
                        alert('비밀번호가 확인되었습니다.\n회원 정보 수정 페이지로 이동합니다.');
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
        _data.sellerMode = args.sellerMode;

        _eventHandle.init();
    }

    // 클로저
    return {
        init : _init
    }
}(jQuery));