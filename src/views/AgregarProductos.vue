<template>
    <div class="agregarProductos">
        <h1>Agregar nuevos productos</h1>
        <form class="container" @submit.prevent="nuevoProducto(producto)">
            <div class="form-group">
                <label>Producto</label>
                <input type="text" class="form-control input-form" v-model="producto.nombre" />
            </div>
            <article class="article-flex">
                <div class="form-group">
                    <label>Medida</label>
                    <br />
                    <select v-model="producto.medidaId">
                        <option v-for="(item, index) in medida" :key="index" :value="item.id">{{ item.medida }} </option>
                    </select>
                </div>
                <div class="form-group empaque">
                    <label>Empaque</label>
                    <br />
                    <select v-model="producto.empaqueId">
                        <option v-for="(item, index) in empaque" :key="index" :value="item.id">{{ item.nombre }}</option>
                    </select>
                </div>
            </article>

            <div class="form-group" v-if="producto.empaqueId == '1'">
                <label> Cantidad de paquetes</label>
                <input type="number" class="form-control input-form paquetes" v-model="producto.cantidadPaquetes" />
            </div>
            <div class="form-group">
                <label v-if="producto.empaqueId !== 1" >Unidades</label>
                <label v-else>Unidades por paquetes</label>
                <input type="number" class="form-control input-form " v-model="producto.unidadPorEmpaque" />
                <p v-if="producto.empaqueId == 1">El total de unidades es de: {{totalUnidadesPorPaquete}} </p>
            </div>
            <div class="form-group">
                <label>Peso por unidad</label>
                <input type="number" class="form-control input-form " v-model="producto.pesoUnidad" />
                <p>El peso total es de: {{totalPeso}}</p>
            </div>
            <div class="form-group">
                <label>Categoria</label>
                <br />
                <select v-model="producto.categoriaId">
                    <option v-for="(item, index) in categoria" :key="index" :value="item.id"> {{ item.nombre }}</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {
        computed: {
                totalUnidadesPorPaquete(){
                    const totalUnidadPorEmpaque = this.producto.cantidadPaquetes * this.producto.unidadPorEmpaque;
                    return totalUnidadPorEmpaque;
                },
                totalPeso(){
                    if(this.producto.empaqueId == '1'){
                    const totalPeso = this.totalUnidadesPorPaquete * this.producto.pesoUnidad;
                    return totalPeso;
                    }else{
                        const totalPesoPorUnidad = this.producto.unidadPorEmpaque * this.producto.pesoUnidad;
                        return totalPesoPorUnidad
                    }
                }
            },
        data() {
            return {
                producto: {
                    nombre: '',
                    totalUnidad: '',
                    empaqueId: '',
                    medidaId: '',
                    pesoUnidad: '',
                    unidadPorEmpaque: '',
                    categoriaId: '',
                    cantidadPaquetes: '',
                },
                medida: [],
                empaque: [],
                categoria: [],
            };
        },
        created() {
            this.listarMedida();
            this.listarEmpaque();
            this.listarCategoria();
        },
        methods: {
            nuevoProducto() {
                if(this.totalUnidades){
                    console.log(this.producto.totalUnidad);
                    this.producto.totalUnidad = this.totalUnidades;
                }
                this.axios.post('/nuevoProducto', this.producto).then((res) => {
                    this.producto.nombre = '';
                    this.producto.medidaId = '';
                    this.producto.empaqueId = '';
                    this.producto.unidadPorEmpaque = '';
                    this.producto.pesoUnidad = '';
                    this.producto.categoriaId= '';
                    this.producto.push(res.data);
                });
            },
            listarMedida() {
                this.axios.get('/buscarMedida').then((res) => {
                    this.medida = res.data;
                });
            },
            listarEmpaque() {
                this.axios.get('/empaqueBuscar').then((res) => {
                    this.empaque = res.data;
                });
            },
            listarCategoria() {
                this.axios.get('categoriaBuscar').then((res) => {
                    this.categoria = res.data;
                });
            }
        },
    };
</script>

<style>
.agregarProductos{
  margin: 10%;
}

.input-form{
  width: 250px;
  margin: 0 auto;
}

.article-flex{
  display: flex;
  justify-content: center;
}
    
.empaque{
  margin-left: 20px;
}

select{
  width: 100px;
}

</style>
