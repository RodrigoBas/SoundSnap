// Função para acessar o token
async function acess() {
    let c_id = "c39f13e6b0b9496882f544f1a9456d7a";
    let c_sct = "b819c1e4cca44124bd66cbc9b5e74e79";
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: c_id,
            client_secret: c_sct
        }),
    });
    let data = await response.json();
    return data;
}

// Função para buscar álbuns aleatórios
async function get_rand(token, obj) {
    const characters = ['%25a%25', 'a%25', '%25a', '%25e%25', 'e%25', '%25e', '%25i%25', 'i%25', '%25i', '%25o%25', 'o%25', '%25o', '%25u%25', 'u%25', '%25u'];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    const randomOffset = Math.floor(Math.random() * 999);
    const url = `https://api.spotify.com/v1/search?query=${randomCharacter}&offset=${randomOffset}&limit=1&type=${obj}&market=NL`;

    const result = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token.access_token}` }
    });
    return await result.json();
}

// Função para exibir os álbuns no feed e redirecionar ao clicar
async function feed(token, offset = 0) {
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=10&offset=${offset}`, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
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
        
        // Adiciona o evento de clique para armazenar o ID do álbum e redirecionar
        albumImage.addEventListener("click", () => {
            localStorage.setItem("selectedAlbumId", album.id);
            window.location.href = "album.html";
        });

        albumCard.appendChild(albumImage);

        // Cria a seção de descrição do álbum
        const descricao = document.createElement("div");
        descricao.classList.add("descricao");
        descricao.innerHTML = `
            <h1>${album.name}</h1>
            <p>Artista: ${album.artists.map(artist => artist.name).join(", ")}</p>
            <p>Lançamento: ${album.release_date}</p>
        `;

        albumCard.appendChild(descricao);
        container.appendChild(albumCard);
    });
}

// Função principal
async function main() {
    const token = await acess();
    await feed(token, 0); // Carrega o feed inicial de álbuns
}

main(); // Executa a função principal ao carregar a página
