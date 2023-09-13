let UpValidation = (function($) {
    let _util;
    let _manipulateDom;

    _util = {
        isValidationLigal: function($obj) {
            let bln = false;
            const val = $obj.value;

            if (!_util.isValidBlank(val)) {
                arr = val.match(/(\w{3,10}@\w{3,10}\.\w{2,10})|([a-zA-Z0-9]{3,10}\.[a-zA-Z0-9]{3,10}\.[a-zA-Z]{2,10})|(\d{2,3}-\d{3,4}-\d{4})/ig);

                if (arr != null) {
                    // fnc_Validation_Select(obj, arr[0]);
                    IbCommon.utils.validationSelect(obj, arr[0]);
                } else {
                    bln = true;
                }
            }

            return bln;
        },

        delComma: function(strVal) {
            let MileageUsedPrice = "";
            for (let x = 0; x < strVal.length ; x++) {
                ch = strVal.substring(x,x+1);
                if (ch != ",") MileageUsedPrice += ch;
            }
            return MileageUsedPrice;
        },

        // 금액에 , 찍기
        getNumchk: function(num) {
            num = new String(num);
            num = num.replace(/,/gi, "");

            return _util.getNumchk1(num);
        },

        // 금액에 , 찍기
        getNumchk1: function(num) {
            let sign=  "";

            if (isNaN(num) || new String(num).indexOf(".") > -1) {
                alert("숫자만 입력할 수 있습니다.");

                if (document.forms[1].txtWantPrice != null) {
                    if (!isNaN(document.forms[1].txtWantPrice.value.replace(/,/gi,"")))	{
                        if (typeof(document.forms[1].HanWantQuantity)!="undefined") {
                            document.forms[1].HanWantQuantity.value = "";
                        }

                        if (typeof(document.forms[1].txtShortCmd)!="undefined") {
                            document.forms[1].txtShortCmd.value = "";
                        }
                    }
                }

                return "";
            }

            if (num == 0) {
                return num;
            }

            if (num < 0) {
                num = num * (-1);
                sign = "-";
            } else {
                num = num * 1;
            }

            num = new String(num);
            let temp = "";
            let pos = 3;
            let num_len = num.length;

            while (num_len > 0) {
                num_len=num_len-pos;

                if (num_len < 0) {
                    pos = num_len + pos;
                    num_len = 0;
                }

                temp = "," + num.substr(num_len,pos) + temp;
            }

            return sign + temp.substr(1);
        },

        getNumchkFrame: function(num,Frame) {
            num = new String(num);
            num = num.replace(/,/gi,"");

            return _util.getNumchk1Frame(num,Frame);
        },

        getNumchk1Frame: function(num,Frame) {
            let sign = "";

            if (isNaN(num) || new String(num).indexOf(".") > -1) {
                alert("숫자만 입력할 수 있습니다.");

                if (document.forms[Frame].txtWantPrice != null) {
                    if (!isNaN(document.forms[Frame].txtWantPrice.value.replace(/,/gi, "")))	{
                        if (typeof(document.forms[Frame].HanWantQuantity) != "undefined") {
                            document.forms[Frame].HanWantQuantity.value = "";
                        }

                        if (typeof(document.forms[1].txtShortCmd) != "undefined") {
                            document.forms[Frame].txtShortCmd.value = "";
                        }
                    }
                }

                return "";
            }

            if (num == 0) {
                return num;
            }

            if (num < 0) {
                num = num * (-1);
                sign = "-";
            } else {
                num = num * 1;
            }

            num = new String(num);
            var temp = "";
            var pos = 3;
            num_len = num.length;

            while (num_len > 0)	{
                num_len = num_len - pos;

                if (num_len < 0) {
                    pos = num_len + pos;
                    num_len = 0;
                }

                temp = "," + num.substr(num_len,pos) + temp;
            }

            return sign + temp.substr(1);
        },

        // 주민등록번호 유효성 검사
        isValidSSN: function(strSSN) {
            let val = strSSN;
            const regExt = /^\d{2}[0-1]\d{1}[0-3]\d{1}-[1-8]\d{6}$/;
            let bln = false;

            if (!_util.isValidBlank(val)) {
                if (regExt.test(val)) {
                    val = val.replace("-","");
                    let arr = new Array(2,3,4,5,6,7,8,9,2,3,4,5);
                    let sum = 0;

                    arr.forEach(index => {
                        sum += val.charAt(index) * arr[index];
                    });

                    bln = (((11 - (sum % 11)) % 10) === val.charAt(12));
                }

                if (!bln && _util.isValidForeignerSSN(strSSN.substring(0, 6) + strSSN.substring(7,14))) {
                    bln = true;
                }
            }
            return bln;
        },

        // 외국인 등록번호 유효성 검사
        isValidForeignerSSN: function(numForeigner) {
            let birthYear;
            let birthMonth;
            let birthDate;
            let birth;
            let sum;

            ((numForeigner.charAt(6) === "5") || (numForeigner.charAt(6) === "6")) ? birthYear = "19" :
                ((numForeigner.charAt(6) === "7") || (numForeigner.charAt(6) === "8")) ? birthYear = "20" :
                    ((numForeigner.charAt(6) === "9") || (numForeigner.charAt(6) === "0")) ? birthYear = "18" : birthYear = 0

            if (birthYear === 0) return;

            birthYear += numForeigner.substr(0, 2);
            birthMonth = numForeigner.substr(2, 2) - 1;
            birthDate = numForeigner.substr(4, 2);
            birth = new Date(birthYear, birthMonth, birthDate);

            if (birth.getYear() % 100 != numForeigner.substr(0, 2) || birth.getMonth() != birthMonth || birth.getDate() != birthDate) return false;

            sum = 0;

            if (Number(numForeigner.substr(7, 2)) % 2 != 0) return false;

            for (let i = 0; i < 12; i++) {
                sum += Number(numForeigner.substr(i, 1)) * ((i % 8) + 2);
            }

            return ((((11 - (sum % 11)) % 10 + 2) % 10) === Number(numForeigner.substr(12, 1)));
        },

        // 숫자값인지 유효성 검사
        isValidNumberic: function(strNum) {
            const regExp = /[^0-9]/;
            return (!_util.isValidBlank(strNum)) ? !regExp.test(strNum) : false
        },

        // 스페이스를 포함한 빈칸 검사
        isValidBlank: function(str) {
            const exp = /^\s*$/;
            return exp.test(str);
        },

        // 숫자가 포함되었는지 검사
        isValidIncludeNumeric: function(str) {
            const exp = /[0-9]/;
            return exp.test(str);
        },

        // 영문이 포함되었는지 검사
        isValidIncludeAlphabet: function(str) {
            const exp = /[a-zA-Z]/;
            return exp.test(str);
        },

        // 특수문자가 포함되었는지 검사
        isValidIncludeSpecialCharacter: function(str) {
            const exp = /[~!@#$%^&*()\-_=+\\|[{\]};:'",<.>/?^`]+/;
            return exp.test(str);
        },

        // 특수문자/영문/숫자 포함되었는지 검사
        isValidCharacter: function(str) {
            const exp = /[^a-zA-Z0-9`~!@#$%^&*()\-_=+\\|[{\]};:'",<.>/?]+/;
            return exp.test(str);
        },

        // 이메일 유효성 검사
        isValidEmail: function(str) {
            let exp=/^([\w-*]+(?:\.[\w-]+)*)@((?:\w+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return (str != '' && exp.test(str));
        },

        // 인증코드 유효성 검사
        isValidAuthCode: function(str) {
            let exp=/^[0-9A-Z]{6}$/;
            return (str != '' && exp.test(str));
        },

        // 휴대폰번호 유효성 검사
        isValidMobilePhone: function(str) {
            let exp = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
            return exp.test(str);
        },

        isValidWordNumberic: function(str) {
            //const regex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/;
            const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/;

            return regex.test(str);
        },

        // UpPassword 보안 점수 계산
        addPasswordScore: function(str) {
            let intPoint = 0;

            intPoint += (str.match(/[`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?]/)) ? 1 : 0;
            intPoint += (str.match(/([a-zA-Z])/)) ? 1 : 0;
            intPoint += (str.match(/([0-9])/)) ? 1 : 0;

            return intPoint;
        },

        setStrSecurityScore: function(str) {
            let score = 0;
            let log = "";

            if (str.length < 8) return;

            // 길이
            if (str.length < 9) {
                score = (score + 6);
                log = log + `6 points for length (${str.length}\n`;
            } else if (str.length > 8 && str.length < 13) {
                score = (score + 10);
                log = log + `10 points for length (${str.length}\n`;
            } else if (str.length > 12) {
                score = (score + 12);
                log = log + `12 points for length (${str.length}\n`;
            }

            // 소문자
            if (str.match(/[a-z]/)) {
                score = (score + 2);
                log = log + `2 point for at least one lower case char\n`;
            }

            // 대문자
            if (str.match(/[A-Z]/)) {
                score = (score + 5);
                log = log + `5 points for at least one upper case char\n`;
            }

            // 숫자 포함
            if (str.match(/\d+/)) {
                score = (score + 5);
                log = log + "5 points for at least one number\n";
            }

            // 숫자 3가지 포함
            if (str.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                score = (score + 5);
                log = log + "5 points for at least three numbers\n";
            }

            // 특수문자 포함
            if (str.match(/.[`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?]/)) {
                score = (score + 5);
                log = log + "5 points for at least one special char\n";
            }

            // 특수문자 2번 포함
            if (str.match(/(.*[`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?].*[`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?])/)) {
                score = (score + 5);
                log = log + "5 points for at least two special chars\n";
            }

            // 소문자+대문자 포함
            if (str.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                score = (score + 3);
                log = log + "3 combo points for upper and lower letters\n";
            }

            // 영문+숫자 포함
            if (str.match(/([a-zA-Z])/) && str.match(/([0-9])/)) {
                score = (score + 2);
                log = log + "2 combo points for letters and numbers\n";
            }

            //영문 + 특수문자
            if (str.match(/([a-zA-Z])/) && str.match(/([`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?])/)) {
                score = (score + 2);
                log = log + "2 combo points for letters and special characters\n";
            }

            // 특수문자 + 숫자
            if (str.match(/([`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?])/) && str.match(/([0-9])/)) {
                score = (score + 2);
                log = log + "2 combo points for special characters and numbers\n";
            }

            // 숫자 + 영문자 + 특수문자
            if (str.match(/\d+/) && str.match(/([a-zA-Z])/) && str.match(/([`,~,!,@,#,$,%,^,&,*,(,),\-,_,=,+,\\,|,[,{,\],},;,:,',",,,<,.,>,/,?])/)) {
                score = (score + 5);
                log = log + "3 combo points for letters And numbers and special chars\n";
            }
            return score;
        },

        setPriceUnit: function(money) {
            money = new String(money);

            var len = money.length;
            var strReturn = "";
            var strTemp = "";
            var strTemp2 = "";

            if (len > 16) {
                strReturn =  money - (parseInt(money / 10000000000000000)) * 10000000000000000;
                strTemp2 = strReturn;

                if (strReturn != money && strReturn != 0) {
                    strTemp = _util.getNumchkFrame(parseInt(money / 10000000000000000));
                    strReturn = strTemp + "경 ";
                    strTemp = _util.getNumchkFrame( parseInt(strTemp2 / 1000000000000));
                    strReturn = strReturn + strTemp + "조";
                } else {
                    strTemp = _util.getNumchkFrame(parseInt(money / 10000000000000000));
                    strReturn = strTemp + "경";
                }

            } else if (len > 12) {
                strReturn =  money - (parseInt(money / 1000000000000)) * 1000000000000;
                strTemp2 = strReturn;

                if (strReturn != money && strReturn != 0) {
                    strTemp = _util.getNumchkFrame(parseInt(money / 1000000000000));
                    strReturn = strTemp + "조 ";
                    strTemp = _util.getNumchkFrame( parseInt(strTemp2 / 100000000));
                    strReturn = strReturn + strTemp + "억";
                } else {
                    strTemp = _util.getNumchkFrame(parseInt(money / 1000000000000));
                    strReturn = strTemp + "조";
                }

            } else if (len > 8) {
                strReturn =  money - (parseInt(money / 100000000)) * 100000000;
                strTemp2 = strReturn;

                if (strReturn != money && strReturn != 0) {
                    strTemp = _util.getNumchkFrame(parseInt(money / 100000000));
                    strReturn = strTemp + "억 ";
                    strTemp = _util.getNumchkFrame( parseInt(strTemp2 / 10000));
                    strReturn = strReturn + strTemp + "만";
                } else {
                    strTemp = _util.getNumchkFrame(parseInt(money / 100000000));
                    strReturn = strTemp + "억";
                }
            } else if( len > 4) {
                strReturn = money - (parseInt(money / 10000)) * 10000;
                strTemp2 = strReturn;

                if (strReturn != money && strReturn != 0) {
                    strTemp = _util.getNumchkFrame(parseInt(money / 10000));
                    strReturn = strTemp + "만 ";
                    strTemp = _util.getNumchkFrame(parseInt(strTemp2 / 1));
                    strReturn = strReturn + strTemp;
                } else {
                    strTemp = _util.getNumchkFrame(parseInt(money / 10000));
                    strReturn = strTemp + "만";
                }
            } else {
                strReturn = _util.getNumchkFrame(money);
            }

            return strReturn ;
        },

        isIncludeHome: function(strContact) {
            let arr = ["0303","0502","0503","0504","0505","0506","0507","0508","0509","0707"];
            return arr.indexOf(strContact.substring(0,4)) > -1;
        },
        
        setSplitContact: function(flag, strContact) {
            let arr = [];
            if(flag == "M"){ //휴대전화
                if(strContact.length == 10){
                    arr[0] = strContact.substring(0,3);
                    arr[1] = strContact.substring(3,6);
                    arr[2] = strContact.substring(6,10);
                }else{
                    arr[0] = strContact.substring(0,3);
                    arr[1] = strContact.substring(3,7);
                    arr[2] = strContact.substring(7,11);
                }
            }else{ //자택, 집전화
                if(strContact.length == 9){
                    arr[0] = strContact.substring(0,2);
                    arr[1] = strContact.substring(2,5);
                    arr[2] = strContact.substring(5,9);
                }else if(strContact.length == 10){
                    if(strContact.substring(0,2)=="02"){
                        arr[0] = strContact.substring(0,2);
                        arr[1] = strContact.substring(2,6);
                        arr[2] = strContact.substring(6,10);
                    }else{
                        arr[0] = strContact.substring(0,3);
                        arr[1] = strContact.substring(3,6);
                        arr[2] = strContact.substring(6,10);
                    }
                }else if(strContact.length == 11){
                    if(_util.isIncludeHome(strContact)){
                        arr[0] = strContact.substring(0,4);
                        arr[1] = strContact.substring(4,7);
                        arr[2] = strContact.substring(7,11);
                    }else{
                        arr[0] = strContact.substring(0,3);
                        arr[1] = strContact.substring(3,7);
                        arr[2] = strContact.substring(7,11);
                    }
                }else if(strContact.length == 12){
                    arr[0] = strContact.substring(0,4);
                    arr[1] = strContact.substring(4,8);
                    arr[2] = strContact.substring(8,12);
                }
            }
            return arr;
        },

        getNumberOfByte: function($el) {
            let byte = 0;
            for (let idx=0; idx < $el.val().length; idx++) {
                let char = escape($el.val().charAt(idx));
                if (char.length === 1) {
                    byte ++;
                } else if (char.indexOf("%u") !== -1) {
                    byte += 2;
                } else if (char.indexOf("%") !== -1) {
                    byte ++;
                }
            }
            return byte;
        }
    };

    _manipulateDom = {
        setExpressDom: function($object, boolean){
            (boolean) ? $object.show() : $object.hide();
        },

        // 보안 영역 데코
        setSecurityDecor($sObj, score){
            let isSobj = false;
            let isDanger = false;
            let isNormal = false;
            let isSafety = false;

            if(score > 0) {
                isSobj = true;
                (score < 25) ? (isDanger = true) :
                    (score > 24 && score < 35) ? (isNormal = true) :
                        isSafety = true;
            }

            _manipulateDom.setExpressDom($sObj.children('.normal'), isNormal);
            _manipulateDom.setExpressDom($sObj.children('.danger'), isDanger);
            _manipulateDom.setExpressDom($sObj.children('.safety'), isSafety);
            _manipulateDom.setExpressDom($sObj, isSobj);
        }

    }

    // 클로저
    return {
        util : _util,
        manipulateDom : _manipulateDom
    }
})(jQuery);