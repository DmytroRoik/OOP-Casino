var user = {
    money: 0,
    isMoneyInsertedToSlot: function(slot, money) {
        if (this.money - money < 0) return false;
        this.money -= +money;
        slot.insertMoney(money);
        return true;
    },
    takeWinMoney: function(money) {
        if (money > 0) this.money += +money;
    }
}

var casino = null;
var currentSlotMachine = null;
var currentSlotIndex = null;
var userBet = 0;
var userWin = 0;
var slotStep = 3;
var curIndex = 0;

var $sectionSlots = document.getElementById('slots');
var $modalWindow = document.getElementById('modalWindow');
var $modalBtnPlay = $modalWindow.querySelector('button.btnPlay');
var $inputUserBet = document.getElementById('inpUserMoney');
var $btnInsertMoneyForm = document.getElementById('usersBet');
var $btnCloseModalWindow = $modalWindow.getElementsByClassName('btnClose')[0];
var $slotsSection = document.getElementsByClassName('divslotContainer')[0].parentElement;


var init = (function() {
    //events
    $inputUserBet.addEventListener('focus', function() {
        if (user.money > 1) {
            this.disabled = false;
            this.setAttribute('max', user.money);
        } else this.disabled = true;
    });
    $btnInsertMoneyForm.addEventListener('submit', function() {
        event.preventDefault();
        userBet += parseInt($inputUserBet.value);
        if (user.isMoneyInsertedToSlot(currentSlotMachine, parseInt($inputUserBet.value))) {
            $modalBtnPlay.disabled = false;
            updateModalWindow();
        }

    });
    $modalBtnPlay.addEventListener('click', function() {
        this.disabled = true;
        startRuletka(userBet);
        userBet = 0;
    });
    $btnCloseModalWindow.addEventListener('click', function() {
        $modalWindow.classList.add('hidden');
    });

})();

function createCasino() {
    var errors = [];
    var countSlots = document.getElementById('inputCasinoSlots').value;
    var casinoMoney = document.getElementById('inputCasinoMoney').value;
    if (!isNumberValid(casinoMoney)) {
        errors.push('casino money');
    } else if (!isNumberValid(countSlots)) {
        errors.push('count of slots');
    }
    if (+countSlots >= +casinoMoney) {
        errors.push("Slots are more than money");
    }
    if (errors.length == 0) {
        casino = new Casino(countSlots, casinoMoney);
        curIndex = 0;
        rebuildSlotSection();
        $slotsSection.classList.remove('hidden')
    } else alert('Some values (' + errors.join(',') + ') are incorrect');
    rebuildSlotSection();
}

function createPlayer() {
    var playerMoney = document.getElementById('inputPlayerMoney').value;
    if (!isNumberValid(playerMoney)) {
        alert('Player`s money is incorrect');
    } else user.money = playerMoney;

}

function nextSlots() {
    curIndex += slotStep;
    showFewSlots(curIndex, slotStep);
}

function prevSlots() {
    if (curIndex - slotStep >= 0) curIndex -= slotStep;
    else curIndex = casino.getSlotMachines().length - slotStep;
    showFewSlots(curIndex, slotStep);
}

function showFewSlots(index, count) {
    var $slots = document.getElementsByClassName('slotMachine');
    if (index >= $slots.length) index = curIndex = 0;
    for ($el of $slots) {
        $el.classList.add('hidden');
    }
    for (let i = index; i < index + count; i++) {
        if ($slots[i]) {
            $slots[i].classList.remove('hidden');
        }
    }
}

function isNumberValid(number) {
    if (number.length == 0) return false;
    for (let i = 0; i < number.length; i++) {
        if (!/^[0-9]/.test(number[i])) return false;
    }
    return true;
}

function createSlotMachineTemplate(slotMachine, index) {
    var $divSlot = document.createElement('div');
    $divSlot.classList.add('slotMachine');

    if (slotMachine.getLucky()) $divSlot.classList.add('lucky');
    var $header = document.createElement('h2');
    $header.innerText = "Slot № " + index;
    var $headerMoneyCount = document.createElement('h4');
    $headerMoneyCount.innerText = "Money: " + slotMachine.getMoney();
    var $btnPlay = document.createElement('button');
    $btnPlay.innerText = "Play";
    $btnPlay.classList.add('btn-pulse');
    $btnPlay.addEventListener('click', function() {
        if (user.money <= 0) {
            alert('You have create new User(Insert player money)');
            return;
        }
        chooseSlotMachine(slotMachine, index);
        updateModalWindow();
        $modalWindow.classList.remove('hidden');
    });
    $btnDestroy = document.createElement('button');
    $btnDestroy.innerText = 'Delete';
    $btnDestroy.addEventListener('click', function() {
        casino.removeSlot(index);
        rebuildSlotSection();
        updateHeaderInfo();
        $modalWindow.classList.add('hidden');
    });
    $divSlot.append($header, $headerMoneyCount, $btnPlay, $btnDestroy);
    return $divSlot;
}

