import HotelSource from "../../../data/hotel-source";
import Swal from "sweetalert2";
import UrlParser from "../../../routes/url-parser";
import { async } from "regenerator-runtime";
import L from "leaflet";

const EditHotelPage = {
  async render() {
    return `
      <div class="container-fluid">
        <div class="row">
          <sidebar-element></sidebar-element>
          <div class="col-md-9 ms-sm-auto col-lg-10 p-0" id="container-right">
            <navbar-admin-element></navbar-admin-element>
            <div
              class="px-md-3 mt-md-3 mb-5 d-flex align-items-center justify-content-center"
              id="content_container"
            >
              <div class="mt-4 card shadow p-4" style="min-width: 70%;">
                <h3 class="text-center title_items_sidebar">Edit Hotel</h3>
                <form class="editHotelForm">
                  <div class="mb-3">
                    <label for="inputNama" class="form-label">Nama</label>
                    <input type="text" class="form-control" id="inputNama" name="nama" required />
                  </div>
                  <div class="mb-3">
                    <label for="inputLokasi" class="form-label">Lokasi</label>
                    <input type="text" class="form-control" id="inputLokasi" name="lokasi" required />
                  </div>
                  <div class="form-floating mb-3">
                    <textarea
                      class="form-control"
                      placeholder="Deskripsi hotel"
                      id="inputDeskripsi"
                      style="height: 100px"
                      name="deskripsi"
                      required
                    ></textarea>
                    <label for="inputDeskripsi">Deskripsi</label>
                  </div>
                  <div class="mb-3">
                    <label for="formFile" class="form-label">Masukkan foto utama</label>
                    <input class="form-control" type="file" id="formFile" name="file" accept="image/*" />
                    <div id="previewContainer" class="mt-2">
                      <img id="previewImage" src="" alt="Preview" style="max-width: 200px;" class="img-thumbnail"/>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="inputHarga" class="form-label">Harga Maksimal</label>
                    <input
                      type="number"
                      class="form-control"
                      id="inputHarga"
                      name="max_harga"
                      placeholder="Masukkan harga maksimal"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Tipe Kamar</label>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputSingle" name="tipeKamar" value="single" />
                      <label class="form-check-label" for="inputSingle">Single</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputDouble" name="tipeKamar" value="double" />
                      <label class="form-check-label" for="inputDouble">Double</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputSuite" name="tipeKamar" value="suite" />
                      <label class="form-check-label" for="inputSuite">Suite</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Fasilitas</label>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputAC" name="ac" />
                      <label class="form-check-label" for="inputAC">AC</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputSarapan" name="sarapan" />
                      <label class="form-check-label" for="inputSarapan">Sarapan</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputTV" name="tv" />
                      <label class="form-check-label" for="inputTV">TV</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputInternet" name="internet" />
                      <label class="form-check-label" for="inputInternet">Internet</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputKolamRenang" name="kolam_renang" />
                      <label class="form-check-label" for="inputKolamRenang">Kolam Renang</label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="inputParkir" name="tempat_parkir_luas" />
                      <label class="form-check-label" for="inputParkir">Tempat Parkir Luas</label>
                    </div>
                  </div>
                  <div class="row">
                    <div class="mb-3 col-6">
                      <label for="inputLatitude" class="form-label">Latitude</label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputLatitude"
                        name="latitude"
                        placeholder="Masukkan Latitude"
                      />
                    </div>
                    <div class="mb-3 col-6">
                      <label for="inputLongitude" class="form-label">Longitude</label>
                      <input
                        type="text"
                        class="form-control"
                        id="inputLongitude"
                        name="longitude"
                        placeholder="Masukkan Longitude"
                      />
                    </div>
                  </div>
                  <div class="mb-3" id="map" style="height: 60vh; z-index: 0;"></div>
                  <div class="d-flex gap-2 justify-content-end mt-4">
                    <a href="#/hotel" class="btn btn-secondary px-4">Batal</a>
                    <button type="submit" class="btn_edit btn px-4">Simpan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const form = document.querySelector(".editHotelForm");
    const url = UrlParser.parseActiveUrlWithoutCombiner();

    // active side bar
    const navLink = document.getElementById("hotel-link");
    navLink.classList.add("active");

    // Inisialisasi map
    let map = L.map("map").setView([-7.797068, 110.370529], 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.Control.geocoder().addTo(map);

    let marker;

    const updateMarker = (lat, lng) => {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 14);
    };

    // Ambil dan tampilkan data yang sudah ada
    try {
      const response = await HotelSource.getHotelById(url.id);
      const data = response.data;
      
      // Pre-fill form dengan data yang ada
      document.querySelector("#inputNama").value = data.nama;
      document.querySelector("#inputLokasi").value = data.lokasi;
      document.querySelector("#inputDeskripsi").value = data.deskripsi;
      document.querySelector("#inputHarga").value = data.max_harga;
      document.querySelector("#inputLatitude").value = data.latitude;
      document.querySelector("#inputLongitude").value = data.longitude;

      // Tampilkan foto yang sudah ada
      const previewImage = document.querySelector("#previewImage");
      if (data.url) {
        previewImage.src = data.url;
        previewImage.style.display = "block";
      }

      // Set marker jika ada koordinat
      if (data.latitude && data.longitude) {
        updateMarker(parseFloat(data.latitude), parseFloat(data.longitude));
      }

      // Pre-fill fasilitas
      try {
        const fasilitas = typeof data.fasilitas === 'string' ? 
          JSON.parse(data.fasilitas) : data.fasilitas;
        
        if (fasilitas.ac) document.querySelector("#inputAC").checked = true;
        if (fasilitas.sarapan) document.querySelector("#inputSarapan").checked = true;
        if (fasilitas.tv) document.querySelector("#inputTV").checked = true;
        if (fasilitas.internet) document.querySelector("#inputInternet").checked = true;
        if (fasilitas.kolam_renang) document.querySelector("#inputKolamRenang").checked = true;
        if (fasilitas.tempat_parkir_luas) document.querySelector("#inputParkir").checked = true;
      } catch (error) {
        console.error('Error parsing fasilitas:', error);
      }

      // Pre-fill type_kamar
      try {
        const type_kamar = typeof data.type_kamar === 'string' ? 
          JSON.parse(data.type_kamar) : data.type_kamar;
        
        if (Array.isArray(type_kamar)) {
          type_kamar.forEach(type => {
            const checkbox = document.querySelector(`input[value="${type}"]`);
            if (checkbox) checkbox.checked = true;
          });
        }
      } catch (error) {
        console.error('Error parsing tipe kamar:', error);
      }

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data hotel',
      });
    }

    // Preview foto baru yang dipilih
    const formFile = document.querySelector("#formFile");
    formFile.addEventListener("change", function() {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const previewImage = document.querySelector("#previewImage");
          previewImage.src = e.target.result;
          previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });

    // Map click event
    map.on("click", (e) => {
      document.querySelector("#inputLatitude").value = e.latlng.lat;
      document.querySelector("#inputLongitude").value = e.latlng.lng;
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

    // Form submission
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const img = document.querySelector("#formFile").files[0];
      const fasilitas = JSON.stringify({
        ac: document.querySelector("#inputAC").checked,
        sarapan: document.querySelector("#inputSarapan").checked,
        tv: document.querySelector("#inputTV").checked,
        internet: document.querySelector("#inputInternet").checked,
        kolam_renang: document.querySelector("#inputKolamRenang").checked,
        tempat_parkir_luas: document.querySelector("#inputParkir").checked,
      });

      const type_kamar = JSON.stringify(
        Array.from(document.querySelectorAll("input[name='tipeKamar']:checked"))
          .map(input => input.value)
      );

      const formData = new FormData();
      
      // Data dasar
      formData.append('nama', document.querySelector("#inputNama").value);
      formData.append('lokasi', document.querySelector("#inputLokasi").value);
      formData.append('deskripsi', document.querySelector("#inputDeskripsi").value);
      formData.append('max_harga', document.querySelector("#inputHarga").value);
      formData.append('type_kamar', type_kamar);
      formData.append('fasilitas', fasilitas);

      // Koordinat
      const latitude = document.querySelector("#inputLatitude").value;
      const longitude = document.querySelector("#inputLongitude").value;
      formData.append('latitude', latitude || null);
      formData.append('longitude', longitude || null);

      try {
        if (img) {
          // Jika ada file baru
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onloadend = async () => {
            formData.append('file', reader.result);
            await submitUpdate(formData);
          };
        } else {
          // Jika tidak ada file baru, ambil gambar yang sudah ada
          const currentImage = document.querySelector("#previewImage").src;
          const response = await fetch(currentImage);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            formData.append('file', reader.result);
            await submitUpdate(formData);
          };
        }
      } catch (error) {
        handleError(error);
      }
    });

    async function submitUpdate(formData) {
      try {
        const response = await HotelSource.editHotel(url.id, formData);
        if (response.data) {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Data hotel berhasil diupdate',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = '#/hotel';
          });
        } else {
          throw new Error(response.response?.data?.msg || 'Gagal mengupdate data');
        }
      } catch (error) {
        throw error;
      }
    }

    function handleError(error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.msg || 'Gagal mengupdate data hotel',
        showConfirmButton: true
      });
    }
  },
};

export default EditHotelPage;
