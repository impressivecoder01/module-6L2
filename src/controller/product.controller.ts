import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/products.type";
import { parseBody } from "../utility/partsBody";

export const productController = async(req :IncomingMessage , res: ServerResponse) => {
    // console.log("body", );
    const url = req.url
    const method = req.method
    const urlParts = url?.split("/")
    const id = urlParts && urlParts[1] === 'products' ? Number(urlParts[2]): null
    // console.log('this is the id',id);
    
    // get all products
    if(url === "/products" && method === "GET"){
        // const products = [
        //     {
        //         id: 1,
        //         name: 'Product-1'
        //     }
        // ]
        const products =  readProduct()

    res.writeHead(200, {"content-type" : "application/json"})
    res.end(JSON.stringify({message: "Products retrieved successfull",
     data: products}))
    }
    else if(method === 'GET' && id !== null){
        const products = readProduct()
        const product = products.find((p:IProduct)=> p.id === id)
        console.log(product);
        res.writeHead(200, {"content-type" : "application/json"})
        res.end(JSON.stringify({message: "Product retrieved successfully",
     data: product}))
    }
    else if(method === 'POST' && url === '/products'){
        const body = await parseBody(req)
        // console.log('body',body);
        const products = readProduct()
        const newProduct = {
            id: Date.now(),
            ...body
        }
        products.push(newProduct)
        // console.log(products);
        insertProduct(products)
        res.writeHead(200, {"content-type" : "application/json"})
        res.end(JSON.stringify({message: "Product retrieved successfully",
     data: newProduct
    }))
    }
}