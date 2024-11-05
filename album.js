// album.js

document.addEventListener("DOMContentLoaded", async () => {
    // Obtém o ID do álbum armazenado no localStorage
    const albumId = localStorage.getItem("selectedAlbumId");
    if (!albumId) {
        // Redireciona para a página inicial se o ID do álbum não estiver presente
        window.location.href = "index.html";
        return;
    }

    const token = await acess(); // Chama a função para obter o token de autenticação

    // Faz a requisição para obter os detalhes do álbum
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    const album = await response.json();

    // Exibe as informações do álbum na página de detalhes
    document.getElementById("album-cover").src = album.images[0].url;
    document.getElementById("album-name").innerText = album.name;
    document.getElementById("artist-name").innerText = album.artists.map(artist => artist.name).join(", ");
    document.getElementById("monthly-listeners").innerText = album.popularity;
    
    // Exibe a lista de faixas
    const trackList = document.getElementById("track-list");
    trackList.innerHTML = ""; // Limpa a lista de faixas antes de exibir
    album.tracks.items.forEach(track => {
        const trackItem = document.createElement("li");
        trackItem.textContent = track.name;
        trackList.appendChild(trackItem);
    });
});
