import $ from 'n-zepto'
import { dialogFunc } from './core.js';
import loadJS from "./util"
import "../css/dialog.css";
export function jdialog(){
   // if (!window.$) {
   //    loadJS('https://cdn.bootcss.com/echarts/4.3.0/echarts.min.js', null, true);
   // }else{
     
   // }
   return dialogFunc($,window,document,undefined)
};
window.jdialog=jdialog();