<template>
<v-app id="inspire">
  
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
      <v-flex xs5>
          <v-card>
            <v-img id="product-img"
              src="https://cdn.shopify.com/s/files/1/0054/3214/8081/products/45_665ca830-d1f2-48bd-8c84-02375dc2d883_large.jpg?v=1544128468"
              height="100%"
              class="grey darken-4"
            ></v-img>
          </v-card>
        <v-layout row wrap>
      <v-flex v-for="item in items" :key="`4${i}`" xs3>
        <v-card class="product-img">
        <v-img class="sub-img" v-bind:class="{activeimg:  item.isActive}"
          :src="item.images"
           
        ></v-img>
        </v-card>
      </v-flex>
      </v-layout>
      </v-flex>
      <v-flex xs7  pl-5 class="d-flex text-xs-left">
        <div class="product-summary">
          <h2 class="product-title">Basic contrast sneakers</h2>
          <div class="user-ratings">
            <div class="star-rating">
              <span style="width:100%"></span>
            </div>
         <a href="#reviews" class="total-review" rel="nofollow">(<span class="count"> 5 </span> customer review)</a>
          </div>
          <div class="price">
            <h3>
            <span>$</span>
            160.00
            </h3>
            <del>$ 180</del>
          </div>
          <div class="prodect-details">
            <h3>Product Details</h3>
            <p>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem,</p>
          </div>
          <div>
            <ul class="colors" id="col-box">
              <p>Select Colour : </p>
              <li class="color-box yellow active-col"></li>
              <li class="color-box pink"></li>
              <li class="color-box cyan "></li>
            </ul>
          </div>
          <div>
             <ul class="size" id="size-box">
              <p class="sub-heading">Select Size : </p>
              <li class="size-box active-siz">M</li>
              <li class="size-box">L</li>
              <li class="size-box">XL</li>
            </ul>
          </div>
          <div class="buy-product">
            <div class="stock">
             <v-btn color="#4CAF50" dark>IN STOCKS
              <v-icon dark right>check_circle</v-icon>
             </v-btn>
            </div>
            <div class="product-qty">
              <table>
                <tr>
                  <td><label class="sub-title">Quantity :</label></td>
                  <td><button onClick="var result = document.getElementById('qty'); var qty = result.value; if( !isNaN( qty ) &amp;&amp; qty &gt; 0 ) result.value--;return false;" class="reduced items-count" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
                        <input type="text" class="input-text qty" title="Qty" value="1" maxlength="12" id="qty" name="qty">
                        <button onClick="var result = document.getElementById('qty'); var qty = result.value; if( !isNaN( qty )) result.value++;return false;" class="increase items-count" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
                        </td>
                </tr>
              </table>
              <div class="cart-btn">
              <v-btn  class="px-5" color="error"><i class="fa fa-shopping-cart" aria-hidden="true"></i> ADD TO CART</v-btn>
                            <v-btn  class="cart-btn px-5" color="error">BUY NOW</v-btn>
              </div>
              <button><i class="fa fa-heart" aria-hidden="true"></i>    ADD TO WISHLIST</button>
              <ul class="socal-link">
                <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                <li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                <li><a href="#"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
                <li><a href="#"><i class="fa fa-rss"></i></a></li>
                <li><a href="#"><i class="fa fa-youtube"></i></a></li>
                <li><a href="#"><i class="fa fa-instagram"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </v-flex>
       
   <v-flex xs12>
          <div class="overview">
    <v-tabs
      v-model="active"
      color="#ff5252"
      dark
      slider-color="blue"
    >
      <v-tab>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, earum.
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <v-card-text class="text-sm-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, eum!</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
      </v-flex>
        
      </v-layout>
    </v-container>
  </v-app>
</template>
<style>
.product-img{
  cursor: pointer;
  margin-top: 10px;
}

.product-title{
      text-transform: uppercase;
    margin-bottom: 15px;
    font-size: 25px;
    line-height: 1.2em;
    font-family: 'Lora', serif;
}
.user-ratings{
      overflow: hidden;
    margin-bottom: 10px;
    margin-top: 5px;
    display: inline-block;
}

.star-rating{
  display: inline-block;
    font-size: 18px;
    position: relative;
    height: 18px;
    line-height: 18px;
    letter-spacing: 2px;
    width: 130px;
    font-family: FontAwesome;
}

.star-rating:before{
content: "\f005\f005\f005\f005\f123";
    position: absolute;
    top: 0;
    left: 0;
    color: #FC0;
  box-sizing: border-box;
}

