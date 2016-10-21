//
//      
//  customize this Vue 2 Font Awesome calendar component with your own classes
//    
//      version 0.1
//
//    Nathan Frick, 2016
//     MIT License
// 
   Vue.component('fa-day',{ 
      props: { dayOfMonth: {type:String,required:true} 
               ,faClass: {type:String,default:''} 
               ,faText: {type:String,default:''} 
               ,cellClss: {default:''}
               ,hoverTitle: {type:String}
           }
           ,computed: {
             facClass: function() {
               var faC = (this.dayOfMonth) ? this.faClass : '';
               return faC;
             }
             ,cTitle: function () {
               var tiC = (this.hoverTitle) ? this.hoverTitle : this.dayOfMonth;
               return tiC; 
             }
           }
           ,methods: { eclick: function() {
               this.$emit('eclick')
             }
           }
      ,template:`<div :title="cTitle" @click="eclick" :class="cellClss">{{ faClass.length ? faText:dayOfMonth }}<i :class="facClass"></i><slot></slot></div>`
   });


   Vue.component('fa-month-table',{ 
   	  props: { monthDate: {type:String,default:'03/15/2016'} // can be any day in month
               ,dateFormat: {type:String,default:'MM/DD/YYYY'}   	  
               ,tableClass: {type:String,default:'table table-bordered'} 
   	           ,tableCaptionClass: {type:String,default:'text-center lead'} 
  	           ,trClass: {type:String,default:''} 
  	           ,thClass: {type:String,default:'text-center'}
 	             ,tdClass: {type:String,default:'text-center'} 
               ,selectedCellClass: {type:String,default:'info'} 
   	           ,specialDays: { type:Array,
   	           	   default: function () { return [
                { date:'03/15/2016',title:'et 2?',text:'the Ides of March',faIconClass:'fa fa-commenting',cellClass:''}
                   	           	   	 
   	           	       ] ;  }
   	           	     	}
   	       }
   	  ,data: function() {
         return ({ 
           selectedDateStr:moment().format(this.dateFormat)
           ,baseDate: moment(this.monthDate,this.dateFormat).startOf('month').format(this.dateFormat)
   	         });
   	  }
   	  ,computed: {
   	  	baseDateMom: function() {
                return moment(this.baseDate,this.dateFormat); 
   	         }
   	    ,dayNames:function () { var dN = [];
           	 for (var i=0;i<7;i++) dN.push(moment().weekday(i).format('ddd'));
           	 	
           	 return dN;
           }
   	   ,baseDateTitle: function() {
               return this.baseDateMom.format('MMMM YYYY');
   	         }
   	   ,baseMonthN: function () {
   	   	  return this.baseDateMom.month();
   	   } 
  	   ,baseWeeks: function () {
   	    	var weeks = [];
   	    	// get the first day and last day in the weeks that are in this month
   	    	var iMom1 = moment(this.baseDateMom).startOf('week');
   	    	var iMomEnd = moment(this.baseDateMom).endOf('month').endOf('week');
   	    	while (iMom1.isBefore(iMomEnd))
   	    	{
	            // begin constructing a week
	            var days = [];
	            for (var i=0;i<7;i++) { 
	            	var specObj = this.getSpecialDayInfo(iMom1);  // cull from user array
	            	var dteStr0 = iMom1.date().toString();
	            	var dteStr = (this.baseMonthN == iMom1.month()) ? dteStr0 : '';
	              days.push({ 
	              	 dateStr:iMom1.format(this.dateFormat)
                  ,idom: iMom1.date() // integer
	              	,domnth: dteStr 
	              	,inCurrentMonth: (this.baseMonthN == iMom1.month())
	              	,faIconClass:specObj.faIconClass
	              	,xtext:specObj.text
                  ,cellClass:specObj.cellClass
                  ,title:specObj.title
	              });
	              iMom1.add(1,'days');
	            }
	            
	            weeks.push(days);
            }
            return weeks;
   	    }
   	  }
   	  ,methods: {  getSpecialDayInfo: function (iMomC) { 
         // lookup this day (iMomC) in specialDays array and get info
              var retObj = {};
              for (var i in this.specialDays)  {
              	if (this.specialDays[i].date) { if (moment(this.specialDays[i].date,this.dateFormat).isSame(iMomC)) {
                  if (this.specialDays[i].faIconClass)
                  	retObj.faIconClass = this.specialDays[i].faIconClass;
                  if (this.specialDays[i].text)
                    retObj.text = this.specialDays[i].text;
                  if (this.specialDays[i].cellClass)
                    retObj.cellClass = this.specialDays[i].cellClass;
                  if (this.specialDays[i].title)
                    retObj.title = this.specialDays[i].title;
                  // TODO: other attributes
				       }}
              }
              return retObj;
   	       }
           ,handleEClick: function (dayEntry,e) {
              this.selectedDateStr = dayEntry.dateStr;
              this.$emit('dateclicked',dayEntry.dateStr);
              //console.log(this.selectedDateStr);
              
           }
   	       ,bumpRight: function () {
   	       	  this.baseDate = moment(this.baseDate,this.dateFormat).add(1,'months').format(this.dateFormat);
   	       	  this.$emit('monthclicked',this.baseDate);
   	       }  
   	       ,bumpLeft: function () {
  	       	  this.baseDate = moment(this.baseDate,this.dateFormat).add(-1,'months').format(this.dateFormat);
              this.$emit('monthclicked',this.baseDate);
   	       }  
          ,tdClassObj: function(dday) {
             var retObj = {};
             retObj[this.tdClass] = true;
             retObj[this.selectedCellClass] = (dday.dateStr == this.selectedDateStr); 
             return retObj;
          }

       }
      ,template:`
  <table :class="tableClass">
   <caption :class="tableCaptionClass"><i class="fa fa-caret-left" @click="bumpLeft"></i>&nbsp;{{baseDateTitle}}&nbsp;<i class="fa fa-caret-right" @click="bumpRight"></i></caption>
   <thead>
     <tr><th :class="thClass" v-for="dayName in dayNames">{{dayName}}</th></tr>
   </thead>
   <tbody>
   <tr :class="trClass" v-for="weekAry in baseWeeks">
     <td :class="tdClassObj(day)" v-for="day in weekAry" >  
       <fa-day :day-of-month="day.domnth" :fa-class="day.faIconClass" :cell-clss="day.cellClass" :hover-title="day.title" @eclick="handleEClick(day,$event)">
           <span v-show="day.xtext">&nbsp;{{day.xtext}}</span> <!-- use child component slot -->
       </fa-day>
  </td></tr></tbody></table>
`

   });


