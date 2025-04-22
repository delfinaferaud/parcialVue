const app = Vue.createApp({
  data() {
    return {
      libros: [],
    };
  },
  created(){
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch('products.json')
        .then((response) => response.json())
        .then((data) => {
          this.libros = data;
          localStorage.setItem('libros', JSON.stringify(data));
        })
        .catch((error) => console.error('Error fetching data:', error)); // EDITAR
    },
    obtenerLibros() {
      const librosGuardados = JSON.parse(localStorage.getItem('libros'));
      console.log(librosGuardados);
      // if (librosGuardados) {
      //   this.libros = JSON.parse(librosGuardados);
      // } else {
      //   this.fetchData();
      // }
    }
  },
});

app.mount('#app');
