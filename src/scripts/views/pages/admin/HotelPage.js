import HotelSource from '../../../data/hotel-source';
import {async} from 'regenerator-runtime';
import Swal from 'sweetalert2';
import DataTable from 'datatables.net-dt';
import 'datatables.net-responsive-dt';

// Tambahkan fungsi delete
window.deleteHotel = async (id) => {
  try {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const response = await fetch(`http://localhost:5000/hotel/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Swal.fire(
          'Terhapus!',
          'Data hotel berhasil dihapus.',
          'success'
        ).then(() => {
          location.reload();
        });
      } else {
        throw new Error('Gagal menghapus data');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Terjadi kesalahan saat menghapus data!',
    });
  }
};

const HotelPage = {
  async render () {
    return `
      <div class="container-fluid">
        <div class="row">
          <sidebar-element></sidebar-element>
          <div class="col-md-9 ms-sm-auto col-lg-10 p-0" id="container-right">
            <navbar-admin-element></navbar-admin-element>
            <div
              class="mt-md-5 mb-md-3 d-flex align-items-center justify-content-between px-5"
              id="content_container"
            >
              <div class="titleAdmin-card col-md-6 my-3">
                <h1 class="my-3">Data Hotel</h1>
              </div>
              <div class="d-flex gap-2">
                <a href="#/bobothotel" class="btn_edit btn">Pengaturan Bobot</a>
                <a href="#/addhotel" class="btn_edit btn">Tambah</a>
              </div>
            </div>
            <div class="table-wraper px-md-5">
              <table
                class="table table-hover text-center"
                style="font-size: 15px"
                id="tableDatas"
              >
                <thead class="table-dark">
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Lokasi</th>
                    <th scope="col">Deskripsi</th>
                    <th scope="col">Tipe Kamar</th>
                    <th scope="col">Fasilitas</th>
                    <th scope="col">Image</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody class="item-container"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },
  async afterRender () {
    const navLink = document.getElementById ('hotel-link');
    navLink.classList.add ('active');

    try {
      const response = await fetch('http://localhost:5000/hotel', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const responseJson = await response.json();
      const itemContainer = document.querySelector('.item-container');
      
      if (!responseJson || responseJson.length === 0) {
        itemContainer.innerHTML = `
          <tr>
            <td colspan="8">Tidak ada data hotel</td>
          </tr>
        `;
        return;
      }
      
      responseJson.forEach((data) => {
        // Format tipe kamar dengan badge
        let tipeKamarFormatted = '-';
        try {
            if (data.type_kamar) {
                const tipeKamarArray = typeof data.type_kamar === 'string' ? 
                    JSON.parse(data.type_kamar) : data.type_kamar;

                const tipeKamarLabels = {
                    single: 'Single',
                    double: 'Double',
                    suite: 'Suite'
                };
                
                if (Array.isArray(tipeKamarArray) && tipeKamarArray.length > 0) {
                    const formattedTipes = tipeKamarArray
                        .map(tipe => `<span class="badge bg-primary">${tipeKamarLabels[tipe] || tipe}</span>`);
                    tipeKamarFormatted = `<div class="d-flex flex-column align-items-center">${formattedTipes.join('<br>')}</div>`;
                }
            }
        } catch (error) {
            console.error('Error parsing tipe kamar:', error);
            tipeKamarFormatted = '-';
        }

        // Format fasilitas dengan badge success dalam 2 kolom
        let fasilitasFormatted = '-';
        try {
            if (data.fasilitas) {
                const fasilitasObj = typeof data.fasilitas === 'string' ? 
                    JSON.parse(data.fasilitas) : data.fasilitas;

                const fasilitasLabels = {
                    ac: 'AC',
                    sarapan: 'Sarapan',
                    tv: 'TV',
                    internet: 'Internet',
                    kolam_renang: 'Kolam Renang',
                    tempat_parkir_luas: 'Tempat Parkir Luas'
                };
                
                const tersediaFasilitas = Object.entries(fasilitasObj)
                    .filter(([_, value]) => value === true || value === 'true')
                    .map(([key, _]) => `<span class="badge bg-success mb-1">${fasilitasLabels[key]}</span>`);

                if (tersediaFasilitas.length > 0) {
                    // Bagi fasilitas menjadi 2 kolom
                    const halfLength = Math.ceil(tersediaFasilitas.length / 2);
                    const leftColumn = tersediaFasilitas.slice(0, halfLength);
                    const rightColumn = tersediaFasilitas.slice(halfLength);

                    fasilitasFormatted = `
                        <div class="d-flex justify-content-center gap-2">
                            <div class="text-center">${leftColumn.join('<br>')}</div>
                            ${rightColumn.length > 0 ? `<div class="text-center">${rightColumn.join('<br>')}</div>` : ''}
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error parsing fasilitas:', error);
            fasilitasFormatted = '-';
        }

        itemContainer.innerHTML += `
            <tr class="hotelTr">
                <th scope="row">${data.id}</th>
                <td>${data.nama || '-'}</td>
                <td>${data.lokasi || '-'}</td>
                <td>${data.deskripsi || '-'}</td>
                <td style="text-align: center; padding: 10px;">${tipeKamarFormatted}</td>
                <td style="text-align: center; padding: 10px; min-width: 200px;">${fasilitasFormatted}</td>
                <td>
                    <img 
                        src="${data.url || '#'}" 
                        alt="Hotel ${data.nama}"
                        style="width:100px; height:100px; object-fit:cover" 
                        onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'"
                    />
                </td>
                <td>
                    <div class="d-flex gap-2 justify-content-center">
                        <a href="#/edithotel/${data.id}" class="btn_edit btn px-4" style="font-weight:400;">Ubah</a>
                        <button class="btn btn-danger" onclick="deleteHotel(${data.id})">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
      });

      if ($.fn.DataTable.isDataTable('#tableDatas')) {
        $('#tableDatas').DataTable().destroy();
      }
      
      let table = new DataTable('#tableDatas', {
        responsive: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/id.json',
        },
      });

    } catch (error) {
      // Hanya tampilkan alert jika benar-benar terjadi error
      if (!document.querySelector('.hotelTr')) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Terjadi kesalahan saat mengambil data hotel!',
        });
      }
    }
  },
};
export default HotelPage;