function chooseSlotMachine(slotMachine, index) {
    $modalWindow.querySelector('.info-win').classList.add('hidden');
    var $slot = $modalWindow.querySelectorAll('.slots .slotNumber');
    for (var i = 0; i < $slot.length; i++) {
        var posY = Math.floor(Math.random() * (11)) * 80;
        $slot[i].style.backgroundPositionY = posY + 'px';
    }
    currentSlotMachine = slotMachine;
    var CasinoInfoSpans = $modalWindow.querySelectorAll('span');
    CasinoInfoSpans[0].innerText = index;
    CasinoInfoSpans[1].innerText = slotMachine.getMoney();
    CasinoInfoSpans[2].innerText = userBet;
    CasinoInfoSpans[5].innerText = user.money;
    currentSlotIndex = index;
}

function startRuletka(userMoney) {
    var ruletka = $modalWindow.querySelectorAll('.slots .slotNumber');
    var result = currentSlotMachine.play(userMoney);
    $modalWindow.querySelector('.info-win').classList.add('hidden');

    rotateNumber(0, result.randNumber[0]);
    rotateNumber(1, result.randNumber[1]);
    rotateNumber(2, result.randNumber[2]);
    user.takeWinMoney(result.winMoney);
    userWin = result.winMoney;
    setTimeout(function() {
        if (userWin > 0) showWinLoseMessage(true);
        else showWinLoseMessage(false);
        updateModalWindow();
        updateHeaderInfo();
    }, 1500);
}

function rebuildSlotSection() { //rebuild slot section
    var $slotsSection = document.getElementById('slots');
    $slotsSection.innerHTML = '';
    for (var i = 0; i < casino.getSlotMachines().length; i++) {
        var el = casino.getSlotMachines()[i];
        if (el) {
            $slotsSection.append(createSlotMachineTemplate(el, i + 1));
        }
    }
    showFewSlots(curIndex, slotStep);
}

function updateModalWindow() {
    var $CasinoInfoSpans = $modalWindow.querySelectorAll('span');
    $CasinoInfoSpans[1].innerHTML = '' + currentSlotMachine.getMoney();
    $CasinoInfoSpans[2].innerHTML = '' + parseInt(userBet);
    var curSlot = document.querySelector('.slotMachine:nth-child(' + currentSlotIndex + ')');
    curSlot.getElementsByTagName('h4')[0].innerText = "Money: " + currentSlotMachine.getMoney();
    $CasinoInfoSpans[5].innerHTML = '' + user.money;
    $inputUserBet.disabled = false;
}

function updateHeaderInfo(argument) {
    var $inputs = document.querySelectorAll('header input[type=number]');
    $inputs[0].value = casino.getMoney();
    $inputs[1].value = casino.getCountSlotMachine();
    $inputs[3].value = user.money;
}

function addSlot() {
    casino.addNewSlot();
    rebuildSlotSection();
    updateHeaderInfo();
}

function rotateNumber(slotNumber, winNumber) {
    var $slot = $modalWindow.querySelectorAll('.slots .slotNumber');
    var countOfRotation = Math.floor(Math.random() * (9 - 4) + 3) * 3; //[9,2]

    var curPosY = 0;
    var timer = setInterval(function() {

        $slot[slotNumber].style.backgroundPositionY = curPosY + 'px';
        curPosY -= 40;

        if (--countOfRotation < 0) {
            curPosY = (10 - winNumber) * 80 - 5;
            $slot[slotNumber].style.backgroundPositionY = curPosY + 'px';
            clearInterval(timer);
        }
    }, 40);
}

function showWinLoseMessage(isWin) {
    var $tablo = $modalWindow.querySelectorAll('.info-win h2 span');
    if (isWin) {
        $tablo[0].innerHTML = 'You win!!!';
        $tablo[1].innerHTML = '' + userWin + ' $';
    } else {
        $tablo[0].innerHTML = 'You lose!!!';
        $tablo[1].innerHTML = '' + userWin + ' $';
    }
    $modalWindow.querySelector('.info-win').classList.remove('hidden');
}

function removeMoney() {
    var value = document.getElementById('inputRemoveCasinoMoney').value;
    if (isNumberValid(value) && casino) {
        if (+value > casino.getMoney()) alert('Remove money is so big');
        else casino.removeMoney(value);
    } else {
        alert('money value is incorrect or casino doesn`t create');
    }
    updateHeaderInfo();
    rebuildSlotSection();
}