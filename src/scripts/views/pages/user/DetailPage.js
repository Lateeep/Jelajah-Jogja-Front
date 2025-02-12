import "regenerator-runtime";
import UrlParser from "../../../routes/url-parser";
import WisataSource from "../../../data/wisata-source";
import HotelSource from "../../../data/hotel-source";
import LikeButtonInitiator from "../../../utils/favorit-wisata-button-initiator";
import L from 'leaflet';

const Detail = {
  async render() {
    return `
      <div class="container-like"></div>
      <div id="likeButtonContainer"></div>
      <section class="detailWisata" style="overflow-x: hidden">
        <!-- Hero Image Section -->
        <div class="heroDetailWisata" style="position: relative; height: 80vh; overflow: hidden;">
          <div class="overlay"></div>
          <div id="posts" style="height: 100%;">
            <!-- Image akan diisi melalui JavaScript -->
          </div>
        </div>

        <!-- Content Section -->
        <div class="container mt-4">
          <div class="row">
            <!-- Info dan Deskripsi Column -->
            <div class="col-md-7">
              <h1 class="fw-bold mb-2" id="title-wisata"></h1>
              <p class="location d-flex align-items-center gap-2 mb-4">
                <i class="bx bxs-map"></i>
                <span id="location-wisata"></span>
              </p>
              <div id="deskripsi-wisata" class="pe-md-4" style="text-align: justify;">
                <!-- Deskripsi akan diisi melalui JavaScript -->
              </div>
            </div>
            
            <!-- Map Column -->
            <div class="col-md-5">
              <div id="map" style="height: 400px; width: 100%; border-radius: 10px; border: 1px solid #ddd;"></div>
            </div>
          </div>
        </div>

        <!-- Penginapan Terdekat Section -->
        <div class="container mt-5">
          <h3 class="fw-bold mb-4">Penginapan Terdekat</h3>
          <div class="penginapan-slider-container">
            <div class="penginapan-slider" id="penginapan-terdekat">
              <!-- Penginapan cards akan diisi di sini -->
            </div>
            <button class="slider-nav prev" id="prevBtn">&lt;</button>
            <button class="slider-nav next" id="nextBtn">&gt;</button>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const wisata = await WisataSource.getWisataById(url.id);
    const hotels = await HotelSource.getAllHotel();

    // Render wisata details
    document.querySelector('#title-wisata').textContent = wisata.data.nama;
    document.querySelector('#location-wisata').textContent = wisata.data.lokasi;
    document.querySelector('#deskripsi-wisata').textContent = wisata.data.deskripsi;
    document.querySelector('#posts').style.backgroundImage = `url(${wisata.data.url})`;
    document.querySelector('#posts').style.backgroundSize = 'cover';
    document.querySelector('#posts').style.backgroundPosition = 'center';

    // Initialize map
    if (wisata.data.latitude && wisata.data.longitude) {
      initMap();
    }

    // Like button
    const likeButtonContainer = document.querySelector('#likeButtonContainer');
    await LikeButtonInitiator.init({
      likeButtonContainer,
      wisata: {
        id: wisata.data.id,
        nama: wisata.data.nama,
        deskripsi: wisata.data.deskripsi,
        lokasi: wisata.data.lokasi,
        url: wisata.data.url,
      },
    });

    // Render nearby hotels
    if (hotels.data && hotels.data.length > 0) {
      const nearbyHotels = getNearestHotels(wisata.data, hotels.data);
      this._renderNearbyPenginapan(nearbyHotels);
    }
  },

  _renderNearbyPenginapan(penginapanList) {
    const container = document.getElementById('penginapan-terdekat');
    container.innerHTML = '';

    penginapanList.forEach(penginapan => {
      container.innerHTML += `
        <div class="penginapan-slide">
          <div class="penginapan-card">
            <a href="#/detailhotel/${penginapan.id}">
            <img src="${penginapan.url}" alt="${penginapan.nama}">
            <div class="penginapan-info">
              <h5>${penginapan.nama}</h5>
              <p class="distance">Jarak: ${penginapan.distance.toFixed(1)} km</p>
            </div>
            </a>
          </div>
        </div>
      `;

    });

    // Tambahkan event listener untuk slider buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const wrapper = container;
    
    nextBtn.addEventListener('click', () => {
      wrapper.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    });
    
    prevBtn.addEventListener('click', () => {
      wrapper.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    });
  }
};

// Helper functions for map and distance calculation
function loadMap(latitude, longitude) {
  const map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const icon = L.icon({
    iconUrl: './icons/icon_wisata_2.png',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  L.marker([latitude, longitude], { icon }).addTo(map)
    .bindPopup('Lokasi Wisata')
    .openPopup();
}

async function initMap() {
  const url = UrlParser.parseActiveUrlWithoutCombiner();
  const wisata = await WisataSource.getWisataById(url.id);
  
  if (wisata && wisata.data) {
    const latitude = wisata.data.latitude;
    const longitude = wisata.data.longitude;

    // Inisialisasi peta
    const map = L.map('map').setView([latitude, longitude], 13);

    // Menambahkan layer peta
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Membuat ikon
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Ikon default Leaflet
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png', // Bayangan ikon
      iconSize: [25, 41], // Ukuran ikon
      iconAnchor: [12, 41], // Titik yang akan digunakan sebagai anchor
      popupAnchor: [1, -34], // Titik yang akan digunakan untuk popup
    });

    // Menambahkan marker ke peta
    L.marker([latitude, longitude], { icon }).addTo(map)
      .bindPopup(wisata.data.nama) // Ganti dengan nama wisata yang sesuai
      .openPopup();
  }
}

function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

function getNearestHotels(wisata, hotels, limit = 5) {
  return hotels
    .map(hotel => ({
      ...hotel,
      distance: getHaversineDistance(
        parseFloat(wisata.latitude),
        parseFloat(wisata.longitude),
        parseFloat(hotel.latitude),
        parseFloat(hotel.longitude)
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

export default Detail;