.star-rating span{
      overflow: hidden;
    float: left;
    top: 0;
    left: 0;
    height: 18px;
    position: absolute;
    font-size:0;
}
.user-ratings .total-review{
  vertical-align: middle;
  color: rgba(0,0,0,.5);
  box-sizing: border-box;
  float: right;
  font-size: 14px;
  text-decoration: none;
}
.total-review:hover{
  text-decoration: underline;
}

.price{
  display: block;
  margin-bottom: 10px;
}
.price h3{
  display: inline-block;
  font-size: 28px;
  color: #E91E63;
}
.price del{
  padding: 0px 20px;
  font-size: 20px;
  color:#9E9E9E;
}
.prodect-details{
  padding-top: 15px;
    padding-bottom: 20px;
font-family: 'Lora', serif;
  border-bottom: 1px dashed #ddd;
}

.colors{
  margin: 0px;
  padding: 0px;
  display: inline-block;
  margin-top: 20px;
    list-style: none;
}
.colors p{
  float: left;
  margin-top: 10px;
  color: #000;
  font-weight: 700;
  padding-right: 20px;
}
.color-box{
  height:35px;
  width: 35px;
  margin:5px;
  display: inline-block;
  cursor: pointer;
  opacity: 0.8
}

.active-col{
    outline: 1px dashed black;
}

.size{
    margin: 0px;
  padding: 0px;
  display: inline-block;
  margin-top: 20px;
    list-style: none;
}
.size p{
  float: left;
  margin-top: 10px;
  color: #000;
  font-weight: 700;
  padding-right: 38px;
}

.size-box{
  padding: 12px;
  margin: 0px 5px;
  display: inline-block;
  cursor: pointer;
  color: #000;
  font-weight: 400;
  
}
.active-siz{
  background-color: #B2DFDB;
}
.buy-product{
  margin-top: 15px;
  padding: 15px 0px;
  border-top: 1px dashed #ddd;
  
}

.product-qty{
  display: inline-block;
  margin-top: 20px;
  width: 100%;
}

.product-qty button.items-count {
    background-color: #fff;
    border: 1px #ddd solid;
    border-radius: 2px;
}

.product-qty button.items-count {
    font-size: 18px;
    line-height: 12px;
    height: 40px;
    width: 40px;
   color:#000;
}

.product-qty .qty {
    height: 40px;
    text-align: center;
    width: 70px;
    vertical-align: top;
  color: #000;
}

.qty {
    background-color: #ffffff;
    border: 1px #ced4da solid;
    border-radius: 2px;
    color: #666;
    font-size: 15px;
    font-weight: bold;
    margin: 0 -5px;
}

.sub-title{
  color: #000;
  font-weight: 700;
  padding-right: 38px;
}

.cart-btn{
  margin: 15px 0px;
  border-bottom: 1px #e5e5e5 solid;
}

.cart-btn i{
  padding:0px 10px;
}

.socal-link{
  margin: 0px;
  padding: 0px;
  margin-top: 20px;
  list-style: none;
  display: block;
}
.socal-link li{
    list-style: none;
  display: inline-block;
  margin: 0px 8px;
}

.socal-link li a{
      border: 1px #ddd solid;
    color: #666;
    font-size: 15px;
    line-height: 36px;
    padding: 8px 12px;
}

.socal-link li a:hover{
  background: #ff5252;
  color: #fff;
}

.activeimg{
  border: 1px solid #000;
}

.overview{
  margin-top: 30px;
}
</style>
<script>
  export default {
   data(){
     return{
       default: 'https://cdn.shopify.com/s/files/1/0054/3214/8081/products/45_665ca830-d1f2-48bd-8c84-02375dc2d883_large.jpg?v=1544128468',
      items: [
      { images: 'https://cdn.shopify.com/s/files/1/0054/3214/8081/products/45_665ca830-d1f2-48bd-8c84-02375dc2d883_large.jpg?v=1544128468',
      isActive: true
      },
      { images: 'https://cdn.shopify.com/s/files/1/0054/3214/8081/products/47_large.jpg?v=1544128468' },
      { images: 'https://cdn.shopify.com/s/files/1/0054/3214/8081/products/35_8364d9f9-d670-418a-acad-ce4832921345_large.jpg?v=1544128468' },
      {
      images: 'https://cdn.shopify.com/s/files/1/0054/3214/8081/products/30_c7961d18-9fcb-4148-bfae-ff3063a99a82_large.jpg?v=1544128468'
      }
    ],
     }
   }
  }  
</script>