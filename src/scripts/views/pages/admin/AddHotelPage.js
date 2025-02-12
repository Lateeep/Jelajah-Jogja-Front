import HotelSource from "../../../data/hotel-source";
import Swal from "sweetalert2";
import { async } from "regenerator-runtime";

const AddHotelPage = {
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
                <h3 class="text-center title_items_sidebar">Tambah Hotel</h3>
                <form class="addHotelForm">
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
                    <input class="form-control" type="file" id="formFile" name="file" accept="image/*" required />
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
    const navLink = document.getElementById("hotel-link");
    navLink.classList.add("active");

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

    map.on("click", (e) => {
      document.querySelector("#inputLatitude").value = e.latlng.lat;
      document.querySelector("#inputLongitude").value = e.latlng.lng;
      updateMarker(e.latlng.lat, e.latlng.lng);
    });

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

    const form = document.querySelector(".addHotelForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const img = document.querySelector("#formFile").files[0];
      if (!img) {
        Swal.fire({
          icon: "error",
          title: `Masukkan file image!`,
          text: `Tolong ulangi!`,
          showConfirmButton: false
        });
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onloadend = async () => {
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

        const data = {
          nama: document.querySelector("#inputNama").value,
          lokasi: document.querySelector("#inputLokasi").value,
          deskripsi: document.querySelector("#inputDeskripsi").value,
          max_harga: document.querySelector("#inputHarga").value,
          type_kamar: type_kamar,
          fasilitas: fasilitas,
          latitude: document.querySelector("#inputLatitude").value || null,
          longitude: document.querySelector("#inputLongitude").value || null,
          file: reader.result,
          total_rating: 0,
          total_viewers: 0,
          rating: 0
        };

        console.log('Data yang dikirim:', data);

        if (!data.nama || !data.lokasi || !data.deskripsi || !data.max_harga || !data.file || !data.type_kamar.length) {
          Swal.fire({
            icon: "error",
            title: `Masukkan semua inputan!`,
            text: `Tolong ulangi!`,
            showConfirmButton: false
          });
          return;
        }

        try {
          const response = await HotelSource.addHotel(data);
          console.log(response);
          if (response.data) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Berhasil Menambah Hotel!",
              showConfirmButton: false,
              timer: 1500
            });
            window.location.replace("#/hotel");
          } else {
            Swal.fire({
              icon: "error",
              title: `${response.response.data.msg}!`,
              text: `Tolong ulangi!`,
              showConfirmButton: false
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
    });
  }
};

export default AddHotelPage;
