const app = Vue.createApp({
  data() {
    return {
      libros: [],
      carrito: [],
      buscar: '',
      filtroGenero: '',
      finalizado: false,
    };
  },
  created() {
    this.fetchData();
    this.obtenerCarrito();
  },

  methods: {
    fetchData() {
      fetch('products.json')
        .then((response) => response.json())
        .then((data) => {
          this.libros = data;
          localStorage.setItem('libros', JSON.stringify(data));
        })
        .catch((error) => console.error('Hubo un problema', error));
    },

    guardarCarrito() {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
    },

    obtenerCarrito() {
      const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));

      if (carritoGuardado) {
        this.carrito = carritoGuardado;
      }
    },

    agregarProducto(idLibro) {
      const producto = this.libros.find((prod) => prod.id === idLibro);

      if (producto) {
        this.armarCarrito(producto);
      }
    },

    eliminarProducto(idLibro) {
      const producto = this.carrito.find((prod) => prod.id === idLibro);

      if (producto) {
        if (producto.cantidad > 1) {
          producto.cantidad--;
        } else {
          this.carrito = this.carrito.filter((prod) => prod.id !== idLibro);
        }

        this.guardarCarrito();
      }
    },

    armarCarrito(producto) {
      const { id, titulo, autor, precio, img } = producto;
      const datosProducto = {
        titulo,
        autor,
        precio,
        img,
        id,
        cantidad: 1,
      };

      const productoExistente = this.carrito.find(
        (prod) => prod.id === datosProducto.id
      );

      if (productoExistente) {
        productoExistente.cantidad++;
      } else {
        this.carrito.push(datosProducto);
      }

      this.guardarCarrito();
    },

    vaciarCarrito() {
      localStorage.removeItem('carrito');
      this.carrito = [];
    },

    finalizarCompra() {
      this.finalizado = true;
      this.vaciarCarrito();
    },

    volverAlInicio() {
      window.location.href = '/index.html';
    },
  },

  computed: {
    librosFiltrados() {
      return this.libros.filter((libro) => {
        const coincideBusqueda =
          !this.buscar ||
          libro.titulo.toLowerCase().includes(this.buscar.toLowerCase()) ||
          libro.autor.toLowerCase().includes(this.buscar.toLowerCase());

        const coincideGenero =
          !this.filtroGenero || libro.genero === this.filtroGenero;

        return coincideBusqueda && coincideGenero;
      });
    },

    calcularTotalProductos() {
      return this.carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
      );
    },

    calcularTotalPrecio() {
      return this.carrito.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
      );
    },
  },
});

app.mount('#app');
