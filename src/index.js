function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    //Удаляем пробелы в строке
    expr = expr.replace(/\s+/g, "");
    //Проверяем скобки на парность
    if (expr.split('(').length != expr.split(')').length) throw new Error('ExpressionError: Brackets must be paired');
    //Задаём стек для чисел
    let stackForNumber = [];  
    let stackForOper = [];
    //Распарсиваем строку на массив чисел, операторов и скобок
    let exprParse =[];
    let char = "";
    for(let i = 0; i < expr.length; i++) {
        if(!isNaN(expr[i])) {
          char += expr[i];
        } else {
            if(char.length != 0) {
                exprParse.push(char);
                }
          exprParse.push(expr[i]);
          char = "";
          continue;
        }
    }
      
    if(exprParse[exprParse.length - 1] !== expr[expr.length - 1]) {
        exprParse.push(char);
    }
    //Здааём приоритет операторам
    let priority = {                                                                           
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
      "(": 0
    } 
    //Функция для вычисления входимых значений
    function calculation(a, oper, b) {
        //Если деление на ноль, то выдаём ошибку                                                          
        if(oper == "/" && b == "0") throw new Error("TypeError: Division by zero.");              
        //Ищем соответствие оператора и производим вычисление
        switch(oper) {                                                                         
            case "+": return +a + +b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return a / b;
        }
    }
    //Проходим по всему массиву пока exprParse и stackForOper есть токены
    while(exprParse.length !== 0 || stackForOper.length !== 0) {
        //получаем первый элемент exprParse
      let token = exprParse[0];
        //если первый элемент exprParse число, то добавляем его в стек с числами
      if(!isNaN(token)) {
        stackForNumber.push(token);
        exprParse.shift();
        /*если стек операторов пустой и токен не число или приоритет
        токена входящего в стек токена больше чем приоритет имеющегося токена в стеке
        или токе равен открывающей скобке, то добавляем токен в стек операторов*/
      } else if(stackForOper.length === 0 && isNaN(token) || priority[token] > priority[stackForOper[stackForOper.length - 1]] || token == "(") {
        stackForOper.push(token);
        exprParse.shift();
        /*если приоритет входящего токена ниже, чем приоритет
        последнего токена в стеке или  или равен ему, то производим вычисления между двумя
        последними числами в стеке чисел и последним оператором в стеке операторов*/
      } else if(priority[token] < priority[stackForOper[stackForOper.length - 1]] || priority[token] === priority[stackForOper[stackForOper.length - 1]]) {
        let oper = stackForOper.pop();
        let a = stackForNumber[stackForNumber.length - 2];
        let b = stackForNumber[stackForNumber.length - 1];
        let result = calculation(a, oper, b);
        stackForNumber.splice(stackForNumber.length - 2, stackForNumber.length, result);
        /*Если входящий токен закрывающая скобка, то удаляем его и производим
        вычисления между числами в стеке чисел и операторами в стеке операторов вплоть
        до нахождения открывающей скобки и удаляем откр скобку*/
      } else if(token == ")") {
        exprParse.shift();
        while(stackForOper[stackForOper.length - 1] !== "(") {
          let oper = stackForOper.pop();
          let a = stackForNumber[stackForNumber.length - 2];
          let b = stackForNumber[stackForNumber.length - 1];
          let result = calculation(a, oper, b);
          stackForNumber.splice(stackForNumber.length - 2, stackForNumber.length, result);
        }
        stackForOper.pop();   
        /*Если в распарсеной строке не осталось токенов, то проводим вычисления над оставшимися
        числами и операторами в стеках*/  
      } else if(exprParse.length == 0) {
        while(stackForOper.length !== 0) {
          let oper = stackForOper.pop();
          let a = stackForNumber[stackForNumber.length - 2];
          let b = stackForNumber[stackForNumber.length - 1];
          let result = calculation(a, oper, b);
          stackForNumber.splice(stackForNumber.length - 2, stackForNumber.length - 1, result);
        }
      }
    }

    return +stackForNumber[0].toFixed(4);
  }

module.exports = {
    expressionCalculator
}