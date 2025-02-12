import Swal from 'sweetalert2';

const BobotHotelPage = {
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
                <h3 class="text-center title_items_sidebar mb-4">Pengaturan Bobot Kriteria Hotel</h3>
                <form id="bobotForm">
                  <h5>Bobot Total</h5>
                  <div class="mb-3">
                    <label class="form-label">Bobot Harga</label>
                    <input type="number" step="0.1" min="0" max="1" class="form-control" id="bobot_harga" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Bobot Jarak</label>
                    <input type="number" step="0.1" min="0" max="1" class="form-control" id="bobot_jarak" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Bobot Tipe Kamar</label>
                    <input type="number" step="0.1" min="0" max="1" class="form-control" id="bobot_tipe_kamar" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Bobot Fasilitas</label>
                    <input type="number" step="0.1" min="0" max="1" class="form-control" id="bobot_fasilitas" required>
                  </div>

                  <div class="alert alert-info mt-3">
                    Total Bobot: <span id="totalBobot">0.00</span>
                    <small class="d-block">Total bobot harus sama dengan 1</small>
                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <button type="submit" class="btn btn-primary">Simpan Bobot</button>
                    <button type="button" class="btn btn-warning" id="resetBtn">Reset Form</button>
                    <a href="#/hotel" class="btn btn-secondary">Kembali</a>
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
    const navLink = document.getElementById('hotel-link');
    navLink.classList.add('active');

    const bobotForm = document.getElementById('bobotForm');
    const resetBtn = document.getElementById('resetBtn');
    const inputs = [
      'bobot_harga',
      'bobot_jarak',
      'bobot_tipe_kamar',
      'bobot_fasilitas'
    ];

    // Tambahkan fungsi untuk validasi total bobot
    const isTotalValid = (total) => {
      return Math.abs(total - 1) < 0.0001; // Toleransi untuk floating point
    };

    // Fungsi untuk mengambil bobot yang sudah ada
    const loadExistingBobot = async () => {
      try {
        const response = await fetch('http://localhost:5000/hotel-bobot');
        if (response.ok) {
          const data = await response.json();
          // Isi form dengan data yang ada
          inputs.forEach(inputId => {
            document.getElementById(inputId).value = data[inputId] || '';
          });
          // Update total bobot
          document.getElementById('totalBobot').textContent = data.total_bobot.toFixed(2);
        }
      } catch (error) {
        console.error('Error loading existing bobot:', error);
      }
    };

    // Load bobot yang sudah ada saat halaman dimuat
    await loadExistingBobot();

    // Event listener untuk reset button
    resetBtn.addEventListener('click', () => {
      Swal.fire({
        title: 'Reset Form?',
        text: "Semua nilai bobot akan dikosongkan",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Reset!',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset semua input
          inputs.forEach(inputId => {
            document.getElementById(inputId).value = '';
          });
          document.getElementById('totalBobot').textContent = '0.00';
          Swal.fire(
            'Direset!',
            'Form telah dikosongkan.',
            'success'
          );
        }
      });
    });

    // Fungsi untuk menampilkan tooltip
    const createTooltip = (element, message) => {
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip';
      tooltip.innerText = message;
      element.appendChild(tooltip);
    };

    // Event listener untuk input bobot
    inputs.forEach(inputId => {
      const input = document.getElementById(inputId);
      createTooltip(input, 'Masukkan bobot untuk kriteria ini (0-1)');

      input.addEventListener('input', () => {
        const totalBobot = inputs.reduce((total, id) => {
          return total + (parseFloat(document.getElementById(id).value) || 0);
        }, 0);
        
        document.getElementById('totalBobot').textContent = totalBobot.toFixed(2);
        
        if (totalBobot > 1) {
          input.value = '';
          Swal.fire({
            icon: 'error',
            title: 'Total Bobot Melebihi 1',
            text: 'Total bobot tidak boleh melebihi 1',
          });
        }
      });
    });

    // Event listener untuk submit form
    bobotForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const totalBobot = inputs.reduce((total, id) => {
        return total + (parseFloat(document.getElementById(id).value) || 0);
      }, 0);

      if (!isTotalValid(totalBobot)) {
        Swal.fire({
          icon: 'error',
          title: 'Total Bobot Tidak Valid',
          text: `Total bobot harus sama dengan 1. Total saat ini: ${totalBobot.toFixed(2)}`,
        });
        return;
      }

      const bobotData = inputs.reduce((data, id) => {
        data[id] = document.getElementById(id).value;
        return data;
      }, {});

      try {
        const response = await fetch('http://localhost:5000/hotel-bobot/update-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bobotData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.msg || 'Terjadi kesalahan saat menyimpan bobot');
        }

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Bobot berhasil diperbarui',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.href = '#/hotel';
        });
      } catch (error) {
        console.error('Error details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message || 'Terjadi kesalahan saat memperbarui bobot!',
        });
      }
    });
  },
};

export default BobotHotelPage; 