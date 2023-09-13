let UpPassword = (function($) {
    let _el;
    let _util;
    let _manipulateDom;

    _el = {
        txtPassword: () => $('#txtPassword'),
        divAreaPassword: () => $('#divAreaPassword'),
        divAreaSecurityPassword: () => $('#divAreaSecurityPassword'),
        txtPasswordConfirm: () => $('#txtPasswordConfirm'),
        divAreaSamePassWord: () => $('#divAreaSamePassWord'),
    }
    _util = {
        setValidPassword: function() {
            const str = _el.txtPassword().val();

            let combinationCnt = _util.isSpecialCharacter(str);
            let scoreSecurity = 0; //비밀번호 보안별 점수
            let message;
            let isValid = false;

            if (str.length < 8) {
                message = '8~20자의 영문/특문/숫자를 모두 조합하여 입력하세요.';
            } else if (str.length < 10 && combinationCnt != 3) {
                message = '8~20자의 영문/특문/숫자를 모두 조합하여 입력하세요.';
            } else if (str.length <= 20 && combinationCnt == 1) {
                message ='8~20자의 영문/특문/숫자를 모두 조합하여 입력하세요.';
            } else if (combinationCnt < 2) {
                message = '10~20자의 영문/특문/숫자로 2가지 이상을 조합하여 입력하세요.';
            } else if(IbValidation.util.isValidCharacter(str)){
                message = '지정된 특수문자 이외의 문자는 넣을 수 없습니다.';
            } else {
                isValid = true;
                scoreSecurity = IbValidation.util.setStrSecurityScore(str);
            }

            IbPassword.manipulateDom.setDivAreaValid(_el.divAreaPassword(), isValid, true, message);

            _el.divAreaSecurityPassword().data('flag', (isValid)? '1' : '0');

            IbValidation.manipulateDom.setSecurityDecor(_el.divAreaSecurityPassword(), scoreSecurity);
            _el.txtPasswordConfirm().keyup();

            return isValid;
        },

        setValidPasswordConfirm: function() {
            let strPassword = _el.txtPassword().val();
            let strPasswordConfirm = _el.txtPasswordConfirm().val();
            let isAreaExpress = (strPasswordConfirm.length > 0);
            let isObj = (strPassword === strPasswordConfirm);
            IbPassword.manipulateDom.setDivAreaValid(_el.divAreaSamePassWord(), isObj, isAreaExpress, "txtPasswordConfirm");
        },

        setPasswordInit: function() {
            _manipulateDom.setExpressDom(_el.divAreaPassword()); // 비밀번호 UI
            _manipulateDom.setExpressDom(_el.divAreaSecurityPassword()); // 비밀번호 UI
            _manipulateDom.setExpressDom(_el.divAreaSamePassWord()); // 비밀번호 확인 UI
        },

        isSpecialCharacter: function(str) {
            let score = 0;
            score += (str.match(/[`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?]/)) ? 1 : 0;
            score += (str.match(/([a-zA-Z])/)) ? 1 : 0;
            score += (str.match(/([0-9])/)) ? 1 : 0;
            return score;
        },

        getMinLength: function(str) {
            let score = _util.isSpecialCharacter(str);
            let minLength = (str.length < 8)? 8 : (score === 3) ? 8 : 10;
            return minLength;
        }
    };

    _manipulateDom = {
        setDivAreaValid: function($divArea, isObj, isAreaExpress, message) {
            // Step 1. DataFlag
            $divArea.data('flag', (isObj) ? '1' : '0');

            IbValidation.manipulateDom.setExpressDom($divArea, isAreaExpress);
            if(isAreaExpress){
                IbValidation.manipulateDom.setExpressDom($divArea.children('.color_raise'), !isObj);
                IbValidation.manipulateDom.setExpressDom($divArea.children('.color_positive'), isObj);
                if(message != '' && message !== "txtPasswordConfirm") $divArea.children('.color_raise').text(message);
            }

            if(message === "txtPasswordConfirm" && _el.txtPasswordConfirm().val().length === 0) {
                isObj = true;
            }

            // Step 2. 화면 데코
            let addClass = (isObj) ? '' : 'error';
            let removeClass = (isObj) ? 'error' : '';

            $divArea.prev().children().addClass(addClass);
            $divArea.prev().children().removeClass(removeClass);
        },

        setExpressDom: function($object, boolean){
            (boolean) ? $object.show() : $object.hide();
        },
    }

    // 클로저
    return {
        util : _util,
        manipulateDom : _manipulateDom
    }
})(jQuery);