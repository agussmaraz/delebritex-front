<template>
    <div class="container">
        <h1 class="contacto">Contacto</h1>
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Email</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Asunto</label>
                <input type="password" class="form-control" id="exampleInputPassword1" />
            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        <br />
        <div>
            <h3>Redes Sociales:</h3>

            <ul type="none" class="redes">
                <li><a href="https://www.facebook.com/" target="_blank" class="li-redes"> Facebook</a></li>
                <li><a href="https://www.twitter.com/" target="_blank" class="li-redes"> Twitter</a></li>
                <li><a href="https://www.instagram.com/" target="_blank" class="li-redes"> Instagram</a></li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss">
    .contacto {
        margin-top: 2%;
    }
    .redes {
      display: flex;
      justify-content: center;
    }
    .li-redes {
      margin-left: 10px;
    }
    ul {
      padding-inline-start: 0px !important;
    }
</style>
