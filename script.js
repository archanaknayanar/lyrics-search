const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');
const apiURL = 'https://api.lyrics.ovh';

//Search lyrics by song or artist
async function searchSong(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
    showData(data);
}

//Show song and artist on DOM
function showData(data) {
    console.log(data);
    let songlist = '';

    data.data.forEach(song => {
        songlist += `
        <li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-title="${song.album.title}">Get Lyrics</button>
        </li>

        `;
    });

    result.innerHTML = `
        <ul class="songs">${songlist}</ul>
    `;
    // result.innerHTML = `
    // <ul class=songs">
    //     ${data.data.map(song => `
    //     <li>
    //     <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    //     <button class="btn" data-artist="${song.artist.name}" data-title="${song.album.title}">Get Lyrics</button>
    //     </li>
    //     `).join('')}

    // </ul>
    // `;

    if (data.next || data.prev) {
        more.innerHTML = `
        ${data.next ? `<button class=btn onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
        ${data.prev ? `<button class=btn onclick="getMoreSongs('${data.prev}')">Prev</button>` :''}
        `;
    } else {
        more.innerHTML = '';
    }

}

//Get more songs on pagination
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);

}

//Show Lyrics
async function getLyrics(artist, title) {
    const res = await fetch(`${apiURL}/v1/${artist}/${title}`);
    const data = await res.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${title}</h2>
    <span>${lyrics}</span>
    `
    more.innerHTML = '';
}
//Event Listener
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (!searchTerm) {
        alert('Please enter a search term');
    } else {
        searchSong(searchTerm);
    }
    
});
result.addEventListener('click', e => {
    const clickedEl = e.target;
    
    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const title = clickedEl.getAttribute('data-title');

        getLyrics(artist,title);
    } else {
        alert('Nothing to show');
    }
})