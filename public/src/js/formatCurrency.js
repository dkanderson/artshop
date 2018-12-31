Handlebars.registerHelper('formatCurrency', (number) => {

    let value = undefined;

    if (typeof number === 'string') {

        value = number.replace(/,/g, '');

    } else {

        value = number.toString(10).replace(/,/g, '');
    }

    var result = '';
    var valueArray = value.split('');
    var resultArray = [];
    var counter = 0;
    var temp = '';
    for (let i = valueArray.length - 1; i >= 0; i--) {
        temp += valueArray[i];
        counter += 1;
        if (counter === 3) {
            resultArray.push(temp);
            counter = 0;
            temp = '';
        }
    }

    if (counter > 0) {
        resultArray.push(temp);
    }

    for (let i = resultArray.length - 1; i >= 0; i--) {
        var resTemp = resultArray[i].split('');
        for (let j = resTemp.length - 1; j >= 0; j--) {
            result += resTemp[j];
        }
        if (i > 0) {
            result += ',';
        }
    }


    return `$${result}.00`;
});