import WisataSource from "../../../data/wisata-source";
import { async } from "regenerator-runtime";
import Swal from "sweetalert2";
import DataTable from "datatables.net-dt";
import "datatables.net-responsive-dt";

const WisataPage = {
  async render() {
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
              <div class="titleAdmin-card col-md-6">
                <h1 class="my-3">Data Wisata</h1>
              </div>
              <a href="#/addwisata" class="btn_edit btn rounded-3 p-3">Tambah</a>
            </div>
            <div class="table-wraper px-md-5">
              <table
                class="table table-striped text-center"
                style="font-size: 15px"
                id="tableDatas"
              >
                <thead>
                  <tr class="titleRow">
                    <th scope="col">Id</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Kategori</th>
                    <th scope="col">Lokasi</th>
                    <th scope="col">Deskripsi</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Image</th>
                    <th scope="col"></th>
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
  async afterRender() {
    //   active side bar
    const navLink = document.getElementById("wisata-link");
    navLink.classList.add("active");

    // get data wisata
    const response = await WisataSource.getWisata();
    const datas = response.data;
    const itemContainer = document.querySelector(".item-container");
    datas.forEach((data) => {
      itemContainer.innerHTML += `
        <tr class="wisataTr">
          <th scope="row">${data.id}</th>
          <td>${data.nama}</td>
          <td>${data.kategori}</td>
          <td>${data.lokasi}</td>
          <td>${data.deskripsi}</td>
          <td>${data.rating}</td>
          <td><img src="${data.url}" style="width:100px; height:100px; object-fit:cover" /></td>
          <td>
            <div class="d-flex gap-2 justify-content-center">
              <a href="#/editwisata/${data.id}" class="btn_edit btn px-4" style="font-weight:400;">Ubah</a>
              <button class="btn btn-danger px-4 btnDelete" data-id="${data.id}" data-nama="${data.nama}">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    });

    let table = new DataTable("#tableDatas", {
      responsive: true
    });

    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.btnDelete').forEach(button => {
      button.addEventListener('click', async (e) => {
        console.log("Tombol hapus diklik");
        const id = e.target.dataset.id;
        const nama = e.target.dataset.nama;
        console.log(`ID: ${id}, Nama: ${nama}`);
    
        Swal.fire({
          title: "Apakah anda yakin?",
          text: `Data ${nama} akan dihapus!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Hapus!",
          cancelButtonText: "Batal"
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              console.log("Menghapus data...");
              await WisataSource.deleteWisata(id);
              Swal.fire({
                icon: "success",
                title: "Terhapus!",
                text: "Data berhasil dihapus.",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                window.location.reload();
              });
            } catch (error) {
              console.error("Error saat menghapus data:", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Gagal menghapus data",
              });
            }
          }
        });
      });
    });
  }
};
export default WisataPage;
