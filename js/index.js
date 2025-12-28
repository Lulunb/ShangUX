//作用，需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function(){

    //声明一个记录点击的缩略图下标
    var bigimgIndex = 0;

    //路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind(){
        /**
    * 思路：
    * 1.先获取路径导航的页面元素（navPath）
    * 2.再来获取所需要的数据（data.js->goodData.path）
    * 3.由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
    * 4.在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
    **/
    const navPath = document.querySelector('#wrapper .content .contentMain .navPath');

    const path = goodData.path;
    
    
    for(let i = 0; i<path.length; i++){
        if(i == path.length-1){
            //只要创建a标签
            var aNode = document.createElement("a");
            aNode.innerText = path[i].title;
            navPath.appendChild(aNode);
        }
        else{
             //创建a标签
            var aNode = document.createElement("a");
            aNode.href = path[i].url;
            aNode.innerText = path[i].title;
        
            //创建i标签
            var iNode = document.createElement("i");
            iNode.innerText = '/'

            //让navPath元素来追加a和i
            navPath.appendChild(aNode);
            navPath.appendChild(iNode);
        }
       
    }

    }
   
    //放大镜的移入移出效果
    bigClassBind();
    function bigClassBind(){
        /**
         * 思路
         * 1.获取小图框元素，并且设置移入事件（onmouseenter）
         * 2.鼠标移入动态创建蒙版和大图框大图片元素
         * 3.鼠标移出(onmouseleave)移除蒙版和大图框元素
         */

        const smallPic = document.querySelector('#wrapper .content .contentMain .center .left .leftTop .smallPic');
        const leftTop = document.querySelector('#wrapper .content .contentMain .center .left .leftTop ');
        const imagessrc = goodData.imagessrc;
        smallPic.onmouseenter = function(){
            const maskDiv = document.createElement('div');
            maskDiv.className = "mask";

            const bigPic = document.createElement('div');
            bigPic.className = "bigPic";

            const bigImg = document.createElement('img');
            bigImg.src = imagessrc[bigimgIndex].b;
            

            //追加元素
            bigPic.appendChild(bigImg);
            smallPic.appendChild(maskDiv);
            leftTop.appendChild(bigPic)



            //设置移动事件
            smallPic.onmousemove = function(event){

                //event.clientX:鼠标点距离浏览器左侧X轴的值
                //getBoundingClientRect().left：小图框元素距离浏览器左侧可视left值
                //offsetWidth：为元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;


                //判断
                if(left < 0){
                    left = 0;
                }else if(left > smallPic.offsetWidth- maskDiv.offsetWidth ){
                    left =  smallPic.offsetWidth - maskDiv.offsetWidth;
                }

                if(top < 0){
                    top = 0;
                }else if(top > smallPic.offsetHeight - maskDiv.offsetHeight){
                    top = smallPic.offsetHeight - maskDiv.offsetHeight;
                }

                //设置left和top属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                //移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
                //蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                //大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度

                var scale = (smallPic.offsetWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.offsetWidth);
                bigImg.style.left = -left / scale + "px";
                bigImg.style.top = -top / scale + "px";


            }

            //设置移出事件
            smallPic.onmouseleave = function(){
                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);
                //让leftTop元素移除大图框
                leftTop.removeChild(bigPic);
            }

        }
    }

    //动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData(){
        /**
         * 思路：
         * 1、先获取piclist元素的ul
         * 2、再获取data.js文件下的goodData -> imagessrc
         * 3、遍历数组，根据数组的长度来创建li元素
         * 4、追加元素
         */

        const ul = document.querySelector('#wrapper .content .contentMain .center .left .leftBottom .piclist ul');
        const images = goodData.imagessrc;
        
        for(let i = 0; i < images.length; i++){
            const newLi = document.createElement('li');

            const newImg = document.createElement('img');
            newImg.src = images[i].s;

            
            newLi.appendChild(newImg);
            ul.appendChild(newLi);

        }
    }

    //点击缩略图的效果
    thumbnailClick();
    function thumbnailClick(){
        /**
         * 思路：
         * 1、获取所有的li元素，并且循环发生点击事件
         * 2、点击缩略图需要确定其下标位置来对应小图路径和大图路径替换现有src的值
         * 
         */

        //获取所有的li元素
        const liNodes = document.querySelectorAll('#wrapper .content .contentMain .center .left .leftBottom .piclist ul li');
        var smallPic_pic = document.querySelector('#wrapper .content .contentMain .center .left .leftTop .smallPic img');
        var imagessrc = goodData.imagessrc;

        //小图路径需要默认和imagessrc的第一个元素小图路径是一致的
        smallPic_pic.src = imagessrc[0].s;

        //循环点击这些li元素
        for(let i = 0;i < liNodes.length; i++){
            liNodes[i].onclick = function(){
                //通过循环给多个列表项绑定点击事件
                bigimgIndex = i;
                smallPic_pic.src = imagessrc[i].s;
            }
        }
    }

    //点击缩略图左右的箭头效果
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick(){
        /**
         * 思路
         * 1.先获取左右两端的箭头按钮
         * 2.再获取可视的div以及ul元素和所有li元素
         * 3.计算（发生起点,步长，总体运动的距离值）
         * 4.然后再发生点击事件
         */

        var prev = document.querySelector('#wrapper .content .contentMain .center .left .leftBottom a.prev');
        var next = document.querySelector('#wrapper .content .contentMain .center .left .leftBottom a.next');

        var ul = document.querySelector('#wrapper .content .contentMain .center .left .leftBottom .piclist ul');

        var liNodes = document.querySelectorAll('#wrapper .content .contentMain .center .left .leftBottom .piclist ul li');

        //发生起点
        var start = 0;
        //步长
        var step = (liNodes[0].offsetWidth + 20)*2;
        //总体运动距离
        var total = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);
        //发生事件
        prev.onclick = function(){
            start-=step;
            if(start < 0){
                start = 0;
            }
            ul.style.left = -start + "px";
            console.log(ul.style.left);
        }

    
        next.onclick = function(){
            start+=step;
            if(start > total){
                start = total;
            }
            ul.style.left = -start + "px";
            console.log(ul.style.left);
        }


    }

    //商品详情数据的动态渲染
    rightTopData();
    function rightTopData(){
        /**
         * 思路
         * 1.查找rightTop元素
         * 2.查找data.js->goodData->goodsDetail
         * 3.建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素
         *
         */

        var rightTop = document.querySelector('#wrapper .content .contentMain .center .right .rightTop');
        var goodsDetail = goodData.goodsDetail;

        var s = `
                    <h1>${goodsDetail.title}</h1>
                    <p>${goodsDetail.recommend}</p>
                    <div class="priceMain">
                        <!--价格-->
                        <div class="priceTop">
                            <span>价&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp格</span>
                            <div class="price">
                                <p id="p1">¥</p>
                                <p id="p2">${goodsDetail.price}</p>
                                <p id="p3">降价通知</p>
                            </div>
                            <p>
                                <span>累计评价</span>
                                <span>${goodsDetail.evaluateNum}</span>
                            </p>
                        </div>
                        <!--促销-->
                        <div class="priceBottom">
                            <span>促&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp销</span>
                            <p>
                                <span>加价购</span>
                                <span>${goodsDetail.promoteSales.content}</span>
                            </p>
                        </div>
                    </div>

                    <div class="support">
                        <span>支&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp持</span>
                        <p>${goodsDetail.support}</p>
                    </div>

                    <div class="address">
                        <span>配&nbsp送&nbsp至</span>
                        <p>${goodsDetail.address}</p>
                    </div>`

                    rightTop.innerHTML = s;


    }

    //商品参数数据的动态渲染
    rightBottomData();
    function rightBottomData(){
        /**
         * 思路：
         * 1.找rightBottom的元素对象
         * 2.查找data.js->goodData.goodsDetail.crumbData数据
         * 3.由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象(dt,dd)
         */

        var chooseWrap = document.querySelector('#wrapper .content .contentMain .center .right .rightBottom .chooseWrap');

        var crumbData = goodData.goodsDetail.crumbData;

        for(let i = 0; i < crumbData.length; i++){
            var dl = document.createElement('dl');
            var dt = document.createElement('dt');
            

            dt.innerText = crumbData[i].title;

            dl.appendChild(dt);

            for(let j = 0; j < crumbData[i].data.length; j++){
                var dd = document.createElement('dd');
                dd.innerText = crumbData[i].data[j].type;
                dd.setAttribute('price',crumbData[i].data[j].changePrice);
                dl.appendChild(dd);

            }
            
            chooseWrap.appendChild(dl);

        }
    }

    //点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind(){
        /**
         * 每一行dd文字颜色排他
         * 思路：
         * 1.获取所有的dl元素，取其中第一个dl元素下的所有dd先做测试
         * 2.循环所有的dd元素并且添加点击事件
         * 3.确定实际发生事件的目标源对象设置其颜色，然后给其他所有的元素颜色都重置为基础颜色（#666）
         * =================================================================================
         * 
         * 点击dd之后产生的mark标记
         * 思路：
         * 1.首先先来创建一个可以容纳点击dd元素值的容器（数组），确定数组起始长度,再添加一些默认值
         * 2.然后再将点击的dd元素的值按照对应下标来写入到数组元素身上
         *  
         */

        
        var dl = document.querySelectorAll('#wrapper .content .contentMain .center .right .rightBottom .chooseWrap dl');

        var arr = new Array(dl.length);

        var choose = document.querySelector('#wrapper .content .contentMain .center .right .rightBottom .choose');
        arr.fill(0);//这里第一次加了单引号（''），不能加


        for(let z = 0; z < dl.length; z++){
            let dd = dl[z].querySelectorAll('dd');
            
            //遍历当前所有的dd元素
            for(let i = 0; i < dd.length; i++){
                dd[i].onclick = function(){

                    //清空choose元素
                    choose.innerHTML = "";

                    for(let j = 0; j < dd.length; j++){
                        dd[j].style.color = "#666";
                    }

                        this.style.color = "red";
                        
                        arr[z] = this;
                        changePriceBind(arr);

                         //遍历数组
                        arr.forEach(function(value,index){
                            //只要是为真的条件，咱们就动态来创建mark标签
                            if(value){
                                var markDiv = document.createElement('div');
                                var aNode = document.createElement('a');
                                markDiv.className = 'mark';
                                markDiv.innerText = value.innerText;
                                aNode.innerText = 'X';
                                aNode.setAttribute('index', index);
                                //让div追加a
                                markDiv.appendChild(aNode);
                                choose.appendChild(markDiv);
                            }
                             
                        })
                        //拿到所有a标签，并且循环遍历，为所有a标签绑定点击事件
                        var aNodes = document.querySelectorAll('#wrapper .content .contentMain .center .right .rightBottom .choose .mark a');

                        for( let n = 0; n < aNodes.length; n++){
                            aNodes[n].onclick = function(){
                                //点击获取a标签身上的index属性值
                                var idx1 = this.getAttribute('index');
                                //让对应数组下标的内容变为0
                                arr[idx1] = 0;
                                changePriceBind(arr);

                                //查找对应下标的那个dl行中的所有的dd元素
                                var ddlist = dl[idx1].querySelectorAll('dd');
                                //遍历该下标所在的dl的所有dd，将第一个元素改为红色
                                for(let m = 0; m <ddlist.length ; m++){
                                    ddlist[m].style.color = '#666';
                                }
                                ddlist[0].style.color = 'red';
                                
                                //删除对应下标位置的mark标记
                                choose.removeChild(this.parentNode);
                            }
                        }
                }  
            }
        }
    }  

    //价格变动函数声明
    //这个函数是需要在点击dd和时候以及删除mark标记的时候才需要调用

    function changePriceBind(arr){
        /**
         * 思路
         * 1.获取价格的标签元素
         * 2.给每一个dd标签身上默认都设置一个自定义的属性，用来记录变化的价格
         * 3.遍历arr数组，将dd元素身上的新变化的价格和已有的价格相加
         * 4.最后将计算之后的结果重新渲染到p标签中
         */

        var oldPrice = document.querySelector('#wrapper .content .contentMain .center .right .rightTop .priceMain .priceTop .price #p2');

        //取出默认价格
        var price = goodData.goodsDetail.price;

        //遍历arr数组
        for(i = 0; i < arr.length; i++){
            if(arr[i]){
                var changePrice = Number(arr[i].getAttribute('price'));

                price += changePrice;
            }
        }
        oldPrice.innerText = price; 

        //
        var leftprice = document.querySelector('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        leftprice.innerText = '¥' + price;

        var ipts = document.querySelectorAll('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        for(var j = 0; j < ipts.length; j++){
            if(ipts[j].checked){
                price+=Number(ipts[j].value);

            }
        }
        var newprice = document.querySelector('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        newprice.innerText = '¥' + price;

    }

    //选择搭配中间区域复选框选中套餐价变动效果
    chooseprice();
    function chooseprice(){
        /**
         * 思路
         * 1.先获取中间区域所有的复选框元素
         * 2.遍历这些元素取出他们价格，和左侧的基础价格进行累加，累加后重新写回套餐价格标签里面
         * 
         */

        var ipts = document.querySelectorAll('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input');
        var leftprice = document.querySelector('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        var newprice = document.querySelector('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        for(let i = 0; i < ipts.length; i++){
            ipts[i].onclick = function(){
                var oldprice = Number(leftprice.innerText.slice(1));
                for(let j = 0; j < ipts.length; j++){
                    if(ipts[j].checked){
                        oldprice = oldprice + Number(ipts[j].value);
                    }
                }
                newprice.innerText = '¥' + oldprice;
            }
            
        }


    }

    //封装一个公共的选项函数卡
    /**
     * ①被点击的元素 tabBtns
     * ②被切换显示的元素 tabConts
     */
    function Tab(tabBtns, tabConts){
        for(let i=0; i<tabBtns.length; i++){
            tabBtns[i].onclick = function(){
                for(let j=0; j<tabBtns.length; j++){
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = 'active';
                tabConts[i].className = 'active';
            }
        }
    }

    //点击左侧选项卡
    leftTab();
    function leftTab(){
        var h4s = document.querySelectorAll('#wrapper .content .contentMain .goodsDetailWrap .leftAside .asideTop h4');
        var divs = document.querySelectorAll('#wrapper .content .contentMain .goodsDetailWrap .leftAside .asideContent>div');//只要父元素下面直接的div，而不是所有
        Tab(h4s,divs);
    }


    //点击右侧选项卡
    rightTab();
    function rightTab(){
         var lis = document.querySelectorAll('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabBtns li');
         var divs = document.querySelectorAll('#wrapper .content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabContents div');
         Tab(lis,divs);
    }

    //右边侧边栏的点击效果
    rightAsideBind();
    function rightAsideBind(){
        /**
         * 思路：
         * 1.先找到按钮元素发生点击事件
         * 2.记录一个初始状态，再点击事件的内容进行判断，如果为关闭则展开，否则为关闭（状态取反）
         * 3.如果为展开则需要设置按钮和侧边栏对应的class效果
         */
        var btns = document.querySelector('#wrapper .rightAside .btns');
        //记录初始状态
        var flag = true;

        //查找侧边栏元素
        var rightAside = document.querySelector('#wrapper .rightAside');

        //设置按钮点击事件
        btns.onclick = function(){
            //只要点击了按钮就取反
            flag = !flag;
            if(flag){
                btns.className = "btns btnsClose";
                rightAside.className = "rightAside asideClose";
            }else{
                btns.className = "btns btnsOpen";
                rightAside.className = "rightAside asideOpen";
            }
            
        }
    }
}