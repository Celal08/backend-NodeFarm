const http = require('http');
const fs = require('fs');
const url=require('url');

//farklı dosyadan export edilen dosyayı buradan çağırdım
const replaceTemplate = require('./modules/replaceTemplate');




//html şablon verilerine eriş
let templateOverview= fs.readFileSync('./templates/template-overview.html','utf8');

let tempProduct = fs.readFileSync('./templates/template-product.html','utf8');

let tempCard = fs.readFileSync('./templates/template-card.html','utf8')

let data = fs.readFileSync('./dev-data/data.json','utf8')
const dataObj = JSON.parse(data);

//routing , API ye gelen isteği hangi uç noktaya geldiğine göre cevap gönderme
//routing , için Client in hangi yola istek attığını bilmemiz lazım

const server = http.createServer((req, res) => {
   const {pathname,query} = url.parse(req.url,true);
   


    switch (pathname) {
        case "/overview":

        const cardHTML = dataObj.map((el) =>
        replaceTemplate(tempCard, el)
      );

            templateOverview = templateOverview.replace('{%PRODUCT_CARDS%}'
            , cardHTML);
            res.end(templateOverview);
            break;
            //ürün detay sayfası
        case "/product":
            //1 diziden doğru elemanı bul
            const item = dataObj.find(item => item.id == query.id);
            

            // 2 template i bulunan elemanın verilerine göre güncelle

            const output = replaceTemplate(tempProduct,item);

            //3 güncel template i client'a gönder

            
            res.end(output);
            break;
        default:
            res.end('Sayfa tanimlanmadi 4000004 found');
    }
});

//bir dinleyici (port) oluştur

server.listen(4001, "127.0.0.1", () => {
    //dinleme işlemine başlandığı zaman tetiklenir
    console.log("4001. porta gelen istekler dinlenmeye başlandı");
});