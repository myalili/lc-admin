export default {
    
        computed:{
          tenantId(){
            return this?.$root.$store?.getters["user/tenantId"]||'P9VM7G';
          }
        }
      
}