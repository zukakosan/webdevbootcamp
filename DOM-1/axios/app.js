const form = document.querySelector('#searchForm');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const keyword = form.elements.keyword.value;
    const params = {
        params: {
            q: keyword
        }
    }
    const response = await axios.get(`https://api.tvmaze.com/search/shows`, params);
    console.log(response.data);
    makeImages(response.data);
});

const makeImages = (results) => {
    // 既存の image は append 前に、DOM からとってくる
    const existingImages = document.querySelectorAll('img');
    for (let img of existingImages) {
        img.remove();
    }
    
    for (let result of results) {
        if (result.show.image) {
            const img = document.createElement('img');
            img.src = result.show.image.medium;
            // body に append
            document.body.append(img);
        }
    };
};