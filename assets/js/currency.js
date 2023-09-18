Currency = {
    getToPrice: function (data, cipher) {
        var TempValue = data.toString();
        TempValue = TempValue.replace(/,/g, "");
        TempValue = parseInt(TempValue, 10);

        if (isNaN(TempValue))
            return data;

        TempValue = TempValue.toString();
        var iLength = TempValue.length;

        if (iLength < 4)
            return data;

        if (cipher == undefined)
            cipher = 3;

        cipher = Number(cipher);
        count = iLength / cipher;

        var slice = new Array();

        for (var i = 0; i < count; i++) {
            if (i * cipher >= iLength) break;
            slice[i] = TempValue.slice((i + 1) * -cipher, iLength - (i * cipher));
        }

        var revslice = slice.reverse();

        return revslice.join(',');
    },
    // input : -3300, +3000 output : -3,300, +3,000
    getToPricePlusMinus: function (data, isSignText, cipher) {
    	
    	var signText = '';
    	data = Number(data);
    	
    	if (isSignText) {
    		signText = '+';
    	}
    	
    	if (data < 0) {
    		data = data * -1;
    		signText = '-';
    	} else if (data == 0) {
    		if (isSignText) {
    			signText = '±';
        	}
    	}
    	
    	if (data == 0) {
    		return signText + data;
    	}
    	
        var TempValue = data.toString();
        TempValue = TempValue.replace(/,/g, "");
        TempValue = parseInt(TempValue, 10);

        if (isNaN(TempValue))
            return signText + data;

        TempValue = TempValue.toString();
        var iLength = TempValue.length;

        if (iLength < 4)
            return signText + data;

        if (cipher == undefined)
            cipher = 3;

        cipher = Number(cipher);
        count = iLength / cipher;

        var slice = new Array();

        for (var i = 0; i < count; i++) {
            if (i * cipher >= iLength) break;
            slice[i] = TempValue.slice((i + 1) * -cipher, iLength - (i * cipher));
        }

        var revslice = slice.reverse();

        return signText + revslice.join(',');
    },
    getOnlyNumeric: function (data) {
        var iLength = data.length;
        var TempValue = "";
        var ReturnValue = "";

        for (var i = 0; i < iLength; i++) {
            TempValue = data.charCodeAt(i);

            if ((TempValue > 47 || TempValue <= 31) && TempValue < 58)
                ReturnValue += String.fromCharCode(TempValue);
        }

        return ReturnValue;
    },
    getTradeMoney: function (data, blank) {
    	
    	data = parseInt(data);

        var price_unit = new Array("", "만", "억", "조", "경", "해", "시", "양", "구", "간", "정");
        var TradeMoney = Currency.GetOnlyNumeric($.trim(data.toString()));
        var moneyLength = TradeMoney.length;
        var blockCount = parseInt(moneyLength / 4, 10);
        var modCount = moneyLength % 4;

        if (modCount > 0) {
            blockCount++;
        }

        if (modCount == 0) {
            modCount = 4;
        }

        var result = "";
        var temp = "";

        for (var i = 0; i < blockCount; i++) {

            if (i == 0) {
                temp = TradeMoney.substr(0, modCount);
            } else {
                temp = TradeMoney.substr(modCount + (4 * (i - 1)), 4);
            }

            if (temp != "0000") {
                temp = parseInt(temp, 10) + "";

                if (temp.length == 4) {
                    temp = temp.substr(0, 1) + "," + temp.substr(1, 3);
                }

                temp += price_unit[blockCount - (i + 1)];

                if (blank) {
                    temp += " ";
                }

                result += temp;
            }
        }

        return result;
    },
    getToPriceDecimalPoint : function(data) {
        return data.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
    }
};