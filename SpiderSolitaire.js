var game = {
    score: 0,
    data: [],
    cards: 52,
    selectCard: null,
    hoverCard: null,
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

        document.addEventListener('mousemove', (e) => {
            //console.log(this.isDragging);
            
            if (this.isDragging) {
                var x = e.clientX - this.offsetX;
                var y = e.clientY - this.offsetY;
                
                this.selectCard.style.width = '9.025%';
                this.selectCard.style.left = x + 'px';
                this.selectCard.style.top = y + 'px';
                this.selectCard.setAttribute("class", "card card-drag");
            }
        });
        
        document.addEventListener('mouseup', () => {
            console.log(this.checkDrop(this.selectCard, this.hoverCard));
            if(this.hoverCard && this.checkDrop(this.selectCard, this.hoverCard)) {
                let oldLocation = this.selectCard.id.slice(1);
                let oldCol = Number(oldLocation.slice(0, -1));
                let oldRow = Number(oldLocation.slice(-1));
                this.data[oldCol].splice(-2, 1);

                document.getElementById('co' + oldCol).removeChild(document.getElementById(this.selectCard.id));

                let newLocation = this.hoverCard.id.slice(1);
                let newCol = Number(newLocation.slice(0, -1));
                let newRow = Number(newLocation.slice(-1)) + 1;
                this.selectCard.setAttribute("id", "c" + newCol + Number(newRow));
                this.data[newCol].splice(-1, 0, this.selectCard.innerText);

                document.getElementById('co' + newCol).appendChild(this.selectCard);

                document.getElementById('c' + oldCol + (oldRow - 1)).setAttribute("class", "card");
            }
            this.isDragging = false;
            this.selectCard.style.position = '';
            this.selectCard.style.width = '';
            this.selectCard.setAttribute("class", "card");
        });
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
                if(!this.isDragging) {
                    //移动到某个牌上即选中
                    this.selectCard = c.target;
                    //console.log(this.selectCard);
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
                this.offsetX = e.clientX - this.selectCard.getBoundingClientRect().left;
                this.offsetY = e.clientY - this.selectCard.getBoundingClientRect().top;
            })
        }
    },
    checkDrop: function(toDropCard, DropCard) {
        //Drop要放到的牌（也就是要放到的牌），toDrop要放的牌（也就是正在拖拽的牌）
        let Drop = DropCard.innerText;
        let toDrop = toDropCard.innerText;
        console.log('Drop: ' + Drop + ' toDrop: ' + toDrop);
        if(this.cardlist.indexOf(toDrop) != -1 && this.cardlist.indexOf(Drop) != -1) {
            console.log('indexOf(toDrop): ' + this.cardlist.indexOf(toDrop) + ' indexOf(Drop): ' + this.cardlist.indexOf(Drop));
            if(this.cardlist.indexOf(toDrop) - this.cardlist.indexOf(Drop) == 1) {
                return 1;
            }
        }
        return 0;
    }
}

game.start();