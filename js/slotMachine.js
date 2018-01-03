function SlotMachine(startMoney){
	if(isNaN(startMoney)||startMoney<0)
		return new Error('startMoney is NAN or < 0');

	var _money=startMoney;
	var _lucky=false;

	this.getMoney=function () {
		return _money;
	}
	this.setMoney=function(number){
		_money= +number;
	}

	this.getLucky=function () {
		return _lucky;
	}
	this.setLucky=function(isLucky){
		_lucky=isLucky;
	}
}
SlotMachine.prototype.removeMoney = function(number){
	if(isNaN(number)||number<=0)
		return new Error('number is NAN or <= 0');
		if(number<=this.getMoney()){
			this.setMoney( this.getMoney()-number);
			return +number;
		}
};
SlotMachine.prototype.insertMoney = function(number){
	if(isNaN(number)||number<=0)
		return new Error('number is NAN or <= 0');
	this.setMoney(this.getMoney()+ parseInt(number));
};
SlotMachine.prototype.play = function(number){
	if(isNaN(number)||number<=0)
		return new Error('number is NAN or <= 0');
	var randNumber=[],
	winMoney=0;
	if(this.getLucky()){
		randNumber=[7,7,7];
	}
	else{
		for(var i=0;i<3;i++){
			randNumber[i]=(Math.random().toFixed(1)*10)%10;
			if(randNumber[i]>9)randNumber[i]=9;
		}
	}

	if(randNumber.toString()==[7,7,7].toString()){//win
		winMoney=this.removeMoney(+this.getMoney());
	}
	else if(randNumber[0]==randNumber[1]==randNumber[2]){
		winMoney=this.removeMoney(number*5);
	}
	else if(randNumber[0]==randNumber[1]||randNumber[1]==randNumber[2]||
		randNumber[0]==randNumber[2]){
		winMoney=this.removeMoney(number*2);
	}
	else{//lose
		winMoney= -number;
	}
	return {winMoney: +winMoney,randNumber:randNumber};
};
