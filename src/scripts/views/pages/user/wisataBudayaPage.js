import WisataSource from "../../../data/wisata-source";

const wisataBudayaPage = {
  async render() {
    return `
      <section class="alamItemCard p-0">
        <div class="heroBudaya">
          <div class="hero_inner">
            <h1 tabindex="0" class="hero_title">
              WISATA BUDAYA
            </h1>
            <p tabindex="0" class="hero_tagline">
              Temukan Wisata Budaya<span class="span_tagline">
                yang Anda Inginkan</span>
            </p>
          </div>
        </div>
        <div class="container mt-5">
          <!-- Search Bar -->
          <div class="search-container mb-4">
            <div class="row justify-content-center">
              <div class="col-md-6">
                <div class="input-group">
                  <input type="text" id="searchInput" class="form-control" placeholder="Cari wisata...">
                  <button class="btn btn-search" type="button" id="searchButton">
                    <i class="bx bx-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Wisata Cards Container -->
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" id="wisata-content">
            <!-- Wisata cards will be inserted here -->
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const budayaLink = document.getElementById("link-budaya");
    budayaLink.classList.add("active");

    const wisataContent = document.getElementById("wisata-content");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    let wisataData = [];

    const renderWisataCards = (filteredData) => {
      wisataContent.innerHTML = "";
      filteredData.forEach((data) => {
        if (data.kategori === "Budaya") {
          wisataContent.innerHTML += `
            <div class="col">
              <div class="wisata-card h-100"
                data-aos="fade-up"
                data-aos-delay="50"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
              >
                <img src="${data.url}" class="card-img-top" alt="${data.nama}" style="height: 200px; object-fit: cover">
                <div class="p-3">
                  <h5 class="card-title fw-bold">
                    <a href="/#/detail/${data.id}" class="text-decoration-none">${data.nama}</a>
                  </h5>
                  <p class="location-text d-flex align-items-center gap-2 mt-2">
                    <i class='bx bxs-map'></i> ${data.lokasi}
                  </p>
                  <p class="card-text opacity-75 mt-2">${data.deskripsi.substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          `;
        }
      });
    };

    const handleSearch = () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredWisata = wisataData.filter(data => 
        data.nama.toLowerCase().includes(searchTerm) && data.kategori === "Budaya"
      );
      renderWisataCards(filteredWisata);
    };

    try {
      const response = await WisataSource.getWisata();
      if (response && response.data) {
        wisataData = response.data;
        renderWisataCards(wisataData);

        // Add event listeners for search
        searchButton.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

export default wisataBudayaPage;
