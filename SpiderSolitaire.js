var game = {
    score: 1000,
    data: [],
    cards: 52,
    selectCard: null,
    hoverCard: null,
    hoverCol: null,
    boundCards: [],
    offsetX: 0, 
    offsetY: 0, 
    isDragging: false,
    cardset: [
        //四套牌
        ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    ],
    cardlist: ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'],
    start: async function() {
        this.data = [
            //初始一行
            ['0'], ['0'], ['0'], ['0'], ['0'], ['0'], ['0'], ['0'], ['0'], ['0']
        ];
        //发牌
        while(this.cards) {
            this.randomCard();
        }
        //刷新牌面
        await this.refreshCard();
        //添加鼠标经过事件
        this.addOverEvent();
        //同步分数
        this.updateScore();
        document.addEventListener('mousemove', (e) => {
            //if(this.selectCard&&this.hoverCard) console.log(this.selectCard.id + " | " + this.hoverCard.id);
            
            if (this.isDragging) {
                var x = e.clientX - this.offsetX;
                var y = e.clientY - this.offsetY;

                if((this.boundCards) != 0) {
                    //console.log(this.boundCards);
                    for(i = 0; i < this.boundCards.length; i++) {
                        this.boundCards[i].style.width = '9.025%';
                        this.boundCards[i].style.left = x + 'px';
                        this.boundCards[i].style.top = (y + i * 20) + 'px';
                        this.boundCards[i].setAttribute("class", "card card-drag");
                    }
                }
                else {
                    this.selectCard.style.width = '9.025%';
                    this.selectCard.style.left = x + 'px';
                    this.selectCard.style.top = y + 'px';
                    this.selectCard.setAttribute("class", "card card-drag");
                }
            }
        });
        
        document.addEventListener('mouseup', () => {
            let canDrop = this.hoverCard && this.checkDrop(this.selectCard, this.hoverCard);
            if(this.boundCards != 0 && canDrop) {
                this.score--;
                this.updateScore();
                this.dropMutiCard();
            }
            else if(this.boundCards != 0 && !canDrop) {
                this.isDragging = false;
                for(i = 0; i < this.boundCards.length; i++) {
                    this.boundCards[i].style.position = '';
                    this.boundCards[i].style.width = '';
                    this.boundCards[i].setAttribute("class", "card");
                }
                let hoverColID = this.hoverCol.id.slice(2);
                if(this.data[Number(hoverColID)].length == 1) {
                    this.score--;
                    this.updateScore();
                    this.dropMutiCard(1);
                }
            }
            else {
                //空列
                let hoverColID = this.hoverCol.id.slice(2);
                let bDropEmpty = 0;
                if(this.hoverCol) {
                    bDropEmpty = this.data[Number(hoverColID)].length == 1;
                }
                if(canDrop || bDropEmpty) {
                    this.score--;
                    this.updateScore();
                    let oldLocation = this.selectCard.id.slice(1);
                    let oldCol = Number(oldLocation.slice(0, 1));
                    let oldRow = Number(oldLocation.slice(1));
                    this.data[oldCol].splice(-2, 1);
    
                    document.getElementById('co' + oldCol).removeChild(document.getElementById(this.selectCard.id));
    
                    if(bDropEmpty) {
                        let newCol = this.hoverCol.id.slice(2);
                        let newRow = i;

                        this.selectCard.setAttribute("id", "c" + newCol + Number(newRow));
                        this.data[newCol].splice(-1, 0, this.selectCard.innerText);

                        document.getElementById('co' + newCol).appendChild(this.selectCard);
                    }
                    else {
                        let newLocation = this.hoverCard.id.slice(1);
                        let newCol = Number(newLocation.slice(0, 1));
                        let newRow = Number(newLocation.slice(1)) + 1;
                        this.selectCard.setAttribute("id", "c" + newCol + Number(newRow));
                        this.data[newCol].splice(-1, 0, this.selectCard.innerText);

                        document.getElementById('co' + newCol).appendChild(this.selectCard);
                    }

    
                    if(oldRow > 0) {
                        document.getElementById('c' + oldCol + (oldRow - 1)).setAttribute("class", "card");
                    }
                }
                this.isDragging = false;
                this.selectCard.style.position = '';
                this.selectCard.style.width = '';
                this.selectCard.setAttribute("class", "card");
            }
            //console.log(this.checkDrop(this.selectCard, this.hoverCard));
        });
    },
    dropMutiCard: function(bDropEmpty = 0) {
        let originCol = this.boundCards[0].id.slice(1, 2);
        for(i = 0; i < this.boundCards.length; i++) {
            let oldLocation = this.boundCards[i].id.slice(1);
            let oldCol = Number(oldLocation.slice(0, 1));
            this.data[oldCol].splice(this.data[oldCol].indexOf(this.boundCards[i].innerText), 1);

            document.getElementById('co' + oldCol).removeChild(document.getElementById(this.boundCards[i].id));
            
            if(bDropEmpty) {
                let newCol = this.hoverCol.id.slice(2);
                let newRow = i;

                this.boundCards[i].setAttribute("id", "c" + newCol + Number(newRow));
                this.data[newCol].splice(-1, 0, this.boundCards[i].innerText);
                document.getElementById('co' + newCol).appendChild(this.boundCards[i]);
            }
            else {
                let newLocation = this.hoverCard.id.slice(1);
                let newCol = Number(newLocation.slice(0, 1));
                let newRow = Number(newLocation.slice(1)) + 1 + i;

                this.boundCards[i].setAttribute("id", "c" + newCol + Number(newRow));
                this.data[newCol].splice(-1, 0, this.boundCards[i].innerText);
                document.getElementById('co' + newCol).appendChild(this.boundCards[i]);
            }
            
            this.boundCards[i].style.position = '';
            this.boundCards[i].style.width = '';
            this.boundCards[i].setAttribute("class", "card");
        }
        this.isDragging = false;
        if(this.data[Number(originCol)].length > 1) {
            document.getElementById("c" + originCol + (this.data[Number(originCol)].length - 2)).setAttribute("class", "card");
        }
        this.boundCards = [];
    },
    randomCard: function() {
        let randSet = Math.floor(Math.random()*4);
        if(this.cardset[randSet].length > 0) {
            //找到一张随机牌
            let randCard = this.cardset[randSet][Math.floor(Math.random()*(this.cardset[randSet].length))];
            //移除找到的牌
            this.cardset[randSet] = this.cardset[randSet].filter(function(card) {
                return card != randCard;
            })
            this.cards--;
            //替换数组
            if(1) {
                this.data[Math.floor(Math.random()*10)].splice(-1, 0, randCard);
            }
        }
        else {
            if(this.cards) {
                this.randomCard();
                //console.log(this.cards);
            }
        }
    },
    refreshCard: async function() {
        //清除所有牌
        for(i = 0; i < 10; i++) {
            document.getElementsByClassName("co")[i].innerHTML = "";
        }
        for(col = 0; col < 10; col++) {
            for(row = 0; row < this.data[col].length; row++) {
                //console.log('row:', row, ' col:', col, ' data: ', this.data[col][row], ' datalength: ', this.data[col].length);
                //找到非'0'的牌
                await this.setCard(col, row);
            }
        }
    },
    setCard: async function(col, row) {
        if(this.data[col][row] != '0') {
            let selectCard = this.data[col][row];
            let newCard = document.createElement('div');
            //根据位置设置牌可见度
            if(row == this.data[col].length - 2) {
                newCard.setAttribute("class", "card");
            }
            else {
                newCard.setAttribute("class", "card card-closed");
            }
            newCard.setAttribute("id", "c" + col + row);
            newCard.innerText = selectCard;
            document.getElementById('co' + col).appendChild(newCard);
        }
    },
    addOverEvent: function() {
        let allCards = document.getElementsByClassName('card');
        for(i = 0; i < allCards.length; i++) {
            allCards[i].addEventListener('mouseover', (c) => {
                if((!this.isDragging)&&c.target.className == "card") {
                    //移动到某个牌上即选中
                    this.selectCard = c.target;
                }
                //移动到其他牌上
                this.hoverCard = c.target;
                //console.log(this.hoverCard);
            })
            allCards[i].addEventListener('mouseout', (c) => {
                this.hoverCard = null;
                //console.log(this.hoverCard);
            })
            allCards[i].addEventListener('mousedown', (e) => {
                //拖动
                this.isDragging = true;
                //console.log('mousedown at: ' + this.selectCard.id + this.isDragging);
                this.offsetX = e.clientX - this.selectCard.getBoundingClientRect().left + 25;
                this.offsetY = e.clientY - this.selectCard.getBoundingClientRect().top + 50;
            
                if(this.selectCard) {
                    this.checkDrag(this.selectCard);                    
                    console.log(this.boundCards);
                }
            })
        }

        let allCols = document.getElementsByClassName('co');
        for(i = 0; i < 10; i ++) {
            allCols[i].addEventListener('mouseover', (e) => {
                this.hoverCol = e.target;
                //console.log(this.hoverCol);
            })
        }
    },
    checkDrop: function(toDropCard, DropCard) {
        //Drop要放到的牌（也就是要放到的牌），toDrop要放的牌（也就是正在拖拽的牌）
        let Drop = DropCard.innerText;
        let toDrop = toDropCard.innerText;
        //console.log('Drop: ' + Drop + ' toDrop: ' + toDrop);
        if(this.cardlist.indexOf(toDrop) != -1 && this.cardlist.indexOf(Drop) != -1) {
            //console.log('indexOf(toDrop): ' + this.cardlist.indexOf(toDrop) + ' indexOf(Drop): ' + this.cardlist.indexOf(Drop));
            if(this.cardlist.indexOf(toDrop) - this.cardlist.indexOf(Drop) == 1) {
                return 1;
            }
        }
        return 0;
    },
    checkDrag: function(toDragCard) {
        console.log('Call checkDrag');
        //检查是否可拖拽，或者带着下面的牌组一起拖拽
        this.boundCards  = [];

        let dragLocation = toDragCard.id.slice(1);
        let dragCol = Number(dragLocation.slice(0, 1));
        let dragRow = Number(dragLocation.slice(1));
        //如果是同列最后一张牌
        if(dragRow == this.data[dragCol].length - 1) {
            this.boundCards.push(toDragCard);
            console.log(this.boundCards);
            return;
        }
        console.log("dragRow: " + dragRow + " length: " + this.data[dragCol].length);
        //循环判定牌是否可以成组
        for(i = dragRow; i < this.data[dragCol].length - 2; i++) {
            let nextCard = document.getElementById('c' + dragCol + (i + 1)).innerText;
            console.log(this.cardlist.indexOf(nextCard) - this.cardlist.indexOf(toDragCard.innerText));
            if(this.cardlist.indexOf(nextCard) - this.cardlist.indexOf(toDragCard.innerText) == (1 + i - dragRow)) {
                this.boundCards.push(document.getElementById('c' + dragCol + i));
                console.log("add card c" + dragCol + i);
            }
            else {
                this.boundCards = [];
                console.log("not a bound, clear");
                return;
            }
            if(i == this.data[dragCol].length - 3) {
                this.boundCards.push(document.getElementById('c' + dragCol + (this.data[dragCol].length - 2)));
            }
        }
    },
    updateScore: function() {
        document.getElementById('score').innerText = this.score;
    }
}

game.start();