const APIController = (function() {
    
    const clientId = 'c375d08b3ae44ac1b4a3ca3bfb2b38a9';
    const clientSecret = '21d9528d12064cf7a922980555fe5d2a';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();


// UI Module
const UIController = (function() {

     // HTML seçicilere referansları tutmak için obje
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

         // input alanlarını almak için metot
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // select listesi oluşturmak için metot
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

       // şarkı listesi grubu öğesi oluşturmak için metot 
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        // şarkı detayını oluşturmak için metot
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
             // kullanıcı yeni bir şarkıya tıkladığında, şarkı detay div'ini temizlememiz gerekiyor
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // input alanı obje referansını al
    const DOMInputs = UICtrl.inputField();

     // sayfa yüklendiğinde türleri al
    const loadGenres = async () => {
         // token'ı al
        const token = await APICtrl.getToken();           
       // token'ı sayfaya kaydet
        UICtrl.storeToken(token);
         // türleri al
        const genres = await APICtrl.getGenres(token);
        // tür select elemanını doldur
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

   // tür değişim olay dinleyicisi oluştur
    DOMInputs.genre.addEventListener('change', async () => {
         // playlist'i sıfırla
        UICtrl.resetPlaylist();
          // sayfada saklanan token'ı al
        const token = UICtrl.getStoredToken().token;        
         // tür select alanını al
        const genreSelect = UICtrl.inputField().genre;       
        // seçilen türle ilişkili tür id'sini al
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        // türe göre playlist'i al
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
       // dönen her bir playlist için bir playlist list öğesi oluştur
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
     

    // submit butonuna tıklama olay dinleyicisi oluştur
    DOMInputs.submit.addEventListener('click', async (e) => {
        // sayfa yenilemesini engelle
        e.preventDefault();
        // şarkıları temizle
        UICtrl.resetTracks();
        // token'ı al
        const token = UICtrl.getStoredToken().token;        
        // playlist alanını al
        const playlistSelect = UICtrl.inputField().playlist;
        // seçilen playlist'e dayalı track endpoint'ini al
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // şarkı listesini al
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // şarkı listesi öğesi oluştur
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

     // şarkı seçimi için tıklama olay dinleyicisi oluştur
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // sayfa yenilemesini engelle
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // token'ı al
        const token = UICtrl.getStoredToken().token;
       // şarkı endpoint'ini al
        const trackEndpoint = e.target.id;
        // şarkı objesini al
        const track = await APICtrl.getTrack(token, trackEndpoint);
       // şarkı detaylarını yükle
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

// türleri sayfa yüklendiğinde yüklemek için bir metot çağırmanız gerekecek
APPController.init();