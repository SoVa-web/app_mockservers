class Filter{
    filtration(parameters:object, mock_data:Array<any>):Array<any>{
        let res:Array<any> = []
        let matching:boolean[] = Array(mock_data.length).fill(true);
        let param:any = parameters
        let i:number = 0

        for(let key in param){
            i = 0
            mock_data.forEach((item)=>{
                if(param[key] != item[key]){
                    matching[i] = false
                }
                i++
            })
        }

        for(let j = 0; j < matching.length; j++){
            if(matching[j]){
                res.push(mock_data[j])
            }
        }

        return res
    }
}

let filter:Filter = new Filter()
export default filter