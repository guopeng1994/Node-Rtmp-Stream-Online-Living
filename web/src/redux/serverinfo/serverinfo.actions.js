import * as types from './serverinfo.types.js'
import superagent from 'superagent'
export function getServerUsage(){
	return (dispatch)=>{
		return superagent.get("/api/server/serverusage").end((err,res)=>{
			res.body = res.body ||{};
			if(res.body.errcode == 1)
			{
				dispatch({type:types.GETSERVERUSAGE,data:res.body.data});
			}else{
				dispatch({type:types.GETSERVERUSAGE,data:null});
			}
		})
	}
}
