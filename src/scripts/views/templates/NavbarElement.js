class Navbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    // this.addScrollEffect();
  }

  render() {
    this.innerHTML = `
      <nav
        class="navbar navbar-expand-lg fixed-top p-3"
        style="background-color: #3F4E4F; z-index:5000"
      >
        <div class="container">
          <a class="logo" href="#"
            ><img style="width:210px;" src="./images/LogoNavbar2.png"
          /></a>
          <button
            class="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span>
              <i class="bx bx-menu-alt-right bx-md text-white"></i>
            </span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mt-3 mt-lg-0 mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link link-navbar-user" href="#/home" id="link-home">Beranda</a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Wisata
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item " id="link-alam" href="#/kategorialam">Alam</a></li>
                  <li><a class="dropdown-item " id="link-budaya" href="#/kategoribudaya">Budaya</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link link-navbar-user" id="link-hotel" href="#/penginapan">Penginapan</a>
              </li>
              <li class="nav-item">
                <a class="nav-link link-navbar-user" id="link-map" href="#/map">Peta</a>
              </li>
              <li class="nav-item">
                <a class="nav-link link-navbar-user" id="link-gallery" href="#/gallery">Galeri</a>
              </li>
              <li class="nav-item">
                <a class="nav-link link-navbar-user" id="link-contact" href="#/contact">Kontak</a>
              </li>
            <!--  <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Favorit
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" id="link-favwisata" href="#/favoritwisata">Wisata</a></li>
                <li><a class="dropdown-item" id="link-favhotel" href="#/favorithotel">Hotel</a></li>
              </ul>
            </li> -->
            </ul>
          </div>
        </div>
      </nav>
    `;
  }

  // addScrollEffect() {
  //   const navbar = this.querySelector('.navbar'); // Ambil elemen navbar
  //   window.addEventListener('scroll', () => {
  //     if (window.scrollY > 50) {
  //       navbar.style.backgroundColor = 'rgba(63, 78, 79, 1)'; // Solid
  //     } else {
  //       navbar.style.backgroundColor = 'rgba(63, 78, 79, 0)'; // Transparan
  //     }
  //   });
  // }
}

customElements.define("navbar-element", Navbar);
