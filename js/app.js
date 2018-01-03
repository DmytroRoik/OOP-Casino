var user={
	money: 1000,
	insertMoneyIntoSlot: function (slot,money) {
		this.money-= +money;
		slot.insertMoney(money);
	},
	takeWinMoney: function (money) {
		if(money>0)	this.money+= +money;
	}
}
var casino= new Casino(5,1000);
var currentSlotMachine=null;
var currentSlotIndex=null;
var userBet=0;

var $sectionSlots=document.getElementById('slots');
var $modalWindow= document.getElementById('modalWindow');
var $modalBtnPlay=$modalWindow.querySelector('button.btnPlay');
var $inputUserBet=document.getElementById('inpUserMoney');
var $btnInsertMoneyForm=document.getElementById('usersBet');
var $btnCloseModalWindow=$modalWindow.getElementsByClassName('btnClose')[0];

var init=(function(){
	//events
	$inputUserBet.addEventListener('focus',function(){
		this.setAttribute('max', user.money);
	});
	$btnInsertMoneyForm.addEventListener('submit',function () {
		event.preventDefault();
		userBet += parseInt($inputUserBet.value);
		user.insertMoneyIntoSlot(currentSlotMachine,parseInt($inputUserBet.value));
		$modalBtnPlay.disabled=false;
		$inputUserBet.value=1;

		updateCurrentSlotMoney();

	});
	$modalBtnPlay.addEventListener('click',function () {
		this.disabled=true;
		startRuletka(userBet);
		userBet=0;
		updateCurrentSlotMoney();
	});
	$btnCloseModalWindow.addEventListener('click', function () {
		console.log(this);
		$modalWindow.classList.add('hidden');
	});

})();
updateSlots();
function createSlotMachineTemplate (slotMachine,index) {
	var $divSlot= document.createElement('div');
	$divSlot.classList.add('slotMachine');
	if(slotMachine.getLucky())$divSlot.classList.add('lucky');
	var $header=document.createElement('h2');
	$header.innerText="Slot № "+ index;
	var $headerMoneyCount=document.createElement('h4');
	$headerMoneyCount.innerText="Money: "+slotMachine.getMoney();
	var $btnPlay=document.createElement('button');
	$btnPlay.innerText="Choose";
	$btnPlay.classList.add('btn-pulse');
	$btnPlay.addEventListener('click',function(){
		chooseSlotMachine(slotMachine,index)
		$modalWindow.classList.remove('hidden');
	});
	$btnDestroy=document.createElement('button');
	$btnDestroy.innerText='Delete';
	$btnDestroy.addEventListener('click',function(){
		casino.removeSlot(index);
		updateSlots();

		$modalWindow.classList.add('hidden');
	});

	$divSlot.append($header,$headerMoneyCount,$btnPlay,$btnDestroy);

	return $divSlot;
}

function chooseSlotMachine(slotMachine,index){
	currentSlotMachine=slotMachine;
	var $spans=$modalWindow.querySelectorAll('span');
	$spans[0].innerText=index;
	$spans[1].innerText=slotMachine.getMoney();
	$spans[2].innerText=userBet;
	currentSlotIndex=index;
}

function startRuletka (userMoney) {
	var ruletka=$modalWindow.querySelectorAll('.slots .slotNumber');
	var result = currentSlotMachine.play(userMoney);

	ruletka[0].innerHTML=result.randNumber[0];
	ruletka[1].innerHTML=result.randNumber[1];
	ruletka[2].innerHTML=result.randNumber[2];

	user.takeWinMoney(result.winMoney);
	updateCurrentSlotMoney();
}
function updateSlots() {
	var $slotsContainer=document.getElementById('slots');
	$slotsContainer.innerHTML='';
	for (var i = 0; i< casino.getSlotMachines().length;i++) {
		var el=casino.getSlotMachines()[i];
		if(el!=null){
			$slotsContainer.append(createSlotMachineTemplate(el,i+1));
		}
	}
}
function updateCurrentSlotMoney(){
	var $spans=$modalWindow.querySelectorAll('span');
	$spans[1].innerHTML=''+currentSlotMachine.getMoney();
	$spans[2].innerHTML=''+parseInt(userBet);
	var curSlot=document.querySelector('.slotMachine:nth-child('+currentSlotIndex+')');
	curSlot.getElementsByTagName('h4')[0].innerText="Money: "+currentSlotMachine.getMoney();
}
function addSlot(){
	casino.addNewSlot();
	updateSlots();
	updateCurrentSlotMoney();
}
