// app.js

// Adicione seu token aqui
const TOKEN = 'BQB_zJUvjDrM4E0-T44BwkWNpQZqa63Gqhd3M0yYlaKUnoILkgGpVoceQfozc23IBUEjI1izZtV6KJBD1O-tRdqmGP5Q64ItjEmjCjc9_1Bq4fUT0ucwFzwvhPyycHbXoLJ8OzhRkpz27foyzz2vgsle77675VUy3b-fRNIUqdpwsh6OwbsZhYBzYWOBg5Cb0xGofsyWZeDZ_YWA0TyMjGbrKsNwyRo0sMK7xPsWvebkjuAqozPrh0drRvoJYJ6qaUrrxbtZ9-9oOEnsncdmg4HEqu7vpXbWQP52';

async function fetchAlbums() {
  try {
    // Gera um offset aleatório para buscar diferentes álbuns
    const randomOffset = Math.floor(Math.random() * 100); // Ajuste o limite de acordo com o total de álbuns disponíveis

    // Define o número de álbuns a serem exibidos
    const limit = 10;

    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}&offset=${randomOffset}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    const data = await response.json();
    displayAlbums(data.albums.items);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayAlbums(albums) {
  const container = document.getElementById('albums-container');
  container.innerHTML = ''; // Limpa o container antes de renderizar novos álbuns

  albums.forEach((album, index) => {
    const albumCard = document.createElement('div');
    albumCard.classList.add('album-card');
    
    // Adiciona a classe "album-card-right" para álbuns em posições ímpares
    if (index % 2 !== 0) {
      albumCard.classList.add('album-card-right');
    }

    albumCard.innerHTML = `
      <img src="${album.images[0].url}" alt="${album.name}">
      <div class="album-info">
        <h3>${album.artists[0].name}</h3>
        <p>Álbum: ${album.name}</p>
        <p>Músicas: ${album.total_tracks}</p>
        <p class="date">Lançamento: ${new Date(album.release_date).toLocaleDateString()}</p>
      </div>
    `;
    container.appendChild(albumCard);
  });
}


// Evento de busca
document.getElementById('search').addEventListener('input', function (event) {
  const query = event.target.value;
  if (query) {
    searchAlbums(query);
  } else {
    fetchAlbums();
  }
});

async function searchAlbums(query) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });
    const data = await response.json();
    displayAlbums(data.albums.items);
  } catch (error) {
    console.error('Error searching data:', error);
  }
}

// Evento "Me Surpreenda"
document.getElementById('surprise-me').addEventListener('click', fetchAlbums);

// Inicializa com álbuns aleatórios ao carregar a página
fetchAlbums();
