const searchIcon = document.querySelector('.search-icon');
const searchInner = document.querySelector('.search-inner');
const searchCancer = document.querySelector('.article-recommend-search-cancer');
const shows = document.querySelectorAll('#header-nav>a');
const articleRecommend = document.querySelector('#article-recommend');
const articleRank = document.querySelector('#article-rank');
const mainCont = document.querySelector('.main-cont');
const searchCont = document.querySelector('.article-recommend-search-cont');
const searchValue = document.querySelector('.search-inner');
const searchRes = document.querySelector('.search-result');
const cancer = document.querySelector('.cancer');

searchInner.addEventListener('focus', () => {
    searchIcon.className = 'iconfont search-icon search-icon-focus';
    searchInner.className = 'search-inner search-inner-focus';
    searchCancer.style.display = 'block';
})

searchInner.addEventListener('click', () => {
    mainCont.style.display = 'none';
    if (!searchValue.value) {
        searchCont.style.display = 'block';
    }
    getHistory()
})

searchCancer.addEventListener('click', () => {
    mainCont.style.display = 'block';
    searchCont.style.display = 'none';
    searchRes.style.display = 'none';
    searchCancer.style.display = 'none';
    cancer.style.display = 'none';
    searchIcon.className = 'iconfont search-icon';
    searchInner.className = 'search-inner';
    searchValue.value = '';
})

searchInner.addEventListener('blur', () => {
    if (!searchValue.value) {
        searchIcon.className = 'iconfont search-icon';
        searchInner.className = 'search-inner';
    }
})

shows[0].addEventListener('click', (e) => {
    e.preventDefault()
    shows[1].removeAttribute('class')
    shows[0].className = "header-nav-select"
    if (articleRecommend.style.display !== 'block') {
        articleRecommend.style.display = 'block';
        articleRank.style.display = 'none';
        mainCont.style.display = 'block';

        searchCont.style.display = 'none';
        searchRes.style.display = 'none';
        searchCancer.style.display = 'none';
        cancer.style.display = 'none';
        searchIcon.className = 'iconfont search-icon';
        searchInner.className = 'search-inner';
        searchValue.value = '';
    }

})

shows[1].addEventListener('click', (e) => {
    shows[0].removeAttribute('class')
    shows[1].className = "header-nav-select"
    e.preventDefault()
    articleRecommend.style.display = 'none';
    articleRank.style.display = 'block';
})

cancer.addEventListener('click', () => {
    searchValue.value = '';
    searchCont.style.display = 'block';
    searchRes.style.display = 'none';
    cancer.style.display = 'none';
    getHistory()
})

let myHistory = localStorage.getItem('myHistory') ? JSON.parse(localStorage.getItem('myHistory')) : [];

document.addEventListener('keyup', () => {
    if (searchValue.value !== "") {
        cancer.style.display = 'block';
    } else {
        cancer.style.display = 'none';
    }
})

document.addEventListener('keypress', async (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        let value = searchValue.value
        if (value) {
            searchRes.style.display = 'block';
            mainCont.style.display = 'none';
            searchCont.style.display = 'none';
            searchUl.innerHTML = '';
            myHistory.unshift(value);
            let data = await searchItem(value)
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
        }
    }
});

async function searchItem(value) {
    searchIcon.className = 'iconfont search-icon search-icon-focus';
    searchInner.className = 'search-inner search-inner-focus';
    searchCancer.style.display = 'block';
    searchValue.value = value;
    cancer.style.display = 'block';
    const res = await fetch(`http://124.221.249.219:8000/api/search?keyword=${value}`)
    const data = await res.json()
    return data
}






