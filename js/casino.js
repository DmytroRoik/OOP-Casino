function Casino(countSlotM,startMoney){
	var _money=startMoney;
	var _slotMachines=[];

	var avgMoney;
	for (var i = countSlotM-1; i > 0; i--) {
		avgMoney = (startMoney/countSlotM).toFixed()-1;
		_slotMachines[i]=new SlotMachine(avgMoney);
	}
	_slotMachines[0]=new SlotMachine(startMoney-(countSlotM-1)*avgMoney);

	this.getMoney=function(){return _money;}
	this.setMoney=function(number){
		 _money=number;
	}
	this.getCountSlotMachine=function(){return _slotMachines.length;}
	this.getSlotMachines=function(){return _slotMachines;}
}

Casino.prototype.addNewSlot = function() {
	var bigestSum=0;
	var bigestSlot;
		for(var el of this.getSlotMachines()){
			if(el.getMoney()>bigestSum){
				bigestSum=el.getMoney();
				bigestSlot=el;
			}
		}
	var temp=bigestSlot.removeMoney((bigestSum/2).toFixed());
	this.getSlotMachines().push(new SlotMachine(bigestSum-temp));
};
Casino.prototype.removeSlot = function(number) {
	if(this.getCountSlotMachine()==1)throw new Error("You can`t delete last slot");
	var sum=this.getSlotMachines()[number-1].getMoney();
	this.getSlotMachines().splice(number-1,1);
	var avgSum=(sum/this.getCountSlotMachine()).toFixed();
	for (var i = this.getSlotMachines().length - 1; i > 0; i--) {
		this.getSlotMachines()[i].insertMoney(avgSum);
		sum-=avgSum;
	}
	this.getSlotMachines()[0].insertMoney(sum);
};
Casino.prototype.RemoveMoney = function(number) {
	if(number>=this.getMoney())return new Error('casino don`t have this money');
	else{
		var sortSlots = this.getSlotMachines().sort(function(a,b){
			if(a.getMoney()<b.getMoney())return -1;
			else if(a.getMoney()>b.getMoney()) return 1;
			else return 0;

		});
		console.log(sortSlots[sortSlots.length-1].getMoney(),sortSlots[0].getMoney());
		var sum=number;
		for(var i=sortSlots.length-1;i>=0;i--){
			if(sortSlots[i].getMoney()<=sum){
				sum-= sortSlots[i].removeMoney(sortSlots[i].getMoney());
			}
			else {
				sum-= sortSlots[i].removeMoney(sum);
				break;
			}
		}
		this.setMoney(this.getMoney()-number);
	}
};

