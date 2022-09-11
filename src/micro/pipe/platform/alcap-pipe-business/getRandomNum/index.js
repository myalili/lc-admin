
export default function(len=5){
    
    let result=[];
    for(let i=0;i<len;i++){
        let num=Math.ceil(Math.random()*25);
        result.push(String.fromCharCode(65+num));
    }
    return result.join("");
}