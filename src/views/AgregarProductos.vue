<template>
    <div>
        <h1>Agregar nuevos productos</h1>
        <form class="container-form">
            <div class="form-group">
                <label>Producto</label>
                <input type="text" class="form-control" />
            </div>
            <div class="form-group">
                <label>Medida</label>
                <input type="text" class="form-control" />
            </div>
            <div class="form-group">
                <label>Empaque</label>
                <input type="text" class="form-control" />
            </div>
            <div class="form-group">
                <label>Peso por unidad</label>
                <input type="number" class="form-control" />
            </div>
            <div class="form-group">
                <label>Unidades por paquetes</label>
                <input type="number" class="form-control" />
            </div>
               <div class="form-group">
                <label>Categoria</label>
                <input type="number" class="form-control" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script>
    export default {};
</script>

<style>
    .container-form {
        width: 50%;
        margin: 10px auto;
    }
</style>
