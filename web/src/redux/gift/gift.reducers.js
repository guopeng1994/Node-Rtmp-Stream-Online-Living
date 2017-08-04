import * as types from './gift.types.js'

let initstate = {
	giftsData:[],
	giveGiftStatus:'',
	costData:{
		totalCost:{},
		history:[]
	},
	incomeData:{
		totalIncome:{},
		history:[]
	}
};

export default (state = initstate,action) =>{
	switch (action.type){
		case types.SETGIFTSDATA:
			return Object.assign({},state,{
				giftsData:action.data
			})
		case types.GIVEGIFTS:
			return Object.assign({},state,{giveGiftStatus:action.data})
		case types.COST:
			return Object.assign({},state,{costData:action.data})
		case types.INCOME:
			return Object.assign({},state,{incomeData:action.data})
		default:
			return state;
	}
}