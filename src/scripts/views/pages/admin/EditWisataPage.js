import WisataSource from "../../../data/wisata-source";
import UrlParser from "../../../routes/url-parser";
import Swal from "sweetalert2";
import L from 'leaflet';

const EditWisataPage = {
  async render() {
    return `
      <div class="container-fluid">
        <div class="row">
          <sidebar-element></sidebar-element>
          <div class="col-md-9 ms-sm-auto col-lg-10 p-0" id="container-right">
            <navbar-admin-element></navbar-admin-element>
            <div class="px-md-3 mt-md-3 mb-5" id="content_container">
              <div class="card shadow p-4">
                <h3 class="text-center title_items_sidebar">Edit Wisata</h3>
                <form class="editWisataForm">
                  <div class="mb-3">
                    <label for="inputNama" class="form-label">Nama Wisata</label>
                    <input type="text" class="form-control" id="inputNama" required>
                  </div>
                  <div class="mb-3">
                    <label for="inputKategori" class="form-label">Kategori</label>
                    <input type="text" class="form-control" id="inputKategori" required>
                  </div>
                  <div class="mb-3">
                    <label for="inputLokasi" class="form-label">Lokasi</label>
                    <input type="text" class="form-control" id="inputLokasi" required>
                  </div>
                  <div class="mb-3">
                    <label for="inputDeskripsi" class="form-label">Deskripsi</label>
                    <textarea class="form-control" id="inputDeskripsi" rows="3" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="formFile" class="form-label">Foto Wisata</label>
                    <input class="form-control" type="file" id="formFile" accept="image/*">
                    <div id="previewContainer" class="mt-2">
                      <img id="previewImage" src="" alt="Preview" style="max-width: 200px; display: none;" class="img-thumbnail"/>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Lokasi di Peta</label>
                    <div id="map" style="height: 400px;"></div>
                    <div class="row mt-2">
                      <div class="col-md-6">
                        <label for="inputLatitude" class="form-label">Latitude</label>
                        <input type="text" class="form-control" id="inputLatitude" required>
                      </div>
                      <div class="col-md-6">
                        <label for="inputLongitude" class="form-label">Longitude</label>
                        <input type="text" class="form-control" id="inputLongitude" required>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button type="button" class="btn btn-secondary" id="btnBack">Kembali</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
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
    const form = document.querySelector(".editWisataForm");
    const url = UrlParser.parseActiveUrlWithoutCombiner();

    // Active sidebar
    const navLink = document.getElementById("wisata-link");
    navLink.classList.add("active");

    // Tambahkan event listener untuk tombol kembali
    const btnBack = document.querySelector("#btnBack");
    btnBack.addEventListener("click", () => {
      window.location.href = '#/wisata';
    });

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
      const response = await WisataSource.getWisataById(url.id);
      const data = response.data;
      
      // Pre-fill form dengan data yang ada
      document.querySelector("#inputNama").value = data.nama;
      document.querySelector("#inputKategori").value = data.kategori;
      document.querySelector("#inputLokasi").value = data.lokasi;
      document.querySelector("#inputDeskripsi").value = data.deskripsi;
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

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Gagal memuat data wisata',
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
      const formData = new FormData();

      formData.append('nama', document.querySelector("#inputNama").value);
      formData.append('kategori', document.querySelector("#inputKategori").value);
      formData.append('lokasi', document.querySelector("#inputLokasi").value);
      formData.append('deskripsi', document.querySelector("#inputDeskripsi").value);
      formData.append('latitude', document.querySelector("#inputLatitude").value);
      formData.append('longitude', document.querySelector("#inputLongitude").value);

      try {
        if (img) {
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onloadend = async () => {
            formData.append('file', reader.result);
            await submitUpdate(formData);
          };
        } else {
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
  }
};

async function submitUpdate(formData) {
  try {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const response = await WisataSource.editWisata(url.id, formData);
    
    if (response && response.data) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data wisata berhasil diupdate',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = '#/wisata';
      });
    } else {
      throw new Error('Gagal mengupdate data');
    }
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  console.error('Error:', error);
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error.response?.data?.msg || 'Gagal mengupdate data wisata',
    showConfirmButton: true
  });
}

export default EditWisataPage;
