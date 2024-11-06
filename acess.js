// Função para obter o token de autenticação do Spotify
async function getToken() {
    const clientId = "c39f13e6b0b9496882f544f1a9456d7a";
    const clientSecret = "b819c1e4cca44124bd66cbc9b5e74e79";

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret
            })
        });

        if (!response.ok) {
            console.error("Erro ao obter token:", response.statusText);
            return null;
        }

        const data = await response.json();
        console.log("Token obtido:", data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("Erro na função getToken:", error);
        return null;
    }
}

// Função para buscar álbuns aleatórios e exibi-los no feed
async function loadAlbums() {
    const token = await getToken();
    if (!token) {
        console.error("Token inválido ou não fornecido.");
        return;
    }

    // Gera um offset aleatório para obter álbuns diferentes a cada carregamento
    const randomOffset = Math.floor(Math.random() * 100);

    try {
        const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10&offset=${randomOffset}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("Erro ao carregar o feed de álbuns:", response.statusText);
            return;
        }

        const data = await response.json();
        const albums = data.albums.items;
        const container = document.getElementById("feed");
        container.innerHTML = ""; // Limpa o feed antes de renderizar os álbuns

        albums.forEach(album => {
            const albumCard = document.createElement("div");
            albumCard.classList.add("post");

            // Cria a imagem do álbum e adiciona o evento de clique para redirecionar
            const albumImage = document.createElement("img");
            albumImage.src = album.images[0].url;
            albumImage.alt = album.name;
            albumImage.style.cursor = "pointer";

            albumImage.addEventListener("click", () => {
                // Armazena todos os detalhes do álbum no localStorage para uso em album.html
                localStorage.setItem("selectedAlbumId", album.id);
                localStorage.setItem("selectedAlbumName", album.name);
                localStorage.setItem("selectedAlbumImage", album.images[0].url);
                localStorage.setItem("selectedAlbumArtists", album.artists.map(artist => artist.name).join(", "));
                localStorage.setItem("selectedAlbumReleaseDate", album.release_date);
                localStorage.setItem("selectedAlbumTotalTracks", album.total_tracks);
                localStorage.setItem("selectedAlbumUrl", album.external_urls.spotify); // URL do álbum no Spotify

                // Redireciona para a página de detalhes do álbum
                window.location.href = "album.html";
            });

            albumCard.appendChild(albumImage);

            // Cria a seção de descrição do álbum
            const descricao = document.createElement("div");
            descricao.classList.add("descricao");
            descricao.innerHTML = `
                <h1>${album.name}</h1>
                <p>Artista(s): ${album.artists.map(artist => artist.name).join(", ")}</p>
                <p>Lançamento: ${album.release_date}</p>
                <p>Total de Músicas: ${album.total_tracks}</p>
            `;

            albumCard.appendChild(descricao);
            container.appendChild(albumCard);
        });
    } catch (error) {
        console.error("Erro na função loadAlbums:", error);
    }
}

// Função principal para carregar álbuns ao iniciar a página
loadAlbums();
