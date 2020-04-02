import { dialogFunc } from './core.js';
import "../css/dialog.css";
import { clientUtil } from './util'
var loading_dia;
JoyDialog.showLoading=function(){
    if(!loading_dia){
        var jdia=JoyDialog({
            type : 'loading',
            infoText: '',
            autoClose:0
        });
        loading_dia = jdia;
    }
}
JoyDialog.hideLoading=function(){
    if(loading_dia){
        loading_dia.close();
        loading_dia = null;        
    }
}
JoyDialog.clientObject=JSON.parse(JSON.stringify(clientUtil(window)));
export function JoyDialog(options){
   return dialogFunc(options)
}
window.JoyDialog=JoyDialog