// album.js

document.addEventListener("DOMContentLoaded", async () => {
    // Obtém o ID do álbum armazenado no localStorage
    const albumId = localStorage.getItem("selectedAlbumId");

    if (!albumId) {
        // Redireciona para a página inicial se o ID do álbum não estiver presente
        window.location.href = "index.html";
        return;
    }

    // Recupera os dados do álbum do localStorage
    document.getElementById("album-cover").src = localStorage.getItem("selectedAlbumImage");
    document.getElementById("album-name").innerText = localStorage.getItem("selectedAlbumName");
    document.getElementById("artist-name").innerText = localStorage.getItem("selectedAlbumArtists");
    document.getElementById("release-date").innerText = `Lançamento: ${localStorage.getItem("selectedAlbumReleaseDate")}`;
    document.getElementById("total-tracks").innerText = `Total de Faixas: ${localStorage.getItem("selectedAlbumTotalTracks")}`;

    // Opcional: faça uma nova requisição para obter mais detalhes, como a lista de faixas
    const token = await acess();
    const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    const album = await response.json();

    // Exibe a lista de faixas
    const trackList = document.getElementById("track-list");
    trackList.innerHTML = ""; // Limpa a lista de faixas antes de exibir
    album.tracks.items.forEach(track => {
        const trackItem = document.createElement("li");
        trackItem.textContent = track.name;
        trackList.appendChild(trackItem);
    });
});
