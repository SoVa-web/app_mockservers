class Converter{ 
    convert_without_components(data: any): void{
        if(data.components){
            rec(data)
        }else{
            return
        }
      
          function get_data_component(ref: string): any {
            const refParts = ref.replace('#/', '').split('/');
            const component_name = refParts[refParts.length - 1];//get name component
            const sec_name = refParts[refParts.length - 2]
            return data.components[sec_name][component_name];
          }
      
          function rec(obj:any){
            for(let key in obj){
              if(key === "$ref"){
                let ref = obj[key]
                let ref_value = get_data_component(ref);
                Object.assign(obj, ref_value);
                delete obj['$ref'];
      
              }
              let value = obj[key];
              if (typeof value === 'object' && value !== null) {
                rec(value);
              }
              if(Array.isArray(value) && value.every(el => typeof el === 'object')){
                for(let item in value){
                  rec(item)
                }
              }
            }
          }
    }
}

let converter = new Converter()
export default converter

