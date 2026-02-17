import summaryApi from "../../common"
import {toast} from "react-toastify"

const addTocart = async(e, id)=>{
    e?.preventDefault()
    
    try {
        console.log("🛒 Adding to cart, Product ID:", id);
        
        const response = await fetch(summaryApi.addtoCartProduct.url,{
            method : summaryApi.addtoCartProduct.method,
            credentials : "include",
            headers:{
                "content-type" : "application/json"
            },
            body: JSON.stringify({productId : id})
        })

        console.log("📡 Response status:", response.status);
        
        const responseData = await response.json()
        console.log("📦 Response data:", responseData);

        if(responseData.success){
            toast.success(responseData.message)
            return responseData
        }
        if(responseData.error){
            toast.error(responseData.message)
            return responseData
        }
    } catch (error) {
        console.error("❌ Add to cart error:", error)
        toast.error("Failed to add product to cart")
        return { success: false, error: true }
    }
}

export default addTocart