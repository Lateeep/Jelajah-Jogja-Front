import UrlParser from "../../../routes/url-parser";
import WisataSource from "../../../data/wisata-source";
import HotelSource from "../../../data/hotel-source";
import ReviewSource from "../../../data/review-source";
import LikeButtonInitiator from "../../../utils/favorit-hotel-button-initiator";
import moment from "moment";
import { data } from "jquery";
import L from 'leaflet';
import Swal from 'sweetalert2';

const Detail = {
  async render() {
    return `
      <div class="container-fluid p-0">
        <navbar-element></navbar-element>
        
        <!-- Hero Image -->
        <div class="hotel-hero">
          <img src="" alt="Hotel Image" id="hotelImage" class="w-100" style="height: 750px; object-fit: cover;">
        </div>

        <!-- Hotel Info Section -->
        <div class="container py-5">
          <div class="row">
            <div class="col-md-7">
              <h1 id="hotelName" class="hotel-detail-title mb-3"></h1>
              
              <div class="location mb-4">
                <i class="bi bi-geo-alt-fill text-danger"></i>
                <span id="hotelLocation" class="text-secondary"></span>
              </div>

              <div class="price mb-4">
                <h5 class="mb-2">Harga</h5>
                <div class="price-tag">Rp. <span id="hotelPrice"></span></div>
              </div>

              <div class="room-types mb-4">
                <h5 class="mb-2">Tipe Kamar</h5>
                <div class="d-flex flex-wrap gap-2" id="roomTypes">
                  <!-- Room types badges will be inserted here -->
                </div>
              </div>

              <div class="facilities mb-4">
                <h5 class="mb-2">Fasilitas</h5>
                <div class="d-flex flex-wrap gap-2" id="facilities">
                  <!-- Facilities badges will be inserted here -->
                </div>
              </div>

              <!-- Tambahkan section deskripsi -->
              <div class="description mb-4">
                <h5 class="mb-2">Deskripsi</h5>
                <div class="description-content" id="hotelDescription">
                  <!-- Description will be inserted here -->
                </div>
              </div>
            </div>

            <div class="col-md-5">
              <div class="map-container">
                <div id="map" style="height: 400px; border-radius: 8px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wisata Terdekat Section -->
        <div class="container mt-5">
          <h3 class="fw-bold mb-4">Wisata Terdekat</h3>
          <div class="wisata-slider-container">
            <div class="wisata-wrapper" id="wisata-terdekat">
              <!-- Wisata cards akan diisi di sini -->
            </div>
            <button class="slider-nav prev" id="prevWisataBtn">&lt;</button>
            <button class="slider-nav next" id="nextWisataBtn">&gt;</button>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    try {
      const response = await HotelSource.getHotelById(url.id);
      const hotel = response.data;

      // Set hotel info
      document.getElementById('hotelImage').src = hotel.url;
      document.getElementById('hotelName').textContent = hotel.nama;
      document.getElementById('hotelLocation').textContent = hotel.lokasi;
      document.getElementById('hotelPrice').textContent = new Intl.NumberFormat('id-ID').format(hotel.max_harga);

      // Set room types
      const roomTypes = JSON.parse(hotel.type_kamar);
      const roomTypesContainer = document.getElementById('roomTypes');
      roomTypes.forEach(type => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-info';
        badge.textContent = type.toUpperCase();
        roomTypesContainer.appendChild(badge);
      });

      // Set facilities
      const facilities = JSON.parse(hotel.fasilitas);
      const facilitiesContainer = document.getElementById('facilities');
      Object.entries(facilities).forEach(([key, value]) => {
        if (value) {
          const badge = document.createElement('span');
          badge.className = 'badge bg-success';
          badge.textContent = key.replace(/_/g, ' ').toUpperCase();
          facilitiesContainer.appendChild(badge);
        }
      });

      // Set description
      document.getElementById('hotelDescription').textContent = hotel.deskripsi;

      // Initialize map
      const map = L.map('map').setView([hotel.latitude, hotel.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      L.marker([hotel.latitude, hotel.longitude], { icon }).addTo(map)
        .bindPopup(hotel.nama)
        .openPopup();

      // Get nearby wisata
      const wisataResponse = await WisataSource.getWisata();
      const wisataList = wisataResponse.data;
      const nearbyWisata = this._getNearbyWisata(
        wisataList,
        hotel.latitude,
        hotel.longitude,
        10, // radius in km
        5  // max results
      );

      // Render nearby wisata
      this._renderNearbyWisata(nearbyWisata);

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data',
      });
    }
  },

  _getNearbyWisata(wisataList, hotelLat, hotelLng, radius, maxResults) {
    const R = 6371; // Earth's radius in km
    
    const nearby = wisataList
      .map(wisata => {
        const dLat = this._toRad(wisata.latitude - hotelLat);
        const dLon = this._toRad(wisata.longitude - hotelLng);
        const lat1 = this._toRad(hotelLat);
        const lat2 = this._toRad(wisata.latitude);

        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return { ...wisata, distance };
      })
      .filter(wisata => wisata.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);

    return nearby;
  },

  _toRad(value) {
    return value * Math.PI / 180;
  },

  _renderNearbyWisata(wisataList) {
    const container = document.getElementById('wisata-terdekat');
    container.innerHTML = '';

    wisataList.forEach(wisata => {
      container.innerHTML += `
        <div class="wisata-slide">
          <div class="wisata-card">
          <a href="#/detail/${wisata.id}">
            <img src="${wisata.url}" alt="${wisata.nama}">
            <div class="wisata-info">
              <h5>${wisata.nama}</h5>
              <p class="distance">Jarak: ${wisata.distance.toFixed(1)} km</p>
            </div>
            </a>
          </div>
        </div>
      `;
    });

    // Tambahkan event listener untuk slider buttons
    const prevWisataBtn = document.getElementById('prevWisataBtn');
    const nextWisataBtn = document.getElementById('nextWisataBtn');
    const wrapper = container;
    
    nextWisataBtn.addEventListener('click', () => {
      wrapper.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    });
    
    prevWisataBtn.addEventListener('click', () => {
      wrapper.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    });
  }
};

// Tambahkan fungsi untuk menginisialisasi map
async function loadMap(latitude, longitude, hotelName) {
  const map = L.map('map').setView([latitude, longitude], 13);

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
    .bindPopup(hotelName)
    .openPopup();
}

async function initMap(hotelData) {
  if (hotelData && hotelData.latitude && hotelData.longitude) {
    loadMap(
      parseFloat(hotelData.latitude), 
      parseFloat(hotelData.longitude), 
      hotelData.nama
    );
  }
}

export default Detail;
