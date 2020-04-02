import { dialogFunc } from './core.js';
import "../css/dialog.css";
import { clientUtil } from './util'
var loading_dia={
    counter:0,
    dia:null
};
JoyDialog.showLoading=function(){
    loading_dia.counter++;
    if(!loading_dia.dia){
        var jdia=JoyDialog({
            type : 'loading',
            infoText: '',
            autoClose:0
        });
        loading_dia.dia = jdia;
    }
}
JoyDialog.hideLoading=function(){
    loading_dia.counter--;
    if(loading_dia.counter==0){
        loading_dia.close();
        loading_dia = null;        
    }
}
JoyDialog.clientObject=JSON.parse(JSON.stringify(clientUtil(window)));
export function JoyDialog(options){
   return dialogFunc(options)
}
window.JoyDialog=JoyDialog