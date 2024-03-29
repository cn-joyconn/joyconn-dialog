import { dialogFunc } from './core.js';
import "../css/dialog.css";
import { clientUtil } from './util'
var loading_dia={
    counter:0,
    dia:null
};
JoyDialog.showLoading=function(msg){
    if(loading_dia.counter<0){
        loading_dia.counter=0;
    }
    loading_dia.counter++;
    if(!loading_dia.dia){
        var jdia=JoyDialog({
            type : 'loading',
            infoText: msg??'',
            autoClose:0
        });
        loading_dia.dia = jdia;
    }else{
        loading_dia.dia.update({infoText: msg??''})
    }
}
JoyDialog.hideLoading=function(){
    loading_dia.counter--;
    if(loading_dia.dia&&loading_dia.counter<=0){
        loading_dia.dia.close();
        loading_dia.dia = null;        
    }
}
JoyDialog.clientObject=JSON.parse(JSON.stringify(clientUtil(window)));
export function JoyDialog(options){
   return dialogFunc(options)
}
window.JoyDialog=JoyDialog