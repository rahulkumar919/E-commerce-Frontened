import summaryApi from "../../common"
import {toast} from "react-toastify"

const addTocart = async(e , id)=>{
    e?.prevntDefault()
    const response = await fetch(summaryApi.addtoCartProduct.url,{
        method : summaryApi.addtoCartProduct.method,
        credentials : "include",
        headers:{
            "content-type" : "application/json"
        },
        body  :JSON.stringify({productId : id})


    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData.message)
    }
     if(responseData.error){
        toast.success(responseData.message)
    }
}


export default addTocart