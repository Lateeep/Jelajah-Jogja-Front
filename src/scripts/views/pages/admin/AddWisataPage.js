import WisataSource from "../../../data/wisata-source";
import { async } from "regenerator-runtime";
import Swal from "sweetalert2";

const AddWisataPage = {
  async render() {
    return `
      <div class="container-fluid">
        <div class="row">
          <sidebar-element></sidebar-element>
          <div class="col-md-9 ms-sm-auto col-lg-10" id="container-right">
            <navbar-admin-element></navbar-admin-element>
            <div
              class="px-md-3 mt-md-3 mb-5 d-flex align-items-center justify-content-center"
              id="content_container"
            >
              <div class="mt-4 card shadow p-4" style="min-width: 70%;">
                <h3 class="text-center title_items_sidebar">Tambah Wisata</h3>
                <form class="addWisataForm">
                  <div class="mb-3">
                    <label for="inputNama" class="form-label">Nama</label>
                    <input
                      type="text"
                      class="form-control"
                      id="inputNama"
                      name="nama"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="inputKategori" class="form-label">Kategori</label>
                    <input
                      type="text"
                      class="form-control"
                      id="inputKategori"
                      name="kategori"
                    />
                  </div>
                  <div class="mb-3">
                    <label for="inputLokasi" class="form-label">Lokasi</label>
                    <input
                      type="text"
                      class="form-control"
                      id="inputLokasi"
                      name="lokasi"
                    />
                  </div>
                  <div class="form-floating mb-3">
                    <textarea
                      class="form-control"
                      placeholder="Deskripsi wisata"
                      id="inputDeskripsi"
                      style="height: 100px"
                      name="deskripsi"
                    ></textarea>
                    <label for="inputDeskripsi">Deskripsi</label>
                  </div>
                  <div class="mb-3">
                    <label for="formFile" class="form-label">Masukan foto utama</label>
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      name="file"
                    />
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
                  <button type="submit" class="btn btn-primary px-4 my-3">Simpan</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Aktifkan sidebar
    const navLink = document.getElementById("wisata-link");
    navLink.classList.add("active");

    // Inisialisasi peta
    let map = L.map("map").setView([-7.797068, 110.370529], 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.Control.geocoder().addTo(map);

    let marker; // Marker untuk lokasi pengguna

    // Fungsi untuk memperbarui marker di peta
    const updateMarker = (lat, lng) => {
      if (marker) {
        map.removeLayer(marker); // Hapus marker sebelumnya
      }
      marker = L.marker([lat, lng]).addTo(map); // Tambahkan marker baru
      map.setView([lat, lng], 14); // Fokuskan peta ke lokasi baru
    };

    // Event klik pada peta
    map.on("click", (e) => {
      document.querySelector("#inputLatitude").value = e.latlng.lat;
      document.querySelector("#inputLongitude").value = e.latlng.lng;
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

    // Event input untuk latitude dan longitude
    document.querySelector("#inputLatitude").addEventListener("input", () => {
      const lat = parseFloat(document.querySelector("#inputLatitude").value);
      const lng = parseFloat(document.querySelector("#inputLongitude").value);
      if (!isNaN(lat) && !isNaN(lng)) {
        updateMarker(lat, lng);
      }
    });

    document.querySelector("#inputLongitude").addEventListener("input", () => {
      const lat = parseFloat(document.querySelector("#inputLatitude").value);
      const lng = parseFloat(document.querySelector("#inputLongitude").value);
      if (!isNaN(lat) && !isNaN(lng)) {
        updateMarker(lat, lng);
      }
    });

    // Eksekusi tambah wisata
    const form = document.querySelector(".addWisataForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const f = document.querySelector("#formFile");
      const img = f.files[0];
      if (!img) {
        Swal.fire({
          icon: "error",
          title: `Masukan file image!`,
          text: `Tolong ulangi!`,
          showConfirmButton: false
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = async () => {
        const data = {
          nama: document.querySelector("#inputNama").value,
          kategori: document.querySelector("#inputKategori").value,
          lokasi: document.querySelector("#inputLokasi").value,
          deskripsi: document.querySelector("#inputDeskripsi").value,
          latitude: document.querySelector("#inputLatitude").value || null,
          longitude: document.querySelector("#inputLongitude").value || null,
          file: reader.result
        };

        try {
          const response = await WisataSource.addWisata(data);
          if (response.data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Berhasil Menambah Wisata!",
              showConfirmButton: false,
              timer: 1500
            });
            window.location.replace("#/wisata");
          } else {
            Swal.fire({
              icon: "error",
              title: `${response.response.data.msg}!`,
              text: `Tolong ulangi!`,
              showConfirmButton: false
            });
          }
        } catch (error) {
          console.error(error);
        }
      };
    });
  }
};

export default AddWisataPage;
