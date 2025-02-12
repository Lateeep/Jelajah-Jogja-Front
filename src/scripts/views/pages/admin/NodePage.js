import NodeSource from "../../../data/node-source";
import Swal from "sweetalert2";

const NodePage = {
  async render() {
    return `
      <div class="container-fluid">
        <div class="row">
          <sidebar-element></sidebar-element>
          <div class="col-md-9 ms-sm-auto col-lg-10 p-0" id="container-right">
            <navbar-admin-element></navbar-admin-element>
            <div class="mt-md-5 mb-md-3 px-5">
              <h1>Data Nodes</h1>
              <button id="addNodeButton" class="btn btn-primary">Tambah Node</button>
            </div>
            <div class="table-wrapper px-5">
              <table id="nodeTable" class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="nodeTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const loadNodes = async () => {
      try {
        const nodes = await NodeSource.getNodes();
        const tableBody = document.getElementById("nodeTableBody");
        tableBody.innerHTML = nodes
          .map(
            (node) => `
          <tr>
            <td>${node.id}</td>
            <td>${node.nama}</td>
            <td>${node.latitude}</td>
            <td>${node.longitude}</td>
            <td>
              <button class="btn btn-warning btn-edit" data-id="${node.id}">Edit</button>
              <button class="btn btn-danger btn-delete" data-id="${node.id}">Hapus</button>
            </td>
          </tr>`
          )
          .join("");
      } catch (error) {
        console.error("Failed to load nodes:", error);
      }
    };

    const handleAddNode = () => {
      Swal.fire({
        title: "Tambah Node",
        html: `
          <input id="nodeName" class="swal2-input" placeholder="Nama">
          <input id="nodeLatitude" class="swal2-input" placeholder="Latitude">
          <input id="nodeLongitude" class="swal2-input" placeholder="Longitude">
        `,
        confirmButtonText: "Tambah",
        preConfirm: async () => {
          const nama = document.getElementById("nodeName").value;
          const latitude = document.getElementById("nodeLatitude").value;
          const longitude = document.getElementById("nodeLongitude").value;

          if (!nama || !latitude || !longitude) {
            Swal.showValidationMessage("Semua field harus diisi!");
          }

          return { nama, latitude, longitude };
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await NodeSource.addNode(result.value);
            Swal.fire("Sukses", "Node berhasil ditambahkan!", "success");
            loadNodes();
          } catch (error) {
            Swal.fire("Error", "Gagal menambahkan node.", "error");
          }
        }
      });
    };

    document.getElementById("addNodeButton").addEventListener("click", handleAddNode);
    loadNodes();
  },
};

export default NodePage;
