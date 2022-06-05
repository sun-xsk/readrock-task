const modListUl = document.querySelectorAll('.mod-cont-list')
const rankUl = document.querySelector('.grid');
const searchUl = document.querySelector('.search-result>ul');
const searchHot = document.querySelector('.search-history-cont2');
const searchHistory = document.querySelector('.search-history-cont');

// http://124.221.249.219:8000/api/recommendations
async function getRecommendations() {
    const res = await fetch('http://124.221.249.219:8000/api/recommendations')
    const data = await res.json()
    const { column, offical, tatsujin } = data

    for (let i = 0; i < offical.length; i++) {
        let { cover, title, views } = offical[i];
        const li = document.createElement('li');
        li.className = 'mod-list-item';
        let template = `
        <div class="mod-list-item-cont">
            <div>
                <img src="${cover}" alt="" class="mod-list-item-cont-img">
                <div class="play-count-box">
                    <span class="iconfont play-icon">&#xe618;</span>
                    <span class="playNum">${views / 10}万</span>
                </div>
            </div>
            <div>
                 <h3 class="mod-list-item-cont-title">${title}</h3>
            </div>
        </div>
        `
        li.innerHTML = template;
        modListUl[0].appendChild(li);
    }

    for (let i = 0; i < tatsujin.length; i++) {
        let { cover, title, views } = tatsujin[i];
        const li = document.createElement('li');
        li.className = 'mod-list-item';
        let template = `
        <div class="mod-list-item-cont">
            <div>
                <img src="${cover}" alt="" class="mod-list-item-cont-img">
                <div class="play-count-box">
                    <span class="iconfont play-icon">&#xe618;</span>
                    <span class="playNum">${views / 10}万</span>
                </div>
            </div>
            <div>
                 <h3 class="mod-list-item-cont-title">${title}</h3>
            </div>
        </div>
        `
        li.innerHTML = template;
        modListUl[1].appendChild(li);
    }

    for (let i = 0; i < column.length; i++) {
        let { background, icon, description, title } = column[i];
        const li = document.createElement('li');
        li.className = 'mod-list-item';
        let template = `
        <div class="mod-list-item-cont2">
          <div>
            <img src="${background}" alt="" class="mod-list-item-cont-img">
            <div class="info">
              <div class="info-cont">
                <img src="${icon}" alt="" class="info-cont-img">
                <span class="info-cont-title">${title}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="mod-list-item-cont-title">${description}</h3>
          </div>
        </div>
        `
        li.innerHTML = template;
        modListUl[2].appendChild(li);
    }
}

async function getRank() {
    const res = await fetch('http://124.221.249.219:8000/api/ranking')
    const data = await res.json()
    openRank(data)
    dragula([rankUl]);
}



function openRank(data) {
    rankUl.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        let { cover, title, views, top3, update_frequence } = data[i];
        const li = document.createElement('li');
        li.className = `grid-item`;
        let template = `
        <div class="rank-item-details">
        <h2>${title}</h2>
         <ol>
           <li><strong>1.</strong><span>${top3[0].title}</span>-<span  class="author">${top3[0].artist[0]}</span></li>
           <li><strong>2.</strong><span>${top3[1].title}</span>-<span  class="author">${top3[1].artist[0]}</span></li>
           <li><strong>3.</strong><span>${top3[2].title}</span>-<span  class="author">${top3[2].artist[0]}</span></li>
        </ol>
       </div>
       <div class="rank-item-img">
         <img src="${cover}">
         <span class="updata">每${update_frequence}更新</span>
         <div class="play-count-box2">
           <span class="iconfont play-icon">&#xe618;</span>
           <span class="playNum">${views}万</span>
         </div>
       </div>
    `
        li.innerHTML = template;
        rankUl.appendChild(li);
    }
}

async function getHot() {
    const res = await fetch('http://124.221.249.219:8000/api/hot')
    const data = await res.json()
    for (let i = 0; i < data.length; i++) {
        const span = document.createElement('span');
        span.className = 'rank-item bg2';
        let template = data[i]
        span.innerHTML = template;
        searchHot.appendChild(span);
        span.addEventListener('click', async () => {
            searchRes.style.display = 'block';
            mainCont.style.display = 'none';
            searchCont.style.display = 'none';
            searchUl.innerHTML = '';
            myHistory.unshift(data[i]);
            let data2 = await searchItem(data[i]);
            let newmyHistory = []
            myHistory.forEach(item => {
                if (newmyHistory.indexOf(item) === -1) {
                    newmyHistory.push(item)
                }
            })
            myHistory = newmyHistory;
            if (myHistory.length > 10) {
                myHistory.pop();
            }
            getSearch(data2)
            localStorage.setItem("myHistory", JSON.stringify(myHistory));
        })
    }
}

function getHistory() {
    searchHistory.innerHTML = '';
    for (let i = 0; i < myHistory.length; i++) {
        const span = document.createElement('span');
        span.className = 'rank-item bg2';
        span.innerHTML = myHistory[i];
        searchHistory.appendChild(span);
        span.addEventListener('click', async () => {
            searchRes.style.display = 'block';
            mainCont.style.display = 'none';
            searchCont.style.display = 'none';
            searchUl.innerHTML = '';
            let data = await searchItem(myHistory[i]);
            myHistory.unshift(myHistory[i]);
            let newmyHistory = []
            myHistory.forEach(item => {
                if (newmyHistory.indexOf(item) === -1) {
                    newmyHistory.push(item)
                }
            })
            myHistory = newmyHistory;
            if (myHistory.length > 10) {
                myHistory.pop();
            }
            getSearch(data)
            localStorage.setItem("myHistory", JSON.stringify(myHistory));
        })
    }
}

function getSearch(searchData) {
    if (searchData) {
        for (let i = 0; i < searchData.length; i++) {
            const li = document.createElement('li');
            const { title, artist } = searchData[i];
            li.innerHTML = searchData[i];
            let template = `
        <div>
          <div>
            <h3>${title}</h3>
            <p>${artist.join(' ')}</p>
         </div>
        </div>
      `
            li.innerHTML = template;
            searchUl.appendChild(li);
        }
    }
}

getRecommendations()
getRank()
getHot()


