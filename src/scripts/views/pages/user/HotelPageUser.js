import HotelSource from "../../../data/hotel-source";
import WisataSource from "../../../data/wisata-source";
import Swal from "sweetalert2";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const HotelPageUser = {
  // Fungsi helper untuk konversi derajat ke radian
  toRad(value) {
    return value * Math.PI / 180;
  },

  // Fungsi untuk menghitung jarak dengan Haversine
  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
             Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Jarak dalam kilometer
    
    return distance;
  },

  async render() {
    return `
      <section class="HotelItemCard mt-0">
        <div class="heroHotel">
          <div class="hero_inner">
            <h1 tabindex="0" class="hero_title">
              PENGINAPAN
            </h1>
            <p tabindex="0" class="hero_tagline">
              Temukan Penginapan<span class="span_tagline">
                yang Anda Inginkan</span>
            </p>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <h2 class="w-100 gallery-title text-center mb-4">CARI PENGINAPAN</h2>
            
            <!-- Tombol Filter -->
            <button id="toggleFilter" class="btn btn-primary mb-3">
              Tampilkan Filter
            </button>

            <!-- Form Filter -->
            <div id="filterSection" class="filter-section" style="display: none;">
              <div class="card p-4">
                <form id="filterForm">
                  <!-- Pilih Wisata -->
                  <div class="mb-3">
                    <label class="form-label">Pilih Lokasi Wisata:</label>
                    <div class="position-relative">
                      <input 
                        type="text" 
                        id="wisataInput" 
                        class="form-control" 
                        placeholder="Ketik nama wisata..." 
                        autocomplete="off"
                        required
                      >
                      <input type="hidden" id="selectedWisataId">
                      <div id="wisataSuggestions" class="suggestion-box position-absolute w-100 d-none">
                        <!-- Suggestions akan muncul di sini -->
                      </div>
                    </div>
                  </div>

                  <!-- Harga Maksimal -->
                  <div class="mb-3">
                    <label class="form-label">Harga Maksimal per Malam:</label>
                    <input type="number" id="maxPrice" class="form-control" required>
                  </div>

                  <!-- Tipe Kamar -->
                  <div class="mb-3">
                    <label class="form-label">Tipe Kamar:</label>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="single" name="roomType" value="single">
                      <label class="form-check-label" for="single">Single</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="double" name="roomType" value="double">
                      <label class="form-check-label" for="double">Double</label>
                    </div>
                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="suite" name="roomType" value="suite">
                      <label class="form-check-label" for="suite">Suite</label>
                    </div>
                  </div>

                  <!-- Fasilitas -->
                  <div class="mb-3">
                    <label class="form-label">Fasilitas yang Dibutuhkan:</label>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="ac" name="facilities">
                          <label class="form-check-label" for="ac">AC</label>
                        </div>
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="tv" name="facilities">
                          <label class="form-check-label" for="tv">TV</label>
                        </div>
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="wifi" name="facilities">
                          <label class="form-check-label" for="wifi">WiFi</label>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="breakfast" name="facilities">
                          <label class="form-check-label" for="breakfast">Sarapan</label>
                        </div>
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="pool" name="facilities">
                          <label class="form-check-label" for="pool">Kolam Renang</label>
                        </div>
                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="parking" name="facilities">
                          <label class="form-check-label" for="parking">Parkir</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary w-100">Terapkan Filter</button>
                </form>
              </div>
            </div>

            <!-- Hasil Rekomendasi -->
            <div id="hotelResults" class="mt-4">
              <div id="hotel-content" class="row g-4">
                <!-- Hotel cards akan ditampilkan di sini -->
              </div>
            </div>

            <!-- Daftar Semua Hotel -->
            <section class="all-hotels mt-5">
              <div class="container">
                <h2 class="text-center mb-4">Daftar Hotel Tersedia</h2>
                
                <!-- Search Bar -->
                <div class="search-container mb-4">
                  <div class="input-group">
                    <input 
                      type="text" 
                      id="searchHotel" 
                      class="form-control" 
                      placeholder="Cari hotel..."
                    >
                    <button class="btn btn-primary" type="button" id="searchButton">
                      <i class="fas fa-search"></i> Cari
                    </button>
                  </div>
                </div>

                <!-- Hotel Cards Container -->
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="allHotelsContainer">
                  <!-- Hotel cards akan ditampilkan di sini -->
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    `;
  },

  async afterRender() {
    // Active Navbar
    const hotelLink = document.getElementById("link-hotel");
    hotelLink.classList.add("active");

    // Toggle Filter
    const toggleFilter = document.getElementById('toggleFilter');
    const filterSection = document.getElementById('filterSection');
    
    toggleFilter.addEventListener('click', () => {
      if (filterSection.style.display === 'none') {
        filterSection.style.display = 'block';
        toggleFilter.textContent = 'Sembunyikan Filter';
      } else {
        filterSection.style.display = 'none';
        toggleFilter.textContent = 'Tampilkan Filter';
      }
    });

    // Implementasi autocomplete untuk wisata
    const wisataInput = document.getElementById('wisataInput');
    const wisataSuggestions = document.getElementById('wisataSuggestions');
    const selectedWisataId = document.getElementById('selectedWisataId');
    let wisataData = [];

    // Ambil data wisata dari database menggunakan WisataSource
    try {
      const response = await WisataSource.getWisata();
      wisataData = response.data;
    } catch (error) {
      console.error('Error loading wisata:', error);
      Swal.fire('Error', 'Gagal memuat data wisata', 'error');
    }

    // Fungsi untuk filter wisata berdasarkan input
    const filterWisata = (searchText) => {
      return wisataData.filter(wisata => 
        wisata.nama.toLowerCase().includes(searchText.toLowerCase())
      );
    };

    // Fungsi untuk menampilkan suggestions
    const showSuggestions = (filteredWisata) => {
      if (filteredWisata.length > 0) {
        wisataSuggestions.innerHTML = `
          <div class="list-group">
            ${filteredWisata.map(wisata => `
              <button 
                type="button" 
                class="list-group-item list-group-item-action suggestion-item"
                data-id="${wisata.id}"
                data-nama="${wisata.nama}"
                data-latitude="${wisata.latitude}"
                data-longitude="${wisata.longitude}"
              >
                ${wisata.nama} - ${wisata.lokasi}
              </button>
            `).join('')}
          </div>
        `;
        wisataSuggestions.classList.remove('d-none');
      } else {
        wisataSuggestions.innerHTML = `
          <div class="list-group">
            <button type="button" class="list-group-item list-group-item-action disabled">
              Tidak ditemukan wisata
            </button>
          </div>
        `;
        wisataSuggestions.classList.remove('d-none');
      }
    };

    // Event listener untuk input wisata
    wisataInput.addEventListener('input', (e) => {
      const searchText = e.target.value;
      if (searchText.length > 0) {
        const filteredWisata = filterWisata(searchText);
        showSuggestions(filteredWisata);
      } else {
        wisataSuggestions.classList.add('d-none');
        selectedWisataId.value = '';
      }
    });

    // Event listener untuk memilih suggestion
    wisataSuggestions.addEventListener('click', (e) => {
      const suggestionItem = e.target.closest('.suggestion-item');
      if (suggestionItem) {
        const wisataId = suggestionItem.dataset.id;
        const wisataNama = suggestionItem.dataset.nama;
        const wisataLat = suggestionItem.dataset.latitude;
        const wisataLong = suggestionItem.dataset.longitude;
        
        wisataInput.value = wisataNama;
        selectedWisataId.value = wisataId;
        // Simpan koordinat wisata untuk perhitungan jarak
        selectedWisataId.dataset.latitude = wisataLat;
        selectedWisataId.dataset.longitude = wisataLong;
        wisataSuggestions.classList.add('d-none');
      }
    });

    // Sembunyikan suggestions saat klik di luar
    document.addEventListener('click', (e) => {
      if (!wisataInput.contains(e.target) && !wisataSuggestions.contains(e.target)) {
        wisataSuggestions.classList.add('d-none');
      }
    });

    // Update form submission
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const wisataId = selectedWisataId.value;
      const wisataLat = selectedWisataId.dataset.latitude;
      const wisataLong = selectedWisataId.dataset.longitude;

      if (!wisataId) {
        Swal.fire('Error', 'Silakan pilih wisata terlebih dahulu', 'error');
        return;
      }

      const maxPrice = document.getElementById('maxPrice').value;
      const selectedRoomTypes = Array.from(document.querySelectorAll('input[name="roomType"]:checked'))
        .map(input => input.value);
      
      const facilities = {
        ac: document.getElementById('ac').checked,
        tv: document.getElementById('tv').checked,
        wifi: document.getElementById('wifi').checked,
        breakfast: document.getElementById('breakfast').checked,
        pool: document.getElementById('pool').checked,
        parking: document.getElementById('parking').checked
      };

      try {
        // Gunakan HotelSource untuk request
        const requestData = {
          wisata_id: wisataId,
          wisata_lat: wisataLat,
          wisata_long: wisataLong,
          max_price: maxPrice,
          room_types: selectedRoomTypes.join(','),
          ...facilities
        };

        const response = await HotelSource.getHotelRecommendations(requestData);
        
        if (response.error) {
          throw new Error(response.message || 'Gagal mendapatkan rekomendasi');
        }
        
        displayHotelResults(response.data, wisataLat, wisataLong, wisataData.nama);
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Gagal mendapatkan rekomendasi hotel'
        });
      }
    });

    // Fungsi untuk menampilkan hasil
    const displayHotelResults = (hotels, wisata_lat, wisata_long, wisataName) => {
      const hotelContainer = document.querySelector('#hotelResults');
      hotelContainer.innerHTML = '';
    
      if (!hotels || hotels.length === 0) {
        hotelContainer.innerHTML = '<p>Tidak ada hotel yang ditemukan</p>';
        return;
      }
    
      const wisataInput = document.getElementById('wisataInput');
      const actualWisataName = wisataInput.value || 'Lokasi Wisata';
    
      hotelContainer.innerHTML = `
        <div class="row">
          <div class="col-md-8">
            <div id="map" style="height: 600px;"></div>
          </div>
          <div class="col-md-4">
            <div id="hotelCards" style="height: 600px; overflow-y: auto;">
              <!-- Hotel cards akan ditampilkan di sini -->
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-12">
            <h3>Detail Perhitungan KNN</h3>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Jarak (km)</th>
                    <th>Harga</th>
                    <th>Tipe Kamar</th>
                    <th>Fasilitas</th>
                    <th>Skor Jarak</th>
                    <th>Skor Harga</th>
                    <th>Skor Kamar</th>
                    <th>Skor Fasilitas</th>
                    <th>Total Skor</th>
                  </tr>
                </thead>
                <tbody>
                ${hotels.map(hotel => {
                  const roomTypes = hotel.type_kamar ? 
                    (typeof hotel.type_kamar === 'string' 
                      ? JSON.parse(hotel.type_kamar).join(', ') 
                      : hotel.type_kamar.join(', ')) 
                    : 'Tidak Tersedia';
                
                  const distanceScore = hotel.calculations?.detail?.distance?.rawScore?.toFixed(4) || 'N/A';
                  const priceScore = hotel.calculations?.detail?.price?.rawScore?.toFixed(4) || 'N/A';
                  const roomTypeScore = hotel.calculations?.roomTypeScore?.toFixed(4) || 'N/A';
                  const facilitiesScore = hotel.calculations?.detail?.facilities?.rawScore?.toFixed(4) || 'N/A';
                  const totalScore = hotel.calculations?.totalScore?.toFixed(4) || 'N/A';
                
                  return `
                    <tr>
                      <td>${hotel.nama}</td>
                      <td>${hotel.distance ? hotel.distance.toFixed(2) : '?'} km</td>
                      <td>Rp ${hotel.max_harga ? hotel.max_harga.toLocaleString() : 'N/A'}</td>
                      <td>${roomTypes}</td>
                      <td>
                        ${hotel.ac ? 'AC, ' : ''}
                        ${hotel.breakfast ? 'Sarapan, ' : ''}
                        ${hotel.tv ? 'TV, ' : ''}
                        ${hotel.wifi ? 'WiFi, ' : ''}
                        ${hotel.pool ? 'Kolam Renang, ' : ''}
                        ${hotel.parking ? 'Parkir' : ''}
                      </td>
                      <td>${distanceScore}</td>
                      <td>${priceScore}</td>
                      <td>${roomTypeScore}</td>
                      <td>${facilitiesScore}</td>
                      <td>${totalScore}</td>
                    </tr>
                  `;
                }).join('')}
                </tbody>
              </table>
            </div>
      `;
    
      const map = L.map('map').setView([parseFloat(wisata_lat), parseFloat(wisata_long)], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    
      const wisataIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    
      const hotelIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    
      L.marker([parseFloat(wisata_lat), parseFloat(wisata_long)], { icon: wisataIcon })
        .bindPopup(`
          <div>
            <h5>${actualWisataName}</h5>
            <p>Lokasi Wisata</p>
          </div>
        `)
        .addTo(map);
    
      const MAX_DISTANCE = 10;
      const radius = MAX_DISTANCE * 1000;
      const circle = L.circle([parseFloat(wisata_lat), parseFloat(wisata_long)], {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.1,
        radius: radius
      }).addTo(map);
    
      const hotelCardsContainer = document.querySelector('#hotelCards');
      hotels.forEach((hotel, index) => {
        const marker = L.marker([parseFloat(hotel.latitude), parseFloat(hotel.longitude)], { icon: hotelIcon })
          .bindPopup(`
            <div>
              <h5>${hotel.nama}</h5>
              <p>${hotel.lokasi}</p>
              <p>Jarak: ${hotel.distance ? hotel.distance.toFixed(2) : '?'} km</p>
            </div>
          `)
          .addTo(map);
    
        marker.on('click', () => {
          const cards = hotelCardsContainer.querySelectorAll('.card.hotel-card-dark');
          if (!cards || !cards[index]) {
            console.log('Target card not found at index:', index);
            return;
          }
    
          const targetCard = cards[index];
          targetCard.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
    
          targetCard.style.transition = 'all 0.3s ease';
          targetCard.style.transform = 'scale(1.02)';
          targetCard.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    
          setTimeout(() => {
            targetCard.style.backgroundColor = '';
            targetCard.style.transform = '';
            targetCard.style.boxShadow = '';
          }, 2000);
    
          console.log('Marker clicked:', {
            hotelName: hotel.nama,
            index: index,
            containerFound: !!hotelCardsContainer,
            cardFound: !!targetCard,
            cardElement: targetCard
          });
        });
    
        hotelCardsContainer.innerHTML += `
          <div class="swiper-slide">
            <div class="card mt-6 mb-3 hotel-card-dark">
              <div class="hotel-content">
                <div class="card-number">${index + 1}</div>
                <h3 class="hotel-title">${hotel.nama}</h3>
                
                <div class="hotel-image-container">
                  <img src="${hotel.url || ''}" class="hotel-image" alt="${hotel.nama}">
                </div>
    
                <div class="hotel-info-text">
                  <p>${hotel.lokasi || ''}</p>
                  <p>Rp ${hotel.max_harga ? hotel.max_harga.toLocaleString('id-ID') : '0'}</p>
                  <p>Jarak: ${hotel.distance ? hotel.distance.toFixed(2) : '?'} km</p>
                </div>
    
                <div class="badge-groups">
                  <div class="facilities-badges">
                    ${hotel.ac ? '<span class="badge-dark facility">AC</span>' : ''}
                    ${hotel.tv ? '<span class="badge-dark facility">TV</span>' : ''}
                    ${hotel.wifi ? '<span class="badge-dark facility">WiFi</span>' : ''}
                    ${hotel.breakfast ? '<span class="badge-dark facility">Breakfast</span>' : ''}
                    ${hotel.pool ? '<span class="badge-dark facility">Pool</span>' : ''}
                    ${hotel.parking ? '<span class="badge-dark facility">Parking</span>' : ''}
                  </div>
    
                  <div class="room-type-badges">
                    ${hotel.single ? '<span class="badge-dark room">Single</span>' : ''}
                    ${hotel.double ? '<span class="badge-dark room">Double</span>' : ''}
                    ${hotel.suite ? '<span class="badge-dark room">Suite</span>' : ''}
                  </div>
                </div>
    
                <div class="button-group">
                  <button class="btn-track" data-wisata-lat="${selectedWisataId.dataset.latitude}" 
                    data-wisata-lng="${selectedWisataId.dataset.longitude}"
                    data-hotel-lat="${hotel.latitude}"
                    data-hotel-lng="${hotel.longitude}">
                    <i class="fas fa-route"></i> Lihat Rute
                  </button>
                  <a href="#/detailhotel/${hotel.id}" class="btn-detail">
                    <i class="fas fa-info-circle"></i> Detail Hotel
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
      });
    
      const bounds = circle.getBounds();
      hotels.forEach(hotel => {
        if (hotel.latitude && hotel.longitude) {
          bounds.extend([hotel.latitude, hotel.longitude]);
        }
      });
      map.fitBounds(bounds);
    
      document.querySelectorAll('.btn-track').forEach(button => {
        button.addEventListener('click', (e) => {
          const wisataLat = e.target.dataset.wisataLat;
          const wisataLng = e.target.dataset.wisataLng;
          const hotelLat = e.target.dataset.hotelLat;
          const hotelLng = e.target.dataset.hotelLng;
    
          localStorage.setItem('trackingPoints', JSON.stringify({
            start: { lat: wisataLat, lng: wisataLng },
            end: { lat: hotelLat, lng: hotelLng }
          }));
    
          window.location.href = '#/map';
        });
      });
    
      requestAnimationFrame(() => {
        const swiperElement = document.querySelector('.mySwipers');
        if (!swiperElement) return;
    
        const swipers = new Swiper(swiperElement, {
          direction: 'vertical',
          slidesPerView: 'auto',
          freeMode: {
            enabled: true,
            sticky: false,
          },
          scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true,
            hide: false,
          },
          mousewheel: true,
          on: {
            init: function() {
              console.log('Swiper initialized');
            }
          }
        });
    
        swiperElement.style.overflow = 'auto';
        swiperElement.style.height = '500px';
      });
    
      const style = document.createElement('style');
      style.textContent = `
        #hotelCards {
          scroll-behavior: smooth;
          padding-right: 10px;
        }
        
        #hotelCards .card {
          margin-bottom: 15px;
        }
        
        #hotelCards .card:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `;
      console.log('Data hotel:', hotels);
      document.head.appendChild(style);
    };
    

    // Tambahkan fungsi helper untuk mendapatkan tipe kamar
    function getTipeKamar(hotel) {
      try {
        let tipeKamarFormatted = '';
        if (hotel.type_kamar) {
          const tipeKamarArray = typeof hotel.type_kamar === 'string' ? 
            JSON.parse(hotel.type_kamar) : hotel.type_kamar;

          const tipeKamarLabels = {
            single: 'Single',
            double: 'Double',
            suite: 'Suite'
          };
          
          if (Array.isArray(tipeKamarArray) && tipeKamarArray.length > 0) {
            tipeKamarFormatted = tipeKamarArray
              .map(tipe => `<span class="badge bg-primary">${tipeKamarLabels[tipe] || tipe}</span>`)
              .join(' ');
          }
        }
        return tipeKamarFormatted || 'Tidak tersedia';
      } catch (error) {
        console.error('Error parsing tipe kamar:', error);
        return 'Tidak tersedia';
      }
    }

    // Fungsi untuk menampilkan semua hotel
    const displayAllHotels = async () => {
      try {
        const response = await fetch('http://localhost:5000/hotel');
        const hotels = await response.json();
        
        const container = document.getElementById('allHotelsContainer');
        
        const renderHotelCard = (hotel) => {
          // Parse type_kamar dari JSON string
          let tipeKamar = [];
          try {
            tipeKamar = JSON.parse(hotel.type_kamar);
            // Kapitalisasi huruf pertama
            tipeKamar = tipeKamar.map(tipe => 
              tipe.charAt(0).toUpperCase() + tipe.slice(1)
            );
          } catch (e) {
            console.error('Error parsing tipe kamar:', e);
          }

          // Parse fasilitas dari JSON string
          let fasilitasObj = {};
          try {
            fasilitasObj = JSON.parse(hotel.fasilitas);
          } catch (e) {
            console.error('Error parsing fasilitas:', e);
          }

          // Konversi objek fasilitas ke array
          const fasilitas = [];
          if (fasilitasObj.ac) fasilitas.push('AC');
          if (fasilitasObj.tv) fasilitas.push('TV');
          if (fasilitasObj.internet) fasilitas.push('WiFi');
          if (fasilitasObj.sarapan) fasilitas.push('Breakfast');
          if (fasilitasObj.kolam_renang) fasilitas.push('Pool');
          if (fasilitasObj.tempat_parkir_luas) fasilitas.push('Parking');

          return `
            <div class="col">
              <a href="#/detailhotel/${hotel.id}" class="hotel-card-link">
                <div class="card mb-3 hotel-card-dark">
                  <div class="hotel-content">
                    <h3 class="hotel-title">${hotel.nama}</h3>
                    
                    <div class="hotel-image-container">
                      <img src="${hotel.url || ''}" class="hotel-image" alt="${hotel.nama}">
                    </div>

                    <div class="hotel-info-text">
                      <p>${hotel.lokasi || ''}</p>
                      <p>Rp ${hotel.max_harga ? hotel.max_harga.toLocaleString('id-ID') : '0'}</p>
                    </div>

                    <div class="badge-groups">
                      <div class="room-type-section">
                        <p class="section-label">Tipe Kamar:</p>
                        <div class="room-type-badges">
                          ${tipeKamar.map(tipe => 
                            `<span class="badge-dark room ${tipe.toLowerCase()}">${tipe}</span>`
                          ).join('')}
                        </div>
                      </div>

                      <div class="facilities-section">
                        <p class="section-label">Fasilitas:</p>
                        <div class="facilities-badges">
                          ${fasilitas.map(fas => 
                            `<span class="badge-dark facility">${fas}</span>`
                          ).join('')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          `;
        };

        // Tampilkan semua hotel
        container.innerHTML = hotels.map(hotel => renderHotelCard(hotel)).join('');

        // Implementasi search functionality
        const searchInput = document.getElementById('searchHotel');
        const searchButton = document.getElementById('searchButton');

        const performSearch = () => {
          const searchTerm = searchInput.value.toLowerCase();
          const filteredHotels = hotels.filter(hotel => 
            hotel.nama.toLowerCase().includes(searchTerm)
          );
          container.innerHTML = filteredHotels.map(hotel => renderHotelCard(hotel)).join('');
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (e) => {
          if (e.key === 'Enter') {
            performSearch();
          }
        });

      } catch (error) {
        console.error('Error fetching hotels:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal memuat daftar hotel!',
        });
      }
    };

    // Panggil fungsi untuk menampilkan semua hotel
    await displayAllHotels();
  },
};

export default HotelPageUser;
